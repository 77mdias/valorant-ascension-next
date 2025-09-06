const getEnvVar = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    console.error(`⚠️  Missing required environment variable: ${key}`);
    return "";
  }

  return value;
};

export const env = {
  stripe: {
    secretKey: getEnvVar("STRIPE_SECRET_KEY"),
    publishableKey: getEnvVar("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
    webhookSecret: getEnvVar("STRIPE_WEBHOOK_SECRET_KEY"),
    prices: {
      basic: getEnvVar("STRIPE_PRICE_ID_BASICO"),
      intermediate: getEnvVar("STRIPE_PRICE_ID_INTERMEDIARIO"),
      advanced: getEnvVar("STRIPE_PRICE_ID_AVANCADO"),
    },
  },
};
