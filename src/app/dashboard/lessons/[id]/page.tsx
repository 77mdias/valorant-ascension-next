import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { formatSeconds } from "@/lib/time";
import TimestampManager from "./components/TimestampManager";

interface LessonTimestampPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LessonTimestampPage({
  params,
}: LessonTimestampPageProps) {
  const { id } = await params;
  const lesson = await db.lessons.findUnique({
    where: { id },
    include: {
      category: { select: { name: true, slug: true } },
      timestamps: { orderBy: { time: "asc" } },
    },
  });

  if (!lesson) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 lg:p-8">
      <div className="rounded-2xl border border-white/10 bg-card/70 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Dashboard · Aulas
            </p>
            <h1 className="text-3xl font-bold text-foreground">
              Sistema de Timestamps
            </h1>
          </div>
          <Link
            href="/dashboard/lessons"
            className="text-sm font-semibold text-primary hover:underline"
          >
            ← Voltar para lista de aulas
          </Link>
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Aula:</span>
            {" "}
            {lesson.title}
          </p>
          {lesson.category?.name && (
            <p>
              <span className="font-semibold text-foreground">Categoria:</span>
              {" "}
              {lesson.category.name}
            </p>
          )}
          {typeof lesson.duration === "number" && (
            <p>
              <span className="font-semibold text-foreground">Duração:</span>
              {" "}
              {formatSeconds(lesson.duration)}
            </p>
          )}
        </div>
      </div>

      <TimestampManager
        lessonId={lesson.id}
        lessonDuration={lesson.duration}
        initialTimestamps={lesson.timestamps}
      />
    </div>
  );
}
