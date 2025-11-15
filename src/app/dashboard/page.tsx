import { Metadata } from "next";
import { listUsers } from "@/server/userActions";
import { listLessons } from "@/server/lessonsActions";
import { listLessonCategories } from "@/server/lessonCategoryActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import styles from "./scss/Dashboard.module.scss";

export const metadata: Metadata = {
  title: "Dashboard | Valorant Academy",
  description: "Painel de controle para gerenciamento da academia Valorant",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/signin");

  // Verificar se o usuário é ADMIN
  const user = session.user;
  if (user?.role !== UserRole.ADMIN) {
    redirect("/auth/signin?error=AccessDenied");
  }

  // Dados reais
  const { data: users } = await listUsers();
  const { data: lessons } = await listLessons();
  const { data: categories } = await listLessonCategories();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Visão Geral</h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="ease border border-gray-700 bg-[#0e121c] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(250,0,150,0.6)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users?.length || 0}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Total de usuários no sistema
            </p>
          </CardContent>
        </Card>

        <Card className="ease border border-gray-700 bg-[#0e121c] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(250,0,150,0.6)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aulas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lessons?.length || 0}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Total de aulas disponíveis
            </p>
          </CardContent>
        </Card>

        <Card className="ease border border-gray-700 bg-[#0e121c] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,0,150,0.6)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categories?.length || 0}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Total de categorias de aulas
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 text-2xl font-bold">Acesso Rápido</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/users" className={styles.quickLink}>
          <span className={styles.quickLinkIcon}>👤</span>
          <div className={styles.quickLinkContent}>
            <h3>Gerenciar Usuários</h3>
            <p>Adicione, edite ou remova usuários do sistema</p>
          </div>
        </Link>

        <Link href="/dashboard/lessons" className={styles.quickLink}>
          <span className={styles.quickLinkIcon}>📝</span>
          <div className={styles.quickLinkContent}>
            <h3>Gerenciar Aulas</h3>
            <p>Crie e organize aulas para seus alunos</p>
          </div>
        </Link>

        <Link href="/dashboard/categories" className={styles.quickLink}>
          <span className={styles.quickLinkIcon}>📁</span>
          <div className={styles.quickLinkContent}>
            <h3>Gerenciar Categorias</h3>
            <p>Organize suas aulas em categorias</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
