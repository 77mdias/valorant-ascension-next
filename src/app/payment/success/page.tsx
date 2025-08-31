"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PaymentStatus } from "@/components/ui/payment-status";
import { useStripeSession } from "@/hooks/use-stripe-session";
import { Loader2 } from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { isLoading, error, sessionStatus } = useStripeSession(sessionId);

  if (error) {
    return (
      <PaymentStatus
        status="error"
        title="Erro ao verificar pagamento"
        description={error}
      />
    );
  }

  if (isLoading || sessionStatus?.status === "processing") {
    return (
      <PaymentStatus
        status="processing"
        title="Processando seu pagamento..."
        description={
          sessionStatus?.message ||
          "Por favor, aguarde enquanto confirmamos sua assinatura."
        }
      />
    );
  }

  if (sessionStatus?.status === "paid" && sessionStatus?.subscription) {
    const endDate = new Date(
      sessionStatus.subscription.currentPeriodEnd,
    ).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return (
      <PaymentStatus
        status="success"
        title="Pagamento confirmado!"
        description={`Parabéns! Sua assinatura do plano ${
          sessionStatus.planType || "selecionado"
        } foi ativada com sucesso. Você tem acesso até ${endDate}. Aproveite todo o conteúdo disponível!`}
        planType={sessionStatus.planType}
        sessionId={sessionId || undefined}
      />
    );
  }

  return (
    <PaymentStatus
      status="error"
      title="Status do pagamento desconhecido"
      description="Não foi possível confirmar o status do seu pagamento. Por favor, entre em contato com nosso suporte."
    />
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
