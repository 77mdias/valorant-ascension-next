import Link from "next/link";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { Menu, X } from "lucide-react";
import styles from "./scss/Dashboard.module.scss";
import ProjectInfo from "@/components/ProjectInfo";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");
  const user = session.user;
  if (user?.role !== UserRole.ADMIN)
    redirect("/auth/signin?error=AccessDenied");

  // Mobile sidebar state (SSR workaround: always closed)
  // For client-side toggle, move to a client component wrapper

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-muted md:flex-row">
      {/* Main content */}
      <main className="flex min-h-screen flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border/20 bg-background/80 backdrop-blur">
          <div className="container mx-auto flex w-full items-center justify-between px-4 py-2">
            <h1 className="text-xl font-bold text-primary md:text-2xl">
              Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="font-medium text-foreground/90">
                  {session.user?.name || "Usuário"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {session.user?.email}
                </span>
              </div>
              <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-pink-500 text-lg font-bold text-white md:flex">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  (session.user?.name || "U")[0]
                )}
              </div>
            </div>
          </div>
        </header>
        {/* Page content */}
        <section className="mx-auto w-full max-w-7xl p-4 md:p-8">
          {children}
        </section>
        <ProjectInfo />
      </main>
    </div>
  );
}
