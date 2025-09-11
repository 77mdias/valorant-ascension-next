
import Link from "next/link";
import { ReactNode, useState } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { Menu, X } from "lucide-react";
import styles from "./scss/Dashboard.module.scss";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");
  const user = session.user as any;
  if (user?.role !== UserRole.ADMIN) redirect("/auth/signin?error=AccessDenied");

  // Mobile sidebar state (SSR workaround: always closed)
  // For client-side toggle, move to a client component wrapper

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col md:flex-row">
      {/* Sidebar - mobile first */}
      <aside
        className="fixed md:static top-0 left-0 z-40 w-full md:w-64 h-16 md:h-auto bg-card border-b md:border-r border-border/30 flex md:flex-col items-center md:items-start justify-between md:justify-start px-4 md:px-0 py-2 md:py-6 shadow-sm"
      >
        {/* Logo & Menu */}
        <div className="flex items-center gap-2 md:mb-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-poppins text-lg font-bold italic text-primary">Valorant</span>
            <span className="font-poppins text-lg font-extrabold italic text-pink-600">Academy</span>
          </Link>
        </div>
        {/* Mobile menu icon (placeholder, move to client for toggle) */}
        <div className="md:hidden">
          <Menu size={28} className="text-muted-foreground" />
        </div>
        {/* Sidebar nav (always visible on desktop) */}
        <nav className="hidden md:flex flex-col gap-2 w-full mt-8">
          <Link href="/dashboard" className="nav-link">
            <span className="mr-2">�</span> Dashboard
          </Link>
          <Link href="/dashboard/users" className="nav-link">
            <span className="mr-2">�</span> Usuários
          </Link>
          <Link href="/dashboard/lessons" className="nav-link">
            <span className="mr-2">�</span> Aulas
          </Link>
          <Link href="/dashboard/categories" className="nav-link">
            <span className="mr-2">📁</span> Categorias
          </Link>
          <Link href="/api/auth/signout" className="nav-link text-destructive mt-4">
            <span className="mr-2">🚪</span> Sair
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border/20 flex items-center justify-between px-4 py-2">
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
        </header>
        {/* Page content */}
        <section className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </section>
      </main>
    </div>
  );
}
