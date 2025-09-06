import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { retrieveSubscription } from "@/lib/stripe";
import { db } from "@/lib/prisma";
import { PLANOS } from "@/config/stripe-config";

const PLANO_ORDEM = {
  BASICO: 0,
  INTERMEDIARIO: 1,
  AVANCADO: 2,
} as const;

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Busca a assinatura ativa do usuário
    const subscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: {
          in: ["active", "trialing"],
        },
      },
    });

    if (!subscription) {
      return NextResponse.json({
        subscription: null,
        canUpgrade: false,
        canDowngrade: false,
        nextPlan: null,
      });
    }

    // Busca mais detalhes da assinatura no Stripe
    const { data: stripeSubscription, error: stripeError } =
      await retrieveSubscription(subscription.stripeSubscriptionId);

    if (stripeError || !stripeSubscription) {
      console.error("Erro ao buscar subscription no Stripe:", stripeError);
      // Retorna dados do banco mesmo se não conseguir buscar no Stripe
    }

    // Determina o plano atual baseado no stripePriceId
    const getPlanTypeFromPriceId = (priceId: string) => {
      const planEntries = Object.entries(PLANOS);
      const planEntry = planEntries.find(([_, value]) => value === priceId);
      return planEntry ? planEntry[0] : "DESCONHECIDO";
    };

    const currentPlan = getPlanTypeFromPriceId(subscription.stripePriceId);
    const currentLevel =
      PLANO_ORDEM[currentPlan as keyof typeof PLANO_ORDEM] ?? -1;

    // Verifica se pode fazer upgrade ou downgrade
    const canUpgrade = currentLevel < PLANO_ORDEM.AVANCADO && currentLevel >= 0;
    const canDowngrade = currentLevel > PLANO_ORDEM.BASICO && currentLevel >= 0;

    // Determina o próximo plano disponível (para upgrade)
    let nextPlan = null;
    if (canUpgrade) {
      const nextPlanType = Object.keys(PLANO_ORDEM).find(
        (plan) =>
          PLANO_ORDEM[plan as keyof typeof PLANO_ORDEM] === currentLevel + 1,
      );
      if (nextPlanType) {
        nextPlan = {
          type: nextPlanType,
          priceId: PLANOS[nextPlanType as keyof typeof PLANOS],
        };
      }
    }

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        stripePriceId: subscription.stripePriceId,
        currentPeriodEnd: subscription.currentPeriodEnd,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false,
      },
      canUpgrade,
      canDowngrade,
      nextPlan,
      currentPlan,
    });
  } catch (error) {
    console.error("Erro ao buscar assinatura:", error);
    return NextResponse.json(
      { error: "Erro ao buscar informações da assinatura" },
      { status: 500 },
    );
  }
}
