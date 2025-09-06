"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { PLANOS } from "@/config/stripe-config"; // Corrigido o import
import { CheckCircle, Clock } from "lucide-react";

export function CurrentPlanBanner() {
  const { subscription, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <div className="mb-8 flex items-center justify-center rounded-lg bg-gray-900/50 p-4">
        <Clock className="h-5 w-5 animate-spin text-purple-500" />
        <span className="ml-2 text-gray-300">Carregando informações...</span>
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
    <div className="mb-8 rounded-lg bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            <h3 className="text-lg font-medium text-white">
              Você já possui o plano {currentPlanType.toLowerCase()}
            </h3>
          </div>
          <p className="text-sm text-gray-300">
            Sua assinatura está ativa até {endDate}
          </p>
        </div>
        <a
          href="/dashboard"
          className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Ver Dashboard
        </a>
      </div>
    </div>
  );
}
