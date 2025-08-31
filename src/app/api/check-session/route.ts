import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";

import { authOptions } from "@/lib/auth";
import { retrieveSession, retrieveSubscription } from "@/lib/stripe";
import { db } from "@/lib/prisma";

// Schema para validação
const sessionSchema = z.object({
  sessionId: z.string().min(1, "ID da sessão é obrigatório"),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Obtém o sessionId da URL
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "ID da sessão não fornecido" },
        { status: 400 },
      );
    }

    // Valida o sessionId
    const { sessionId: validSessionId } = sessionSchema.parse({ sessionId });

    // Busca a sessão no Stripe
    const { data: checkoutSession, error: stripeError } = await retrieveSession(
      validSessionId,
      {
        expand: ["subscription"],
      },
    );

    if (stripeError || !checkoutSession) {
      console.error("Erro ao recuperar sessão do Stripe:", stripeError);
      return NextResponse.json(
        { error: "Erro ao verificar sessão de pagamento" },
        { status: 500 },
      );
    }

    // Verifica se temos uma subscription
    const stripeSubscription = checkoutSession.subscription as
      | Stripe.Subscription
      | undefined;

    if (!stripeSubscription && checkoutSession.mode === "subscription") {
      console.warn("Sessão de assinatura sem subscription:", {
        sessionId: checkoutSession.id,
        mode: checkoutSession.mode,
        paymentStatus: checkoutSession.payment_status,
      });
    }

    // Busca a assinatura no banco de dados
    let subscription = stripeSubscription
      ? await db.subscription.findFirst({
          where: {
            userId: session.user.id,
            stripeSubscriptionId: stripeSubscription.id,
          },
        })
      : null;

    // Se a sessão foi paga e temos uma subscription do Stripe, mas não temos no banco, vamos criar
    if (
      checkoutSession.payment_status === "paid" &&
      stripeSubscription &&
      !subscription &&
      checkoutSession.metadata?.userId === session.user.id
    ) {
      console.log("💾 Criando assinatura no banco de dados:", {
        sessionId: checkoutSession.id,
        subscriptionId: stripeSubscription.id,
        userId: session.user.id,
        status: stripeSubscription.status,
      });

      try {
        // Buscar detalhes completos da subscription no Stripe
        const { data: fullSubscription, error: subError } =
          await retrieveSubscription(stripeSubscription.id);

        if (subError || !fullSubscription) {
          console.error("Erro ao buscar subscription completa:", subError);
        } else {
          // Cast para any para acessar as propriedades que sabemos que existem
          const stripeData = fullSubscription as any;

          // Criar a assinatura no banco
          subscription = await db.subscription.create({
            data: {
              stripeSubscriptionId: fullSubscription.id,
              userId: session.user.id,
              stripePriceId: fullSubscription.items.data[0].price.id,
              status: fullSubscription.status,
              currentPeriodStart: new Date(
                (stripeData.current_period_start || 0) * 1000,
              ),
              currentPeriodEnd: new Date(
                (stripeData.current_period_end || 0) * 1000,
              ),
            },
          });

          console.log("✅ Assinatura criada no banco:", {
            id: subscription.id,
            stripeSubscriptionId: subscription.stripeSubscriptionId,
            status: subscription.status,
          });
        }
      } catch (error) {
        console.error("❌ Erro ao criar assinatura no banco:", error);
        // Não retornamos erro aqui para não quebrar o fluxo
      }
    }

    // Se a sessão foi paga mas ainda não temos registro no banco,
    // provavelmente ainda está processando
    if (checkoutSession.payment_status === "paid" && !subscription) {
      console.log("Pagamento confirmado, ainda processando:", {
        sessionId: checkoutSession.id,
        userId: session.user.id,
        subscriptionId: stripeSubscription?.id,
      });

      return NextResponse.json(
        {
          status: "processing",
          message:
            "Pagamento confirmado, finalizando configuração da assinatura",
        },
        { status: 200 },
      );
    }

    // Retorna os detalhes relevantes
    return NextResponse.json({
      status: checkoutSession.payment_status,
      planType: checkoutSession.metadata?.planType,
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
          }
        : null,
    });
  } catch (error) {
    console.error("Erro ao verificar status da sessão:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Erro ao verificar status da sessão" },
      { status: 500 },
    );
  }
}
