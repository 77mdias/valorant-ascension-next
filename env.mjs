import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Database variables
    DATABASE_URL: z.string().min(1),
    DIRECT_URL: z.string().min(1),
    DATABASE_URL_PROD: z.string().min(1),
    DIRECT_URL_PROD: z.string().min(1),

    // Email variables
    EMAIL_USER: z.string().min(1),
    EMAIL_PASSWORD: z.string().min(1),

    // Stripe variables
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_STRIPE_PRICE_BASICO: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRICE_INTERMEDIARIO: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRICE_AVANCADO: z.string().min(1),
  },
  runtimeEnv: {
    // Database variables
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,


    // Email variables
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

    // Database prod
    DATABASE_URL_PROD: process.env.DATABASE_URL_PROD,
    DIRECT_URL_PROD: process.env.DIRECT_URL_PROD,

    // Stripe variables
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET_KEY: process.env.STRIPE_WEBHOOK_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PRICE_BASICO: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASICO,
    NEXT_PUBLIC_STRIPE_PRICE_INTERMEDIARIO: process.env.NEXT_PUBLIC_STRIPE_PRICE_INTERMEDIARIO,
    NEXT_PUBLIC_STRIPE_PRICE_AVANCADO: process.env.NEXT_PUBLIC_STRIPE_PRICE_AVANCADO,
  },
});