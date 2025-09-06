import { useState, useEffect } from "react";
import axios from "axios";

interface SubscriptionDetails {
  id: string;
  status: string;
  currentPeriodEnd: Date;
}

interface SessionStatus {
  status: "paid" | "unpaid" | "processing" | "error";
  planType?: string;
  subscription?: SubscriptionDetails | null;
  message?: string;
}

export function useStripeSession(sessionId?: string | null) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(
    null,
  );

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }

    let retryCount = 0;
    const maxRetries = 10; // Máximo de 10 tentativas (30 segundos)

    const checkSession = async () => {
      try {
        const response = await axios.get(
          `/api/check-session?sessionId=${sessionId}`,
        );

        setSessionStatus(response.data);
        setError(null);

        // Se o status for "processing", continua verificando
        if (response.data.status === "processing" && retryCount < maxRetries) {
          retryCount++;

          console.log(
            `🔄 Tentativa ${retryCount}/${maxRetries} - Status: processing`,
          );

          // A cada 3 tentativas, tenta sincronizar as assinaturas
          if (retryCount % 3 === 0) {
            try {
              console.log("🔄 Executando sincronização de assinaturas...");
              await axios.post("/api/sync-subscriptions");
              console.log("✅ Sincronização executada");
            } catch (syncError) {
              console.warn("⚠️ Erro na sincronização:", syncError);
            }
          }

          setTimeout(checkSession, 3000); // Verifica novamente após 3 segundos
        } else if (
          response.data.status === "processing" &&
          retryCount >= maxRetries
        ) {
          // Após muitas tentativas sem sucesso, mostra erro
          setError(
            "Timeout: Não foi possível confirmar o pagamento. Tente recarregar a página.",
          );
          setIsLoading(false);
        } else {
          // Status final (paid, unpaid, error)
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Erro ao verificar status do pagamento",
        );
        setIsLoading(false);
      }
    };

    checkSession();
  }, [sessionId]);

  // Função para tentar criar assinatura manualmente
  const createSubscription = async (stripeSubscriptionId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post("/api/create-subscription", {
        stripeSubscriptionId,
      });

      console.log("✅ Assinatura criada:", response.data);

      // Recarregar o status da sessão
      const sessionResponse = await axios.get(
        `/api/check-session?sessionId=${sessionId}`,
      );

      setSessionStatus(sessionResponse.data);
      setIsLoading(false);

      return response.data;
    } catch (error) {
      console.error("❌ Erro ao criar assinatura:", error);
      setError(
        error instanceof Error ? error.message : "Erro ao criar assinatura",
      );
      setIsLoading(false);
      throw error;
    }
  };

  return {
    isLoading,
    error,
    sessionStatus,
    createSubscription,
  };
}
