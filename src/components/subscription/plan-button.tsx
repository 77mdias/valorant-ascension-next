"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { PLANOS, getPlanTypeFromPriceId } from "@/config/stripe-config";
import type { PlanType } from "@/types/subscription";

interface PlanButtonProps {
  planType: PlanType;
  priceId: string;
}

export function PlanButton({ planType, priceId }: PlanButtonProps) {
  const { isAuthenticated } = useAuth();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const { createCheckoutSession, isLoading: checkoutLoading } =
    useStripeCheckout();

  const isLoading = subscriptionLoading || checkoutLoading;

  // Se não estiver autenticado, mostrar botão de login
  if (!isAuthenticated) {
    return (
      <button
        onClick={() => (window.location.href = "/auth/signin")}
        className="w-full rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-gray-700"
      >
        Fazer Login para Assinar
      </button>
    );
  }

  // Se o usuário tem uma assinatura ativa
  if (subscription && subscription.stripePriceId) {
    // Determinar o plano atual baseado no stripePriceId
    const currentPlanType = getPlanTypeFromPriceId(subscription.stripePriceId);

    // Se não conseguir determinar o plano atual, tratar como sem plano
    if (!currentPlanType) {
      return (
        <button
          onClick={() => createCheckoutSession(priceId, planType)}
          disabled={isLoading}
          className="w-full rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </span>
          ) : (
            "Assinar Agora"
          )}
        </button>
      );
    }

    // Se é o plano atual
    if (currentPlanType === planType) {
      return (
        <button
          disabled
          className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white opacity-75"
        >
          Plano Atual
        </button>
      );
    }

    // Determinar se é upgrade ou downgrade
    const currentLevel = ["BASICO", "INTERMEDIARIO", "AVANCADO"].indexOf(
      currentPlanType,
    );
    const targetLevel = ["BASICO", "INTERMEDIARIO", "AVANCADO"].indexOf(
      planType,
    );

    if (targetLevel > currentLevel) {
      // Upgrade
      return (
        <button
          onClick={() => createCheckoutSession(priceId, planType)}
          disabled={isLoading}
          className="w-full rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </span>
          ) : (
            "Fazer Upgrade"
          )}
        </button>
      );
    }

    if (targetLevel < currentLevel) {
      // Downgrade
      return (
        <button
          onClick={() => createCheckoutSession(priceId, planType)}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </span>
          ) : (
            "Fazer Downgrade"
          )}
        </button>
      );
    }
  }

  // Caso padrão: usuário sem assinatura
  return (
    <button
      onClick={() => createCheckoutSession(priceId, planType)}
      disabled={isLoading}
      className="w-full rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </span>
      ) : (
        "Assinar Agora"
      )}
    </button>
  );
}
