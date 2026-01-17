import { Flame, Layers3, Sparkles, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProgressDashboardData } from "@/server/progressActions";

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const integerFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
});

type StatsCardsProps = {
  totalHours: number;
  completedLessons: number;
  totalLessons: number;
  currentStreak: number;
  bestStreak: number;
  nextAchievement: ProgressDashboardData["nextAchievement"];
};

const ProgressBar = ({ value }: { value: number }) => (
  <div className="mt-3 h-2 w-full rounded-full bg-muted">
    <div
      className="h-2 rounded-full bg-gradient-to-r from-primary to-pink-500 transition-[width]"
      style={{ width: `${Math.min(Math.max(value, 0), 1) * 100}%` }}
      aria-hidden
    />
  </div>
);

export function StatsCards({
  totalHours,
  completedLessons,
  totalLessons,
  currentStreak,
  bestStreak,
  nextAchievement,
}: StatsCardsProps) {
  const completionRatio = totalLessons
    ? Math.min(completedLessons / totalLessons, 1)
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="border-border/40 bg-card/70 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Horas estudadas
          </CardTitle>
          <Sparkles className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">
            {numberFormatter.format(totalHours)}h
          </div>
          <p className="text-sm text-muted-foreground">Tempo registrado</p>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-card/70 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Aulas concluídas
          </CardTitle>
          <Layers3 className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">
            {completedLessons}/{totalLessons || 0}
          </div>
          <ProgressBar value={completionRatio} />
          <p className="mt-2 text-sm text-muted-foreground">
            {Math.round(completionRatio * 100)}% do catálogo
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-card/70 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Streak atual
          </CardTitle>
          <Flame className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">
            {integerFormatter.format(currentStreak)}d
          </div>
          <p className="text-sm text-muted-foreground">
            Melhor streak: {integerFormatter.format(bestStreak)} dias
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-card/70 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Próxima conquista
          </CardTitle>
          <Trophy className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          {nextAchievement ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-foreground">
                  {nextAchievement.icon ? `${nextAchievement.icon} ` : null}
                  {nextAchievement.title}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {nextAchievement.target
                  ? `${completedLessons}/${nextAchievement.target} aulas`
                  : "Complete mais aulas para desbloquear"}
              </p>
              <ProgressBar value={nextAchievement.progress} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma conquista pendente mapeada. Continue assistindo para
              desbloquear as próximas metas.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
