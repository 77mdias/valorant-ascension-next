import { Suspense } from "react";
import ErrorContent from "./components/ErrorContent";

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-foreground">Carregando...</div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
