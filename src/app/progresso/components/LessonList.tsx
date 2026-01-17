import Link from "next/link";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { formatDistanceToNow, parseISO, isValid, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProgressLessonSummary } from "@/server/progressActions";

const ProgressBar = ({ value }: { value: number }) => (
  <div className="h-2 w-full rounded-full bg-muted">
    <div
      className="h-2 rounded-full bg-gradient-to-r from-primary to-pink-500"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

const formatUpdatedAt = (value: Date) => {
  const date = value instanceof Date ? value : parseISO(String(value));
  if (!isValid(date)) return "";
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
};

type LessonListProps = {
  title: string;
  lessons: ProgressLessonSummary[];
  emptyMessage: string;
};

export function LessonList({ title, lessons, emptyMessage }: LessonListProps) {
  return (
    <Card className="h-full border-border/40 bg-card/70 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lessons.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="rounded-xl border border-border/40 bg-background/60 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {lesson.category ?? "Aula"}
                    </p>
                    <h3 className="text-base font-semibold text-foreground">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Atualizado {formatUpdatedAt(lesson.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    {lesson.completed ? (
                      <CheckCircle2
                        className="h-5 w-5 text-emerald-400"
                        aria-hidden
                      />
                    ) : (
                      <PlayCircle className="h-5 w-5" aria-hidden />
                    )}
                    <span>{lesson.progressPercent}%</span>
                  </div>
                </div>
                <div className="mt-3">
                  <ProgressBar value={lesson.progressPercent} />
                </div>
                {lesson.categorySlug ? (
                  <div className="mt-3 text-right">
                    <Link
                      className="text-sm font-medium text-primary hover:text-primary/80"
                      href={`/cursos/${lesson.categorySlug}`}
                    >
                      Ir para curso
                    </Link>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
