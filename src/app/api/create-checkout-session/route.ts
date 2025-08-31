import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";
import { db } from "@/lib/prisma";

// Schema para validação
const checkoutSchema = z.object({
  priceId: z.string().min(1, "ID do preço é obrigatório"),
  planType: z
    .enum(["BASICO", "INTERMEDIARIO", "AVANCADO"])
    .describe("Tipo de plano"),
});

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Você precisa estar logado para continuar" },
        { status: 401 },
      );
    }

    // Validar dados recebidos
    const body = await req.json();
    console.log("📦 Dados recebidos:", body);

    const validationResult = checkoutSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { priceId, planType } = validationResult.data;

    // Verificar assinatura existente
    const existingSubscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "active",
      },
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: "Você já possui uma assinatura ativa" },
        { status: 400 },
      );
    }

    // Verificar e formatar URL base
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 },
      );
    }

    const formattedBaseUrl = baseUrl.startsWith("http")
      ? baseUrl
      : `https://${baseUrl}`;

    // Criar sessão de checkout
    console.log("🔄 Criando sessão de checkout...");
    const { data: checkoutSession, error: stripeError } =
      await createCheckoutSession({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${formattedBaseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${formattedBaseUrl}/payment/error?canceled=true`,
        metadata: {
          userId: session.user.id,
          planType,
          priceId,
        },
        subscription_data: {
          metadata: {
            userId: session.user.id,
            planType,
            priceId,
          },
        },
        customer_email: session.user.email || undefined,
      });

    if (stripeError || !checkoutSession) {
      console.error("❌ Erro ao criar sessão:", stripeError);
      return NextResponse.json(
        { error: stripeError || "Erro ao criar sessão de pagamento" },
        { status: 500 },
      );
    }

    console.log("✅ Sessão criada com sucesso:", {
      sessionId: checkoutSession.id,
      userId: session.user.id,
      planType,
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error("❌ Erro inesperado:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
