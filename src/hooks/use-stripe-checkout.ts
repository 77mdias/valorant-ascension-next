import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { PLANOS } from "@/config/stripe-config";

// Debug: verificar as variáveis de ambiente
console.log("Preços disponíveis:", PLANOS);

// Verifica se a chave pública do Stripe está definida
const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY não está definida");
}

// Inicializa o cliente do Stripe no navegador
const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface ErrorResponse {
  error: string;
  details?: string;
}

class CheckoutError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "CheckoutError";
  }
}

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutSession = async (priceId: string, planType: string) => {
    try {
      setIsLoading(true);

      // Validações iniciais
      if (!priceId || typeof priceId !== "string") {
        throw new CheckoutError("ID do preço inválido", "INVALID_PRICE_ID", {
          priceId,
        });
      }

      if (!planType || typeof planType !== "string") {
        throw new CheckoutError("Tipo de plano inválido", "INVALID_PLAN_TYPE", {
          planType,
        });
      }

      // Valida se o priceId foi fornecido e é válido
      if (!priceId.startsWith("price_")) {
        throw new CheckoutError(
          `ID do preço deve começar com "price_"`,
          "INVALID_PRICE_FORMAT",
          { priceId, planType },
        );
      }

      // Valida se o planType corresponde a um plano válido
      if (!Object.keys(PLANOS).includes(planType)) {
        throw new CheckoutError(
          `Plano não encontrado. Planos disponíveis: ${Object.keys(PLANOS).join(
            ", ",
          )}`,
          "PLAN_NOT_FOUND",
          { planType, availablePlans: Object.keys(PLANOS) },
        );
      }

      // Valida se o priceId corresponde ao plano correto
      if (PLANOS[planType as keyof typeof PLANOS] !== priceId) {
        throw new CheckoutError(
          `ID do preço não corresponde ao plano selecionado`,
          "PRICE_PLAN_MISMATCH",
          {
            planType,
            expectedPriceId: PLANOS[planType as keyof typeof PLANOS],
            receivedPriceId: priceId,
          },
        );
      }

      console.log("✓ Iniciando checkout:", {
        priceId,
        planType,
        planos: PLANOS,
      });

      // Criar sessão de checkout
      let response;
      try {
        response = await axios.post("/api/create-checkout-session", {
          priceId,
          planType,
        });
        console.log("✓ Sessão criada:", response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          const data = error.response?.data as ErrorResponse;
          throw new CheckoutError(
            data?.error || "Erro ao criar sessão de checkout",
            "API_ERROR",
            {
              status: error.response?.status,
              data: error.response?.data,
            },
          );
        }
        throw error;
      }

      // Inicializar Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new CheckoutError(
          "Não foi possível inicializar o Stripe",
          "STRIPE_INIT_ERROR",
        );
      }

      // Redirecionar para checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (error) {
        throw new CheckoutError(
          error.message || "Erro ao redirecionar para o checkout",
          "REDIRECT_ERROR",
          error,
        );
      }
    } catch (error) {
      // Log detalhado do erro
      if (error instanceof CheckoutError) {
        console.error("❌ Erro no checkout:", {
          message: error.message,
          code: error.code,
          details: error.details,
        });
      } else {
        console.error("❌ Erro inesperado:", error);
      }

      // Formata a mensagem de erro para o usuário
      if (error instanceof CheckoutError) {
        throw error; // Já está formatado para o usuário
      } else if (error instanceof Error) {
        throw new CheckoutError(
          "Ocorreu um erro inesperado ao processar o pagamento",
          "UNKNOWN_ERROR",
          { originalError: error.message },
        );
      } else {
        throw new CheckoutError("Ocorreu um erro inesperado", "UNKNOWN_ERROR", {
          error,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCheckoutSession,
    isLoading,
  };
}
