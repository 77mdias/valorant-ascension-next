"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PaymentStatus } from "@/components/ui/payment-status";
import { Loader2 } from "lucide-react";

function PaymentErrorContent() {
  const searchParams = useSearchParams();
  const isCanceled = searchParams.get("canceled") === "true";

  if (isCanceled) {
    return (
      <PaymentStatus
        status="canceled"
        title="Pagamento cancelado"
        description="Você cancelou o processo de pagamento. Não se preocupe, nenhuma cobrança foi realizada. Você pode tentar novamente quando quiser."
      />
    );
  }

  return (
    <PaymentStatus
      status="error"
      title="Erro no pagamento"
      description="Ocorreu um erro ao processar seu pagamento. Por favor, verifique seus dados e tente novamente. Se o problema persistir, entre em contato com nosso suporte."
    />
  );
}

export default function PaymentErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      }
    >
      <PaymentErrorContent />
    </Suspense>
  );
}
