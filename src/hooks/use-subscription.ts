import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import type {
  Subscription,
  SubscriptionResponse,
  PlanType,
} from "@/types/subscription";

export function useSubscription() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(
    null,
  );

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        const response =
          await axios.get<SubscriptionResponse>("/api/subscription");
        setSubscription(response.data);
        setError(null);
      } catch (error) {
        console.error("Erro ao buscar assinatura:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Erro ao carregar informações da assinatura",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [session]);

  const cancelSubscription = async () => {
    if (!subscription?.subscription) return;

    try {
      await axios.post("/api/subscription/cancel", {
        subscriptionId: subscription.subscription.id,
      });

      // Atualiza o estado local
      setSubscription((prev) =>
        prev
          ? {
              ...prev,
              subscription: prev.subscription
                ? { ...prev.subscription, cancelAtPeriodEnd: true }
                : null,
            }
          : null,
      );
    } catch (error) {
      console.error("Erro ao cancelar assinatura:", error);
      throw error;
    }
  };

  const changePlan = async (newPlanType: PlanType) => {
    if (!subscription?.subscription) return;

    try {
      const response = await axios.post<{ subscription: Subscription }>(
        "/api/subscription/change-plan",
        {
          subscriptionId: subscription.subscription.id,
          newPlanType,
        },
      );

      // Atualiza o estado local com a nova assinatura
      setSubscription((prev) =>
        prev
          ? {
              ...prev,
              subscription: response.data.subscription,
            }
          : null,
      );
    } catch (error) {
      console.error("Erro ao mudar plano:", error);
      throw error;
    }
  };

  return {
    isLoading,
    error,
    subscription: subscription?.subscription,
    canUpgrade: subscription?.canUpgrade ?? false,
    canDowngrade: subscription?.canDowngrade ?? false,
    nextPlan: subscription?.nextPlan,
    cancelSubscription,
    changePlan,
  };
}
