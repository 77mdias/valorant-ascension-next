"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

// Função para buscar informações do usuário
async function getUserAuthInfo(email: string) {
  try {
    const response = await fetch(
      `/api/auth/user-info?email=${encodeURIComponent(email)}`,
    );
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Erro ao buscar informações do usuário:", error);
  }
  return null;
}

const errors = {
  Signin: "Tente fazer login com uma conta diferente.",
  OAuthSignin: "Tente fazer login com uma conta diferente.",
  OAuthCallback: "Tente fazer login com uma conta diferente.",
  OAuthCreateAccount: "Tente fazer login com uma conta diferente.",
  EmailCreateAccount: "Tente fazer login com uma conta diferente.",
  Callback: "Tente fazer login com uma conta diferente.",
  AccessDenied: {
    title: "Email já cadastrado",
    message:
      "Este email já está cadastrado em nossa plataforma com um método diferente de autenticação. Para sua segurança, você precisa fazer login usando o método original de cadastro.",
    details: [
      "Se você se cadastrou com email e senha, use essas credenciais",
      "Se você se cadastrou com outro provedor (Google/GitHub), use o mesmo",
      "Entre em contato conosco se precisar de ajuda",
    ],
  },
  OAuthAccountNotLinked: {
    title: "Email já cadastrado",
    message:
      "Este email já está cadastrado em nossa plataforma com um método diferente de autenticação. Para sua segurança, você precisa fazer login usando o método original de cadastro.",
    details: [
      "Se você se cadastrou com email e senha, use essas credenciais",
      "Se você se cadastrou com outro provedor (Google/GitHub), use o mesmo",
      "Entre em contato conosco se precisar de ajuda",
    ],
  },
  EmailSignin: "Verifique seu endereço de email.",
  CredentialsSignin:
    "Falha no login. Verifique se os detalhes que você forneceu estão corretos.",
  default: "Não foi possível fazer login.",
};

