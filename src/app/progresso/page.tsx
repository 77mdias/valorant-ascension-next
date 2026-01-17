import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowUpRight, Clock3, Sparkles } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getUserProgressDashboard } from "@/server/progressActions";
import { StatsCards } from "./components/StatsCards";
import { LessonList } from "./components/LessonList";
import { ProgressTimelineChartDynamic } from "./components/ProgressTimelineChartDynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/progresso");
  }

  const dashboard = await getUserProgressDashboard(session.user.id);
  const totalHours = dashboard.stats.totalWatchedSeconds / 3600;

  const lessonsInProgress = dashboard.lessons
    .filter((lesson) => !lesson.completed)
    .sort(
      (first, second) => second.updatedAt.getTime() - first.updatedAt.getTime(),
    )
    .slice(0, 4);

  const lessonsCompleted = dashboard.lessons
    .filter((lesson) => lesson.completed)
    .sort(
      (first, second) => second.updatedAt.getTime() - first.updatedAt.getTime(),
    )
    .slice(0, 4);

  const lastUpdatedLabel = dashboard.stats.lastUpdatedAt
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(dashboard.stats.lastUpdatedAt)
    : "Sem registros ainda";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-primary/80">
          Meu progresso
        </p>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Bem-vindo, {session.user?.name ?? "aluno"}
        </h1>
        <p className="text-muted-foreground">
          Acompanhe suas horas estudadas, streak diário e conquistas em tempo
          real. Os dados abaixo usam o histórico salvo automaticamente pelo
          player.
        </p>
        <p className="text-xs text-muted-foreground">
          Última atualização: {lastUpdatedLabel}
        </p>
      </div>

      <StatsCards
        totalHours={totalHours}
        completedLessons={dashboard.stats.completedLessons}
        totalLessons={dashboard.stats.totalLessons}
        currentStreak={dashboard.stats.currentStreak}
        bestStreak={dashboard.stats.bestStreak}
        nextAchievement={dashboard.nextAchievement}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/40 bg-card/70 backdrop-blur lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                Evolução recente
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Tempo estudado nos últimos 14 dias (minutos)
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <ProgressTimelineChartDynamic data={dashboard.timeline} />
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">
              Resumo rápido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-foreground">
            <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/60 px-3 py-2">
              <span className="text-muted-foreground">Aulas em andamento</span>
              <span className="font-semibold">
                {dashboard.stats.inProgressLessons}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/60 px-3 py-2">
              <span className="text-muted-foreground">Aulas concluídas</span>
              <span className="font-semibold">
                {dashboard.stats.completedLessons}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/60 px-3 py-2">
              <span className="text-muted-foreground">Total de aulas</span>
              <span className="font-semibold">
                {dashboard.stats.totalLessons}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/60 px-3 py-2">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock3 className="h-4 w-4" />
                Última sincronização
              </span>
              <span className="font-semibold text-foreground/80">
                {lastUpdatedLabel}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LessonList
          title="Em andamento"
          lessons={lessonsInProgress}
          emptyMessage="Nenhuma aula em andamento ainda. Assista uma aula para começar seu streak."
        />
        <LessonList
          title="Concluídas recentemente"
          lessons={lessonsCompleted}
          emptyMessage="Você ainda não concluiu aulas registradas. Finalize uma aula para vê-la aqui."
        />
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-gradient-to-r from-primary/10 to-secondary/10 p-4 text-sm text-foreground">
        <ArrowUpRight className="h-5 w-5 text-primary" />
        <p>
          Streak diário considera sessões com pelo menos 5 minutos assistidos no
          dia. Métricas de conquistas usam o número de aulas concluídas
          disponíveis no histórico atual.
        </p>
      </div>
    </div>
  );
}
