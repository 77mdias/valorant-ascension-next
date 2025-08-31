import { NextResponse } from "next/server";
import { retrieveSubscription } from "@/lib/stripe";
import { db } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST() {
  try {
    console.log("🔄 Iniciando sincronização de assinaturas");

    // Buscar todas as assinaturas ativas no banco que precisam ser verificadas
    const subscriptions = await db.subscription.findMany({
      where: {
        status: {
          in: ["active", "trialing", "incomplete"],
        },
      },
    });

    console.log(
      `📦 Encontradas ${subscriptions.length} assinaturas para verificar`,
    );

    let updated = 0;
    let errors = 0;

    for (const subscription of subscriptions) {
      try {
        // Buscar status atual no Stripe
        const { data: stripeSubscription, error } = await retrieveSubscription(
          subscription.stripeSubscriptionId,
        );

        if (error || !stripeSubscription) {
          console.warn(
            `⚠️ Erro ao buscar assinatura ${subscription.stripeSubscriptionId}: ${error}`,
          );
          errors++;
          continue;
        }

        // Cast para any para acessar as propriedades que sabemos que existem
        const stripeData = stripeSubscription as any;

        // Verificar se precisa atualizar
        const needsUpdate =
          subscription.status !== stripeSubscription.status ||
          subscription.currentPeriodEnd.getTime() !==
            (stripeData.current_period_end || 0) * 1000;

        if (needsUpdate) {
          await db.subscription.update({
            where: { id: subscription.id },
            data: {
              status: stripeSubscription.status,
              currentPeriodStart: new Date(
                (stripeData.current_period_start || 0) * 1000,
              ),
              currentPeriodEnd: new Date(
                (stripeData.current_period_end || 0) * 1000,
              ),
            },
          });

          console.log(
            `✅ Assinatura ${subscription.stripeSubscriptionId} atualizada: ${stripeSubscription.status}`,
          );
          updated++;
        }
      } catch (error) {
        console.error(
          `❌ Erro ao processar assinatura ${subscription.stripeSubscriptionId}:`,
          error,
        );
        errors++;
      }
    }

    console.log(
      `🎯 Sincronização concluída: ${updated} atualizadas, ${errors} erros`,
    );

    return NextResponse.json({
      success: true,
      processed: subscriptions.length,
      updated,
      errors,
    });
  } catch (error) {
    console.error("❌ Erro na sincronização de assinaturas:", error);
    return NextResponse.json(
      { error: "Erro interno na sincronização" },
      { status: 500 },
    );
  }
}
