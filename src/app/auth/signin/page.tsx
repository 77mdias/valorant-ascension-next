import { Suspense } from "react";
import SignInForm from "./components/SignInForm";
import ProjectInfo from "@/components/ProjectInfo";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-foreground">Carregando...</div>
        </div>
      }
    >
      <SignInForm />
      <ProjectInfo />
    </Suspense>
  );
}
