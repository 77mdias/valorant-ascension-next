"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { PLANOS } from "@/config/stripe-config"; // Corrigido o import
import { CheckCircle, Clock } from "lucide-react";

export function CurrentPlanBanner() {
  const { subscription, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <div className="mb-8 flex items-center justify-center rounded-lg bg-card/50 p-4">
        <Clock className="h-5 w-5 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Carregando informações...</span>
      </div>
    );
  }

  if (!subscription) return null;

  // Determina o tipo do plano baseado no stripePriceId
  const getPlanTypeFromPriceId = (priceId: string) => {
    const planEntries = Object.entries(PLANOS);
    const planEntry = planEntries.find(([_, value]) => value === priceId);
    return planEntry ? planEntry[0] : "DESCONHECIDO";
  };

  const currentPlanType = getPlanTypeFromPriceId(subscription.stripePriceId);
  const endDate = new Date(subscription.currentPeriodEnd).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div className="mb-8 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
      <div className="flex flex-col items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            <h3 className="text-lg font-medium text-foreground">
              Você já possui o plano {currentPlanType.toLowerCase()}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Sua assinatura está ativa até {endDate}
          </p>
        </div>
        <a
          href="/dashboard"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Ver Dashboard
        </a>
      </div>
    </div>
  );
}
