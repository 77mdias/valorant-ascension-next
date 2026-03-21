"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error" | null
  >(null);

  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");

  // Preencher email se fornecido na URL
  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const verifyEmail = useCallback(
    async (verificationToken: string) => {
      setIsVerifying(true);
      try {
        const response = await fetch(
          `/api/auth/verify-email?token=${verificationToken}`,
        );
        const data = await response.json();

        if (response.ok) {
          setVerificationStatus("success");
          toast.success("Email verificado com sucesso!");
          setTimeout(() => {
            // Redirecionar para página de agradecimento
            const thankYouUrl = `/auth/thank-you?verified=true&email=${encodeURIComponent(email)}`;
            router.push(thankYouUrl);
          }, 3000);
        } else {
          setVerificationStatus("error");
          toast.error(data.message || "Erro ao verificar email");
        }
      } catch (error) {
        setVerificationStatus("error");
        toast.error("Erro ao verificar email");
      } finally {
        setIsVerifying(false);
      }
    },
    [email, router],
  );

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  const resendVerificationEmail = async () => {
    if (!email) {
      toast.error("Digite seu email");
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Email de verificação reenviado!");
      } else {
        toast.error(data.message || "Erro ao reenviar email");
      }
    } catch (error) {
      toast.error("Erro ao reenviar email");
    } finally {
      setIsResending(false);
    }
  };

  const goToLogin = () => {
    router.push("/auth/signin");
  };

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader>
            <CardTitle className="text-center text-foreground">
              Verificando Email
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Aguarde enquanto verificamos seu email...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader>
            <CardTitle className="text-center text-green-400">
              Email Verificado!
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Sua conta foi ativada com sucesso. Você será redirecionado para a
              página de agradecimento.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => {
                const thankYouUrl = `/auth/thank-you?verified=true&email=${encodeURIComponent(email)}`;
                router.push(thankYouUrl);
              }}
              className="bg-primary text-white hover:bg-primary/80"
            >
              Ir para Agradecimento
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader>
            <CardTitle className="text-center text-red-400">
              Erro na Verificação
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              O link de verificação é inválido ou expirou. Solicite um novo
              email de verificação.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-border bg-card text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button
              onClick={resendVerificationEmail}
              disabled={isResending}
              className="w-full bg-primary text-white hover:bg-primary/80"
            >
              {isResending ? "Reenviando..." : "Reenviar Email de Verificação"}
            </Button>
            <Button
              variant="outline"
              onClick={goToLogin}
              className="w-full border-border bg-card text-foreground hover:bg-muted"
            >
              Voltar para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader>
          <CardTitle className="text-center text-foreground">
            Verificação de Email
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Digite seu email para receber um novo link de verificação.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border bg-card text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Button
            onClick={resendVerificationEmail}
            disabled={isResending}
            className="w-full bg-primary text-white hover:bg-primary/80"
          >
            {isResending ? "Reenviando..." : "Reenviar Email de Verificação"}
          </Button>
          <Button
            variant="outline"
            onClick={goToLogin}
            className="w-full border-border bg-card text-foreground hover:bg-muted"
          >
            Voltar para Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
