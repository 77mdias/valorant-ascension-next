
import Link from "next/link";
import { ReactNode, useState } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { Menu, X } from "lucide-react";
import styles from "./scss/Dashboard.module.scss";
import ProjectInfo from "@/components/ProjectInfo";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");
  const user = session.user as any;
  if (user?.role !== UserRole.ADMIN) redirect("/auth/signin?error=AccessDenied");

  // Mobile sidebar state (SSR workaround: always closed)
  // For client-side toggle, move to a client component wrapper

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col md:flex-row">
      

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-background/80 backdrop-blur border-b border-border/20 flex items-center justify-between">
          <div className="mx-auto container flex items-center justify-between px-4 py-2 w-full">
            <h1 className="text-xl md:text-2xl font-bold text-primary">Dashboard</h1>
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="font-medium text-foreground/90">{session.user?.name || "Usuário"}</span>
                <span className="text-xs text-muted-foreground">{session.user?.email}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-500 items-center justify-center text-white font-bold text-lg hidden md:flex ">
                {session.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  (session.user?.name || "U")[0]
                )}
              </div>
            </div>
          </div>
        </header>
        {/* Page content */}
        <section className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </section>
        <ProjectInfo />
      </main>
    </div>
  );
}
