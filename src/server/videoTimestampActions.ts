"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import {
  VideoTimestampInput,
  VideoTimestampListSchema,
  VideoTimestampUpdateInput,
} from "@/schemas/videoTimestamp";

async function revalidateLessonRoutes(
  lessonId: string,
  categorySlug?: string | null,
) {
  revalidatePath("/dashboard/lessons");
  revalidatePath(`/dashboard/lessons/${lessonId}`);
  if (categorySlug) {
    revalidatePath(`/cursos/${categorySlug}`);
    revalidatePath(`/api/categories/${categorySlug}`);
  }
}

export async function listVideoTimestamps(raw: unknown) {
  const { lessonId } = VideoTimestampListSchema.parse(raw);
  const timestamps = await db.videoTimestamp.findMany({
    where: { lessonId },
    orderBy: { time: "asc" },
  });
  return { success: true, data: timestamps };
}

export async function createVideoTimestamp(raw: unknown) {
  const data = VideoTimestampInput.parse(raw);
  const lesson = await db.lessons.findUnique({
    where: { id: data.lessonId },
    select: {
      id: true,
      duration: true,
      category: { select: { slug: true } },
    },
  });

  if (!lesson) {
    return { success: false, error: "Aula não encontrada" };
  }

  if (typeof lesson.duration === "number" && data.time > lesson.duration) {
    return {
      success: false,
      error: "Timestamp não pode ultrapassar a duração da aula",
    };
  }

  const timestamp = await db.videoTimestamp.create({ data });
  await revalidateLessonRoutes(lesson.id, lesson.category?.slug);
  return { success: true, data: timestamp };
}

export async function updateVideoTimestamp(raw: unknown) {
  const input = VideoTimestampUpdateInput.parse(raw);
  const existing = await db.videoTimestamp.findUnique({
    where: { id: input.id },
    select: {
      id: true,
      lessonId: true,
      lesson: {
        select: {
          duration: true,
          category: { select: { slug: true } },
        },
      },
    },
  });

  if (!existing) {
    return { success: false, error: "Timestamp não encontrado" };
  }

  if (
    typeof existing.lesson?.duration === "number" &&
    input.time > existing.lesson.duration
  ) {
    return {
      success: false,
      error: "Timestamp não pode ultrapassar a duração da aula",
    };
  }

  const timestamp = await db.videoTimestamp.update({
    where: { id: input.id },
    data: {
      label: input.label,
      time: input.time,
    },
  });

  await revalidateLessonRoutes(
    existing.lessonId,
    existing.lesson?.category?.slug,
  );
  return { success: true, data: timestamp };
}

export async function deleteVideoTimestamp(id: string) {
  const existing = await db.videoTimestamp.findUnique({
    where: { id },
    select: {
      lessonId: true,
      lesson: {
        select: { category: { select: { slug: true } } },
      },
    },
  });

  if (!existing) {
    return { success: false, error: "Timestamp não encontrado" };
  }

  await db.videoTimestamp.delete({ where: { id } });
  await revalidateLessonRoutes(
    existing.lessonId,
    existing.lesson?.category?.slug,
  );
  return { success: true };
}
