import Stripe from "stripe";

declare module "stripe" {
  namespace Stripe {
    namespace Checkout {
      interface Session {
        current_period_start?: number;
        current_period_end?: number;
      }
    }

    interface Subscription {
      current_period_start: number;
      current_period_end: number;
    }
  }
}
