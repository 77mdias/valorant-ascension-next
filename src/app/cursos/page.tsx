"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

const Cursos = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center bg-[var(--all-black)] p-6 md:p-0">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">
            Acesso não autorizado
          </h1>
          <p className="text-gray-400">
            Você precisa estar logado para acessar os cursos da Academia. Faça
            login ou cadastre-se para continuar.
          </p>
          <Link
            href="/auth/signin"
            className="btn-gradient mt-4 rounded-full px-6 py-2 font-medium text-white hover:text-white"
          >
            Entrar
          </Link>
          <Link
            href="/auth/signup"
            className="btn-gradient mt-4 rounded-full px-6 py-2 font-medium text-white hover:text-white"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    );
  }

  return <div>Cursos</div>;
};

export default Cursos;
