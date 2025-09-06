"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";
import { PlanCard } from "@/components/subscription/plan-card";
import { CurrentPlanBanner } from "@/components/subscription/current-plan-banner";

const PLANOS_INFO = {
  BASICO: {
    title: "Básico",
    price: "R$ 49,90",
    features: [
      { text: "Acesso a cursos básicos" },
      { text: "Conteúdo teórico" },
      { text: "Dicas de gameplay" },
    ],
  },
  INTERMEDIARIO: {
    title: "Intermediário",
    price: "R$ 99,90",
    features: [
      { text: "Tudo do plano básico" },
      { text: "Aulas ao vivo semanais" },
      { text: "Análise de jogos" },
    ],
  },
  AVANCADO: {
    title: "Avançado",
    price: "R$ 149,90",
    features: [
      { text: "Tudo do plano intermediário" },
      { text: "Coaching premium" },
      { text: "Aulas exclusivas com profissionais" },
    ],
  },
};

export default function PricingPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const handleAuthRequired = () => {
    toast({
      title: "Atenção",
      description: "Você precisa estar logado para assinar um plano.",
      variant: "default",
    });
    signIn(undefined, { callbackUrl: "/prices" });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-20 pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/1a1a1a/333333?text=Valorant+Training')] bg-cover bg-center opacity-30"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-20 text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
              <span className="text-white">Escolha Seu Curso e</span>
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Evolua
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                no Valorant
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">
              Treinos práticos, aulas ao vivo e conteúdo exclusivo para todos os
              níveis — do básico ao imortal.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="flex transform items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-pink-600 hover:to-purple-700">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                  <path d="M10 6a2 2 0 100 4 2 2 0 000-4z" />
                  <path d="M10 14a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span>Começar Agora</span>
              </button>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-full border-2 border-purple-500/50 px-8 py-4 font-medium text-purple-400 transition-all duration-300 hover:border-purple-500/80 hover:text-purple-300"
              >
                Ver Planos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-900/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Planos de{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Assinatura
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Escolha o plano que melhor se adapta ao seu nível de jogo e
              objetivos
            </p>
          </div>

          {isAuthenticated && <CurrentPlanBanner />}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {(
              Object.entries(PLANOS_INFO) as [
                keyof typeof PLANOS_INFO,
                (typeof PLANOS_INFO)[keyof typeof PLANOS_INFO],
              ][]
            ).map(([type, plan]) => (
              <PlanCard
                key={type}
                type={type}
                title={plan.title}
                price={plan.price}
                features={[...plan.features]} // Cria uma nova array mutável
                isHighlighted={type === "INTERMEDIARIO"}
                onAuthRequired={handleAuthRequired}
                isLoading={authLoading}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
