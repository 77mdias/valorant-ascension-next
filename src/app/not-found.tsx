"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

// Força a página a ser dinâmica
export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold">404</h1>
          <h2 className="mb-2 text-2xl font-semibold text-gray-400">
            Página não encontrada
          </h2>
          <p className="text-gray-600">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">Voltar ao início</Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/community">Ver na comunidade</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
