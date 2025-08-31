export type PlanType = "BASICO" | "INTERMEDIARIO" | "AVANCADO";

export interface Subscription {
  id: string;
  status: string;
  stripePriceId: string;
  currentPeriodEnd: Date;
  stripeSubscriptionId: string;
  cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionResponse {
  subscription: Subscription | null;
  canUpgrade: boolean;
  canDowngrade: boolean;
  nextPlan?: {
    type: string;
    priceId: string;
  } | null;
  currentPlan?: string;
}
