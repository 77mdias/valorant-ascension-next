import Stripe from "stripe";
import { WebhookEvent } from "@/types/stripe";

class StripeService {
  private static instance: Stripe | null = null;

  static getInstance(): Stripe | null {
    if (this.instance) {
      return this.instance;
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error("[Stripe] Chave secreta não encontrada");
      return null;
    }

    try {
      this.instance = new Stripe(secretKey, {
        apiVersion: "2025-07-30.basil",
        appInfo: {
          name: "Valorant Ascension",
          version: "1.0.0",
        },
      });

      return this.instance;
    } catch (error) {
      console.error("[Stripe] Erro ao inicializar:", error);
      return null;
    }
  }
}

// Tipo genérico para operações do Stripe
type StripeOperationResult<T> = Promise<{
  data: T | null;
  error: string | null;
}>;

// Função segura para operações do Stripe
async function stripeOperation<T>(
  operation: (stripe: Stripe) => Promise<T>,
): StripeOperationResult<T> {
  const stripe = StripeService.getInstance();

  if (!stripe) {
    return {
      data: null,
      error: "Serviço de pagamento indisponível no momento",
    };
  }

  try {
    const result = await operation(stripe);
    return { data: result, error: null };
  } catch (error) {
    console.error("[Stripe] Erro na operação:", error);
    if (error instanceof Error) {
      return {
        data: null,
        error: error.message,
      };
    }
    return {
      data: null,
      error: "Ocorreu um erro ao processar a operação de pagamento",
    };
  }
}

// Helper para criar sessão de checkout
export async function createCheckoutSession(
  params: Stripe.Checkout.SessionCreateParams,
): StripeOperationResult<Stripe.Checkout.Session> {
  return stripeOperation((stripe) => stripe.checkout.sessions.create(params));
}

// Helper para recuperar sessão
export async function retrieveSession(
  sessionId: string,
  params?: Stripe.Checkout.SessionRetrieveParams,
): StripeOperationResult<Stripe.Checkout.Session> {
  return stripeOperation((stripe) =>
    stripe.checkout.sessions.retrieve(sessionId, params),
  );
}

// Helper para verificar assinatura de webhook
export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string,
): StripeOperationResult<WebhookEvent> {
  try {
    const stripe = StripeService.getInstance();
    if (!stripe) {
      return {
        data: null,
        error: "Serviço de pagamento indisponível no momento",
      };
    }

    // Garantir que o payload é um Buffer
    const rawPayload = Buffer.isBuffer(payload)
      ? payload
      : Buffer.from(payload);

    // Construir o evento
    const event = await stripe.webhooks.constructEventAsync(
      rawPayload,
      signature,
      webhookSecret,
    );

    return { data: event as WebhookEvent, error: null };
  } catch (error) {
    console.error("[Stripe] Erro ao construir evento webhook:", error);
    if (error instanceof Error) {
      return {
        data: null,
        error: `Erro na verificação do webhook: ${error.message}`,
      };
    }
    return {
      data: null,
      error: "Erro na verificação do webhook",
    };
  }
}

// Helper para recuperar assinatura
export async function retrieveSubscription(
  subscriptionId: string,
): StripeOperationResult<Stripe.Subscription> {
  return stripeOperation((stripe) =>
    stripe.subscriptions.retrieve(subscriptionId),
  );
}

// Helper para cancelar assinatura
export async function cancelSubscription(
  subscriptionId: string,
): StripeOperationResult<Stripe.Subscription> {
  return stripeOperation((stripe) =>
    stripe.subscriptions.cancel(subscriptionId),
  );
}

// Helper para atualizar assinatura
export async function updateSubscription(
  subscriptionId: string,
  params: Stripe.SubscriptionUpdateParams,
): StripeOperationResult<Stripe.Subscription> {
  return stripeOperation((stripe) =>
    stripe.subscriptions.update(subscriptionId, params),
  );
}