export default function ErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error") as keyof typeof errors;
  const errorData = errors[error] || errors.default;
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  // Debug: verificar os parâmetros
  console.log("ErrorContent - params:", params);
  console.log("ErrorContent - params type:", typeof params);
  console.log("ErrorContent - params keys:", Object.keys(params || {}));

  // Extrair slug de forma segura
  const slug =
    typeof params === "object" && params !== null && "slug" in params
      ? (params as any).slug
      : undefined;

  console.log("ErrorContent - slug extraído:", slug);

  // Extrair slug do callbackUrl se disponível (pode ter sido passado na URL de erro)
  const callbackUrlParam = searchParams.get("callbackUrl");
  console.log("ErrorContent - callbackUrl da URL:", callbackUrlParam);

  // Tentar extrair slug do callbackUrl (ex: "/nextstore" -> "nextstore")
  let slugFromCallback: string | undefined;
  if (callbackUrlParam) {
    try {
      const decodedCallback = decodeURIComponent(callbackUrlParam);
      console.log("ErrorContent - callbackUrl decodificado:", decodedCallback);

      // Remover a barra inicial se existir
      const cleanCallback = decodedCallback.startsWith("/")
        ? decodedCallback.slice(1)
        : decodedCallback;

      // Se não for uma URL completa (não tem http/https), é provavelmente um slug
      if (!cleanCallback.includes("http") && !cleanCallback.includes("://")) {
        slugFromCallback = cleanCallback;
        console.log(
          "ErrorContent - slug extraído do callbackUrl:",
          slugFromCallback,
        );
      }
    } catch (error) {
      console.error("Erro ao decodificar callbackUrl:", error);
    }
  }

  // Priorizar slug do callbackUrl, depois do params, depois do localStorage
  const urlSlug = slugFromCallback || slug;
  console.log("ErrorContent - urlSlug final:", urlSlug);

  // Fallback: tentar obter slug do localStorage (pode ter sido salvo durante o processo de login)
  const storedSlug =
    typeof window !== "undefined"
      ? localStorage.getItem("currentStoreSlug") ||
        sessionStorage.getItem("currentStoreSlug")
      : undefined;

  console.log("ErrorContent - storedSlug final:", storedSlug);

  const finalSlug = urlSlug || storedSlug;
  console.log("ErrorContent - finalSlug:", finalSlug);

  useEffect(() => {
    console.log("ErrorContent useEffect - error:", error);
    console.log(
      "ErrorContent useEffect - searchParams:",
      searchParams.toString(),
    );

    // Verificar se estamos no cliente e obter slug do localStorage
    if (typeof window !== "undefined") {
      const storedSlug =
        localStorage.getItem("currentStoreSlug") ||
        sessionStorage.getItem("currentStoreSlug");
      console.log(
        "ErrorContent useEffect - storedSlug do localStorage:",
        localStorage.getItem("currentStoreSlug"),
      );
      console.log(
        "ErrorContent useEffect - storedSlug do sessionStorage:",
        sessionStorage.getItem("currentStoreSlug"),
      );
      console.log("ErrorContent useEffect - storedSlug final:", storedSlug);
    }

    // Mostrar modal automaticamente para erros importantes
    if (error === "OAuthAccountNotLinked" || error === "AccessDenied") {
      console.log("Erro OAuth detectado, mostrando modal");
      setShowModal(true);
      console.log("showModal definido como true");

      // Buscar informações detalhadas do erro
      const errorDetails = localStorage.getItem("oauthErrorDetails");
      let attemptedProvider: string | null = null;

      if (errorDetails) {
        try {
          const details = JSON.parse(errorDetails);
          attemptedProvider = details.attemptedProvider;
        } catch (e) {
          console.error("Erro ao parsear detalhes do erro:", e);
        }
      }

      // Buscar informações do usuário - tentar diferentes formas de obter o email
      let email =
        searchParams.get("email") ||
        searchParams.get("error_description")?.split(":")[1];

      console.log("Email da URL:", searchParams.get("email"));
      console.log("Error description:", searchParams.get("error_description"));

      // Se não encontrou na URL, tentar localStorage
      if (!email) {
        email = localStorage.getItem("lastAttemptedEmail") || undefined;
        console.log("Email do localStorage:", email);
      }

      // Se ainda não encontrou, tentar obter do sessionStorage ou cookies
      if (!email) {
        // Tentar obter do sessionStorage (pode ter sido salvo durante o processo OAuth)
        email = sessionStorage.getItem("oauthEmail") || undefined;
        console.log("Email do sessionStorage:", email);
      }

      console.log("Email final encontrado:", email);

      if (email) {
        console.log("Buscando informações do usuário para:", email);
        setLoading(true);
        getUserAuthInfo(email).then((info) => {
          console.log("Informações do usuário recebidas:", info);
          // Adicionar informações sobre o provider tentado
          if (info && attemptedProvider) {
            info.attemptedProvider = attemptedProvider;
          }
          setUserInfo(info);
          setLoading(false);
        });
      } else {
        console.log("Nenhum email encontrado, usando informações padrão");
      }
    }
  }, [error, searchParams]);

  const handleTryAgain = () => {
    setShowModal(false);
    // Redirecionar para login com callbackUrl para voltar à loja
    const storedSlug =
      typeof window !== "undefined"
        ? localStorage.getItem("currentStoreSlug") ||
          sessionStorage.getItem("currentStoreSlug")
        : undefined;
    console.log("handleTryAgain - storedSlug:", storedSlug);
    const callbackUrl = storedSlug ? `/${storedSlug}` : "/";
    console.log("handleTryAgain - callbackUrl:", callbackUrl);
    console.log("handleTryAgain - finalSlug:", finalSlug);
    router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  };

  const handleGoHome = () => {
    setShowModal(false);
    // Redirecionar para a página da loja (slug) se existir, senão para home
    const storedSlug =
      typeof window !== "undefined"
        ? localStorage.getItem("currentStoreSlug") ||
          sessionStorage.getItem("currentStoreSlug")
        : undefined;
    console.log("handleGoHome - storedSlug:", storedSlug);
    const targetUrl = storedSlug ? `/${storedSlug}` : "/";
    console.log("handleGoHome - targetUrl:", targetUrl);
    console.log("handleGoHome - finalSlug:", finalSlug);
    router.push(targetUrl);
  };

  // Gerar mensagem personalizada baseada nas informações do usuário
  const getCustomMessage = () => {
    const defaultMessage =
      typeof errorData === "object" && "message" in errorData
        ? errorData.message
        : "Erro de autenticação";

    if (!userInfo) {
      return defaultMessage;
    }

    if (
      userInfo.attemptedProvider &&
      userInfo.oauthProviders &&
      userInfo.oauthProviders.length > 0
    ) {
      const attemptedProviderName =
        userInfo.attemptedProvider === "google"
          ? "Google"
          : userInfo.attemptedProvider === "github"
            ? "GitHub"
            : userInfo.attemptedProvider;

      const originalProviders = userInfo.oauthProviders
        .map((p: string) =>
          p === "google" ? "Google" : p === "github" ? "GitHub" : p,
        )
        .join(" ou ");

      return `Você tentou fazer login com ${attemptedProviderName}, mas esta conta foi criada usando ${originalProviders}. Para sua segurança, use o método original de cadastro.`;
    }

    return defaultMessage;
  };

  // Gerar detalhes baseados no método de autenticação original
  const getCustomDetails = () => {
    if (!userInfo) {
      return typeof errorData === "object" && "details" in errorData
        ? errorData.details
        : [];
    }

    const details = [];

    // Adicionar contexto sobre o que foi tentado
    if (userInfo.attemptedProvider) {
      const attemptedProviderName =
        userInfo.attemptedProvider === "google"
          ? "Google"
          : userInfo.attemptedProvider === "github"
            ? "GitHub"
            : userInfo.attemptedProvider;
      details.push(`❌ Tentativa de login com ${attemptedProviderName} falhou`);
    }

    if (userInfo.hasPassword) {
      details.push("🔐 Use seu email e senha para fazer login");
    }

    if (userInfo.oauthProviders && userInfo.oauthProviders.length > 0) {
      const providers = userInfo.oauthProviders
        .map((p: string) => {
          switch (p) {
            case "google":
              return "Google";
            case "github":
              return "GitHub";
            default:
              return p;
          }
        })
        .join(" ou ");
      details.push(`✅ Faça login com ${providers} (método original)`);
    }

    if (details.length === 0) {
      details.push("Entre em contato conosco se precisar de ajuda");
    }

    return details;
  };

  console.log("Renderizando ErrorContent - error:", error);
  console.log("Renderizando ErrorContent - errorData:", errorData);
  console.log("Renderizando ErrorContent - showModal:", showModal);

  // Se for OAuthAccountNotLinked ou AccessDenied, mostrar modal elegante
  if (error === "OAuthAccountNotLinked" || error === "AccessDenied") {
    console.log("Renderizando modal de erro OAuth");
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Email já cadastrado
          </h2>
          <p className="mb-8 text-muted-foreground">
            {loading
              ? "Carregando informações..."
              : "Clique no botão abaixo para ver mais detalhes"}
          </p>
          <Button
            onClick={() => setShowModal(true)}
            disabled={loading}
            className="bg-primary text-white hover:bg-primary/80 disabled:opacity-50"
          >
            {loading ? "Carregando..." : "Ver Detalhes"}
          </Button>
        </div>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          type="warning"
          title="Email já cadastrado"
          message={getCustomMessage()}
          details={getCustomDetails()}
          actions={[
            {
              label: "Tentar Novamente",
              onClick: handleTryAgain,
              variant: "default",
            },
            {
              label: "Voltar ao Início",
              onClick: handleGoHome,
              variant: "outline",
            },
          ]}
        />
      </div>
    );
  }

  // Renderização padrão para outros erros
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Erro de Autenticação
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{errorData as string}</p>
        </div>

        <div className="space-y-4">
          <Button
            asChild
            className="w-full bg-primary text-white hover:bg-primary/80"
          >
            <Link
              href={`/auth/signin?callbackUrl=${encodeURIComponent(finalSlug ? `/${finalSlug}` : "/")}`}
            >
              Tentar Novamente
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full border-border bg-transparent text-foreground hover:bg-muted"
          >
            <Link href={finalSlug ? `/${finalSlug}` : "/"}>
              Voltar ao Início
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
