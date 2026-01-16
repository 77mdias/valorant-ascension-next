import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    const category = await db.lessonCategory.findFirst({
      where: { slug: decodedSlug },
      include: {
        lessons: {
          orderBy: { createdAt: "asc" },
          include: {
            timestamps: {
              orderBy: { time: "asc" },
            },
            subtitles: {
              orderBy: [{ isDefault: "desc" }, { language: "asc" }],
            },
            progress: userId
              ? {
                  where: { userId },
                  select: {
                    id: true,
                    completed: true,
                    progress: true,
                    lastPosition: true,
                    totalDuration: true,
                    completedAt: true,
                    updatedAt: true,
                  },
                }
              : undefined,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 },
      );
    }

    const lessonsWithProgress = category.lessons.map((lesson) => {
      const lessonWithProgress = lesson as typeof lesson & {
        progress?: Array<{
          completed: boolean;
          progress: number;
          lastPosition: number;
          totalDuration: number;
          completedAt: Date | null;
          updatedAt: Date;
        }>;
      };

      const progressRecord = lessonWithProgress.progress?.[0] ?? null;

      const { progress, ...rest } = lessonWithProgress;

      return {
        ...rest,
        isCompleted: Boolean(progressRecord?.completed ?? lesson.isCompleted),
        progress: progressRecord,
      };
    });

    return NextResponse.json({ ...category, lessons: lessonsWithProgress });
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
