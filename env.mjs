import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_STRIPE_PRICE_BASICO: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRICE_INTERMEDIARIO: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRICE_AVANCADO: z.string().min(1),
  },
  runtimeEnv: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET_KEY: process.env.STRIPE_WEBHOOK_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PRICE_BASICO: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASICO,
    NEXT_PUBLIC_STRIPE_PRICE_INTERMEDIARIO: process.env.NEXT_PUBLIC_STRIPE_PRICE_INTERMEDIARIO,
    NEXT_PUBLIC_STRIPE_PRICE_AVANCADO: process.env.NEXT_PUBLIC_STRIPE_PRICE_AVANCADO,
  },
});