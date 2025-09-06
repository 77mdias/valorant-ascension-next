import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { constructWebhookEvent } from "@/lib/stripe";
import { db } from "@/lib/prisma";

export const runtime = "nodejs";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "payment_intent.succeeded",
  "payment_intent.created",
  "invoice.created",
  "invoice.finalized",
  "invoice.paid",
  "invoice.payment_succeeded",
]);

export async function POST(req: NextRequest) {
  try {
    console.log("🔔 Webhook recebido");

    // Verificar assinatura do webhook
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;

    if (!signature || !webhookSecret) {
      console.error("❌ Webhook: Assinatura ou chave secreta ausente", {
        hasSignature: !!signature,
        hasSecret: !!webhookSecret,
      });
      return NextResponse.json(
        { error: "Configuração do webhook inválida" },
        { status: 400 },
      );
    }

    // Obter o corpo da requisição como buffer
    const chunks = [];
    const reader = req.body?.getReader();
    if (!reader) {
      return NextResponse.json(
        { error: "Corpo da requisição não encontrado" },
        { status: 400 },
      );
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const rawBody = Buffer.concat(chunks);

    console.log("📦 Webhook: Dados recebidos", {
      signature,
      bodyLength: rawBody.length,
      // Não logar o corpo para evitar problemas de formatação
    });

    // Construir e verificar o evento
    const { data: event, error: webhookError } = await constructWebhookEvent(
      rawBody,
      signature,
      webhookSecret,
    );

    if (webhookError || !event) {
      console.error("❌ Webhook: Erro na verificação", {
        error: webhookError,
        signatureHeader: signature,
        webhookSecretPreview: webhookSecret.slice(0, 10) + "...",
        bodyLength: rawBody.length,
      });
      return NextResponse.json(
        { error: "Erro na verificação do webhook" },
        { status: 400 },
      );
    }

    console.log("✅ Webhook: Evento verificado", {
      type: event.type,
      id: event.id,
    });

    // Verificar se é um evento relevante
    if (!relevantEvents.has(event.type)) {
      console.log("⏭️ Webhook: Evento ignorado", event.type);
      return NextResponse.json({ received: true });
    }

    try {
      // Processar o evento
      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription = event.data.object;
          console.log("📦 Webhook: Processando assinatura", {
            id: subscription.id,
            status: subscription.status,
            metadata: subscription.metadata,
          });

          if (!subscription.metadata?.userId) {
            console.warn("⚠️ Webhook: Metadata ausente na assinatura", {
              id: subscription.id,
              metadata: subscription.metadata,
            });
            return NextResponse.json({ received: true });
          }

          await db.subscription.upsert({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            create: {
              stripeSubscriptionId: subscription.id,
              userId: subscription.metadata.userId,
              stripePriceId: subscription.items.data[0].price.id,
              status: subscription.status,
              currentPeriodStart: new Date(
                subscription.current_period_start * 1000,
              ),
              currentPeriodEnd: new Date(
                subscription.current_period_end * 1000,
              ),
              cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
            },
            update: {
              status: subscription.status,
              stripePriceId: subscription.items.data[0].price.id,
              currentPeriodStart: new Date(
                subscription.current_period_start * 1000,
              ),
              currentPeriodEnd: new Date(
                subscription.current_period_end * 1000,
              ),
              cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
            },
          });

          console.log("✅ Webhook: Assinatura atualizada");
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object;

          if (!subscription.metadata?.userId) {
            console.warn("⚠️ Webhook: Metadata ausente na assinatura", {
              id: subscription.id,
              metadata: subscription.metadata,
            });
            return NextResponse.json({ received: true });
          }

          console.log("📦 Webhook: Cancelando assinatura", {
            id: subscription.id,
            userId: subscription.metadata.userId,
          });

          await db.subscription.update({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            data: {
              status: "canceled",
              currentPeriodEnd: new Date(
                subscription.current_period_end * 1000,
              ),
              cancelAtPeriodEnd: true,
            },
          });

          console.log("✅ Webhook: Assinatura cancelada");
          break;
        }

        // Eventos de checkout e pagamento
        case "checkout.session.completed":
        case "payment_intent.succeeded":
        case "payment_intent.created":
        case "invoice.created":
        case "invoice.finalized":
        case "invoice.paid":
        case "invoice.payment_succeeded": {
          console.log(`✅ Webhook: Evento ${event.type} processado`, {
            id: event.id,
            object: event.data.object.id,
          });
          break;
        }

        default: {
          console.log("⚠️ Webhook: Evento não tratado", event.type);
        }
      }

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error("❌ Webhook: Erro ao processar evento", {
        error,
        type: event.type,
        eventId: event.id,
      });

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("🔴 Webhook: Erro do Prisma", {
          code: error.code,
          meta: error.meta,
        });
      }

      // Retornamos 200 mesmo com erro para evitar reenvios do Stripe
      return NextResponse.json(
        { error: "Erro ao processar evento", type: event.type },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("❌ Webhook: Erro fatal", error);
    return NextResponse.json(
      { error: "Erro interno no webhook" },
      { status: 500 },
    );
  }
}
