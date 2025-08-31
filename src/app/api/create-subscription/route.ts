import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { retrieveSubscription } from "@/lib/stripe";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

const createSubscriptionSchema = z.object({
  stripeSubscriptionId: z.string().min(1, "ID da subscription é obrigatório"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { stripeSubscriptionId } = createSubscriptionSchema.parse(body);

    console.log("📦 Criando assinatura no banco:", {
      userId: session.user.id,
      stripeSubscriptionId,
    });

    // Verificar se a assinatura já existe no banco
    const existingSubscription = await db.subscription.findFirst({
      where: {
        stripeSubscriptionId,
      },
    });

    if (existingSubscription) {
      console.log("⚠️ Assinatura já existe no banco:", {
        id: existingSubscription.id,
        userId: existingSubscription.userId,
      });

      return NextResponse.json({
        subscription: existingSubscription,
        message: "Assinatura já existe",
      });
    }

    // Buscar detalhes da subscription no Stripe
    const { data: stripeSubscription, error: stripeError } =
      await retrieveSubscription(stripeSubscriptionId);

    if (stripeError || !stripeSubscription) {
      console.error("Erro ao buscar subscription no Stripe:", stripeError);
      return NextResponse.json(
        { error: "Erro ao verificar assinatura no Stripe" },
        { status: 400 },
      );
    }

    // Cast para any para acessar as propriedades que sabemos que existem
    const stripeData = stripeSubscription as any;

    // Verificar se a subscription pertence ao usuário atual
    // (através dos metadados ou customer)
    if (
      stripeData.metadata?.userId &&
      stripeData.metadata.userId !== session.user.id
    ) {
      console.warn("❌ Tentativa de criar subscription de outro usuário:", {
        subscriptionUserId: stripeData.metadata.userId,
        currentUserId: session.user.id,
      });

      return NextResponse.json(
        { error: "Assinatura não pertence ao usuário atual" },
        { status: 403 },
      );
    }

    // Criar a assinatura no banco
    const subscription = await db.subscription.create({
      data: {
        stripeSubscriptionId: stripeSubscription.id,
        userId: session.user.id,
        stripePriceId: stripeSubscription.items.data[0].price.id,
        status: stripeSubscription.status,
        currentPeriodStart: new Date(
          (stripeData.current_period_start || 0) * 1000,
        ),
        currentPeriodEnd: new Date((stripeData.current_period_end || 0) * 1000),
      },
    });

    console.log("✅ Assinatura criada no banco:", {
      id: subscription.id,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      status: subscription.status,
    });

    return NextResponse.json({
      subscription,
      message: "Assinatura criada com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao criar assinatura:", error);

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
      { error: "Erro interno ao criar assinatura" },
      { status: 500 },
    );
  }
}
