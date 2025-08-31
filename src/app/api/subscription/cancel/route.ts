import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { updateSubscription } from "@/lib/stripe";
import { db } from "@/lib/prisma";

const cancelSchema = z.object({
  subscriptionId: z.string().min(1, "ID da assinatura é obrigatório"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { subscriptionId } = cancelSchema.parse(body);

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

    // Cancela a assinatura no Stripe (ao final do período)
    const { data: updatedStripeSubscription, error: stripeError } =
      await updateSubscription(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

    if (stripeError || !updatedStripeSubscription) {
      console.error("Erro ao cancelar no Stripe:", stripeError);
      return NextResponse.json(
        { error: "Erro ao processar cancelamento" },
        { status: 500 },
      );
    }

    // Atualiza o status no banco de dados
    await db.subscription.update({
      where: { id: subscriptionId },
      data: {
        cancelAtPeriodEnd: true,
      },
    });

    console.log("✅ Assinatura marcada para cancelamento:", {
      id: subscription.id,
      stripeId: subscription.stripeSubscriptionId,
    });

    return NextResponse.json({
      message: "Assinatura será cancelada ao final do período",
    });
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);

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
      { error: "Erro ao cancelar assinatura" },
      { status: 500 },
    );
  }
}
