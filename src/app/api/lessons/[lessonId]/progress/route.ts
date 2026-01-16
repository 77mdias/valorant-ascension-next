import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import {
  lessonProgressUpdateSchema,
  LESSON_COMPLETE_RATIO,
  type LessonProgressUpdateInput,
} from "@/schemas/lessonProgress";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const progressSelect = {
  id: true,
  userId: true,
  lessonId: true,
  completed: true,
  completedAt: true,
  progress: true,
  lastPosition: true,
  totalDuration: true,
  updatedAt: true,
} as const;

const buildResponse = (data: unknown, status = 200) =>
  NextResponse.json({ data }, { status });

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return buildResponse(null);
  }

  const { lessonId } = await params;
  const progress = await db.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
    select: progressSelect,
  });

  return buildResponse(progress ?? null);
}

const normalizePayload = (
  payload: LessonProgressUpdateInput,
  previousDuration: number,
) => {
  const normalizedDuration = Math.max(Math.round(payload.totalDuration), 0);
  const safeDuration = normalizedDuration || previousDuration || 0;
  const normalizedPosition = clamp(
    Math.round(payload.lastPosition),
    0,
    safeDuration || Math.round(payload.lastPosition),
  );

  const ratio =
    safeDuration > 0 ? Math.min(normalizedPosition / safeDuration, 1) : 0;
  const completed = ratio >= LESSON_COMPLETE_RATIO;

  return {
    safeDuration,
    normalizedPosition,
    ratio,
    completed,
  } as const;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { lessonId } = await params;
  const body = await request.json().catch(() => null);
  const parsed = lessonProgressUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const previous = await db.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
    select: progressSelect,
  });

  const { safeDuration, normalizedPosition, ratio, completed } =
    normalizePayload(parsed.data, previous?.totalDuration ?? 0);

  const isCompleted = completed || Boolean(previous?.completed);
  const completedAt = isCompleted
    ? (previous?.completedAt ?? new Date())
    : null;

  const progress = await db.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
    create: {
      userId: session.user.id,
      lessonId,
      lastPosition: normalizedPosition,
      totalDuration: safeDuration,
      progress: ratio,
      completed: isCompleted,
      completedAt,
    },
    update: {
      lastPosition: Math.max(previous?.lastPosition ?? 0, normalizedPosition),
      totalDuration: Math.max(previous?.totalDuration ?? 0, safeDuration),
      progress: Math.max(previous?.progress ?? 0, ratio),
      completed: isCompleted,
      completedAt,
    },
    select: progressSelect,
  });

  return buildResponse(progress);
}
