"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { PLANOS } from "@/config/stripe-config"; // Corrigido o import
import { CheckCircle } from "lucide-react";
import { PlanButton } from "./plan-button";
import type { PlanType } from "@/types/subscription";

interface PlanFeature {
  text: string;
}

interface PlanCardProps {
  type: PlanType;
  title: string;
  price: string;
  features: PlanFeature[];
  isHighlighted?: boolean;
  onAuthRequired: () => void;
  isLoading?: boolean;
}

export function PlanCard({
  type,
  title,
  price,
  features,
  isHighlighted,
  onAuthRequired,
  isLoading,
}: PlanCardProps) {
  const { subscription } = useSubscription();

  // Determina se este é o plano atual do usuário
  const isCurrentPlan =
    subscription && PLANOS[type] === subscription.stripePriceId;

  const baseClasses = `group rounded-xl border p-8 backdrop-blur-sm transition-all duration-300 ${
    isHighlighted
      ? "relative overflow-hidden border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-pink-900/20"
      : "border-gray-800 bg-gray-900/50 hover:bg-gray-900/70"
  }`;

  return (
    <div className={baseClasses}>
      {isHighlighted && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
      )}
      <div className={isHighlighted ? "relative z-10" : ""}>
        {/* Plano Atual Badge */}
        {isCurrentPlan && (
          <div className="mb-4 flex items-center justify-center rounded-full bg-green-600/20 py-1 text-sm text-green-400">
            <CheckCircle className="mr-1 h-4 w-4" />
            Seu Plano Atual
          </div>
        )}

        <div className="mb-6 text-center">
          <h3 className="mb-2 text-2xl font-bold">{title}</h3>
          <div className="mb-4 text-4xl font-bold text-white">{price}</div>
          <div className="text-sm text-gray-400">por mês</div>
        </div>

        <ul className="mb-8 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <svg
                className="mr-3 h-5 w-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {feature.text}
            </li>
          ))}
        </ul>

        <PlanButton planType={type} priceId={PLANOS[type]} />
      </div>
    </div>
  );
}
