import { Suspense } from "react";
import SignUpForm from "./components/SignUpForm";
import ProjectInfo from "@/components/ProjectInfo";

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-foreground">Carregando...</div>
        </div>
      }
    >
      <SignUpForm />
      <ProjectInfo />
    </Suspense>
  );
}
