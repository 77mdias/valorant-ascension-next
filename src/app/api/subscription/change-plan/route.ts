import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { updateSubscription } from "@/lib/stripe";
import { db } from "@/lib/prisma";
import { PLANOS } from "@/config/stripe-config";
import type { PlanType } from "@/types/subscription";

const changePlanSchema = z.object({
  subscriptionId: z.string().min(1, "ID da assinatura é obrigatório"),
  newPlanType: z.enum(["BASICO", "INTERMEDIARIO", "AVANCADO"] as const),
});

const PLANO_ORDEM = {
  BASICO: 0,
  INTERMEDIARIO: 1,
  AVANCADO: 2,
} as const;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { subscriptionId, newPlanType } = changePlanSchema.parse(body);

    // Verifica se a assinatura pertence ao usuário
    const subscription = await db.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: session.user.id,
        status: {
          in: ["active", "trialing"],
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Assinatura não encontrada" },
        { status: 404 },
      );
    }

    const newPriceId = PLANOS[newPlanType];
    if (!newPriceId) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    // Atualiza a assinatura no Stripe
    const { data: updatedStripeSubscription, error: stripeError } =
      await updateSubscription(subscription.stripeSubscriptionId, {
        items: [
          {
            id: subscription.stripeSubscriptionId, // Usar o ID da subscription item
            price: newPriceId,
          },
        ],
        proration_behavior: "always_invoice",
      });

    if (stripeError || !updatedStripeSubscription) {
      console.error("Erro ao atualizar no Stripe:", stripeError);
      return NextResponse.json(
        { error: "Erro ao processar mudança de plano" },
        { status: 500 },
      );
    }

    // Cast para any para acessar as propriedades que sabemos que existem
    const stripeData = updatedStripeSubscription as any;

    // Atualiza o registro no banco de dados
    const updatedSubscription = await db.subscription.update({
      where: { id: subscriptionId },
      data: {
        stripePriceId: newPriceId,
        currentPeriodEnd: new Date((stripeData.current_period_end || 0) * 1000),
      },
    });

    console.log("✅ Plano alterado com sucesso:", {
      subscriptionId,
      oldPriceId: subscription.stripePriceId,
      newPriceId,
      newPlanType,
    });

    return NextResponse.json({
      message: "Plano atualizado com sucesso",
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error("Erro ao mudar plano:", error);

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

    return NextResponse.json({ error: "Erro ao mudar plano" }, { status: 500 });
  }
}
