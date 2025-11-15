"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-red-600">Ops!</h1>
          <h2 className="mb-2 text-2xl font-semibold text-gray-700">
            Algo deu errado
          </h2>
          <p className="mb-4 text-gray-600">
            Ocorreu um erro inesperado. Tente novamente ou volte à página
            inicial.
          </p>
          {error.digest && (
            <p className="mb-4 text-xs text-gray-500">
              Código do erro: {error.digest}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Button onClick={reset} className="w-full">
            Tentar novamente
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full"
          >
            Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  );
}
