import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Meu Progresso | Valorant Ascension",
  description:
    "Acompanhe suas aulas assistidas, streak diário e próximas conquistas na Valorant Ascension.",
};

export default function ProgressLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background/90 to-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(247,37,133,0.12),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(67,97,238,0.12),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(34,211,238,0.08),transparent_25%)]" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
