import Stripe from "stripe";

export type StripeMetadata = {
  userId: string;
  planType: string;
  priceId?: string;
};

export type StripeSubscription = Stripe.Subscription & {
  metadata: StripeMetadata;
  current_period_start: number;
  current_period_end: number;
  status: Stripe.Subscription.Status;
  items: Stripe.ApiList<Stripe.SubscriptionItem>;
};

export type StripeCheckoutSession = Stripe.Checkout.Session & {
  metadata: StripeMetadata;
  subscription: string | null;
};

export type WebhookEvent = {
  id: string;
  type: WebhookEventType;
  data: {
    object: any; // Permitindo qualquer objeto pois temos vários tipos de eventos
  };
};

export type WebhookEventType =
  | "checkout.session.completed"
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | "payment_intent.succeeded"
  | "payment_intent.created"
  | "invoice.created"
  | "invoice.finalized"
  | "invoice.paid"
  | "invoice.payment_succeeded";
