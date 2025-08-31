import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { PLANOS } from "@/config/stripe-config";

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

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutSession = async (priceId: string, planType: string) => {
    try {
      setIsLoading(true);

      // Validações básicas (seguindo regra: "Valide entrada à medida que os usuários digitam")
      if (!priceId || !planType) {
        throw new Error("Dados do plano incompletos");
      }

      if (!priceId.startsWith("price_")) {
        throw new Error("ID do preço inválido");
      }

      if (!Object.keys(PLANOS).includes(planType)) {
        throw new Error("Plano não encontrado");
      }

      if (PLANOS[planType as keyof typeof PLANOS] !== priceId) {
        throw new Error("Plano e preço não correspondem");
      }

      console.log("Iniciando checkout:", { planType, priceId });

      // Criar sessão de checkout (seguindo regra: "Trate operações assíncronas adequadamente")
      const response = await axios.post("/api/create-checkout-session", {
        priceId,
        planType,
      });

      console.log("Sessão criada:", response.data.sessionId);

      // Inicializar Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Erro ao inicializar sistema de pagamento");
      }

      // Redirecionar para checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (error) {
        throw new Error(error.message || "Erro ao abrir página de pagamento");
      }
    } catch (error) {
      // Tratamento de erro simplificado (seguindo regra: "Apresente mensagens de erro amigáveis")
      console.error("Erro no checkout:", error);

      let mensagemAmigavel = "Erro ao processar pagamento";

      if (error instanceof AxiosError) {
        const data = error.response?.data as ErrorResponse;
        mensagemAmigavel = data?.error || "Erro no servidor";
      } else if (error instanceof Error) {
        mensagemAmigavel = error.message;
      }

      // Propagamos um erro simples e claro
      throw new Error(mensagemAmigavel);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCheckoutSession,
    isLoading,
  };
}
