"use client";

import { useState } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/components/ui/use-toast";
import { PLANOS } from "@/config/stripe-config";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpCircle,
  ArrowDownCircle,
  XCircle,
} from "lucide-react";

export function SubscriptionStatus() {
  const { toast } = useToast();
  const {
    isLoading,
    error,
    subscription,
    canUpgrade,
    canDowngrade,
    nextPlan,
    cancelSubscription,
    changePlan,
  } = useSubscription();
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Clock className="h-5 w-5 animate-spin text-purple-500" />
        <span className="ml-2">Carregando informações da assinatura...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <AlertCircle className="h-5 w-5" />
        <span className="ml-2">{error}</span>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5" />
          <span className="ml-2">Você não possui uma assinatura ativa</span>
        </div>
      </div>
    );
  }

  const handleCancelSubscription = async () => {
    try {
      setIsCanceling(true);
      await cancelSubscription();
      toast({
        title: "Assinatura cancelada",
        description:
          "Sua assinatura será cancelada ao final do período atual. Você ainda tem acesso até lá.",
      });
    } catch (error) {
      toast({
        title: "Erro ao cancelar",
        description:
          "Não foi possível cancelar sua assinatura. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const handleChangePlan = async (
    newPlanType: "BASICO" | "INTERMEDIARIO" | "AVANCADO",
  ) => {
    try {
      setIsChangingPlan(true);
      await changePlan(newPlanType);
      toast({
        title: "Plano alterado",
        description: "Seu plano foi atualizado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro ao mudar plano",
        description:
          "Não foi possível alterar seu plano. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPlan(false);
    }
  };

  const endDate = new Date(subscription.currentPeriodEnd).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );

  // Determina o tipo do plano baseado no stripePriceId
  const getPlanTypeFromPriceId = (priceId: string) => {
    const planEntries = Object.entries(PLANOS);
    const planEntry = planEntries.find(([_, value]) => value === priceId);
    return planEntry ? planEntry[0] : "DESCONHECIDO";
  };

  const currentPlanType = getPlanTypeFromPriceId(subscription.stripePriceId);

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Status da Assinatura</h2>
          <p className="text-sm text-gray-500">
            Plano {currentPlanType.toLowerCase()}
          </p>
        </div>
        <div className="flex items-center">
          {["active", "trialing"].includes(subscription.status) && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="ml-2">Ativa</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Sua assinatura está válida até {endDate}
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        {canUpgrade && nextPlan && (
          <button
            onClick={() =>
              handleChangePlan(
                nextPlan.type as "BASICO" | "INTERMEDIARIO" | "AVANCADO",
              )
            }
            disabled={isChangingPlan}
            className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            Fazer Upgrade
          </button>
        )}

        {canDowngrade && (
          <button
            onClick={() => handleChangePlan("BASICO")}
            disabled={isChangingPlan}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <ArrowDownCircle className="mr-2 h-4 w-4" />
            Fazer Downgrade
          </button>
        )}

        <button
          onClick={handleCancelSubscription}
          disabled={isCanceling}
          className="inline-flex items-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Cancelar Assinatura
        </button>
      </div>
    </div>
  );
}
