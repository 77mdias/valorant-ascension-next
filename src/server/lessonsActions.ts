"use server";

import { db } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Enum de níveis conforme schema.prisma
export const LessonLevelEnum = z.enum([
  "INICIANTE",
  "INTERMEDIARIO",
  "AVANCADO",
  "IMORTAL",
]);

// Schema de entrada para aula
export const LessonInput = z.object({
  title: z.string(),
  description: z.string().optional(),
  categoryId: z.string(),
  videoUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  isLive: z.boolean().optional(),
  scheduledAt: z.coerce.date().optional(),
  createdById: z.string(),
  duration: z.number().int().optional(),
  isCompleted: z.boolean().optional(),
  isLocked: z.boolean().optional(),
  number: z.number().int().optional(),
});
export type LessonInputType = z.infer<typeof LessonInput>;

export async function createLesson(raw: unknown) {
  const data = LessonInput.parse(raw);
  const lesson = await db.lessons.create({
    data,
    include: {
      category: true,
    },
  });
  revalidatePath("/dashboard/lessons");
  revalidatePath(`/dashboard/categories/${data.categoryId}`);
  return { success: true, data: lesson };
}

export async function updateLesson(raw: unknown) {
  const input = LessonInput.partial().extend({ id: z.string() });
  const { id, ...data } = input.parse(raw);
  const lesson = await db.lessons.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
  revalidatePath("/dashboard/lessons");
  revalidatePath(`/dashboard/categories/${lesson.categoryId}`);
  return { success: true, data: lesson };
}

export async function deleteLesson(id: string) {
  const lesson = await db.lessons.findUnique({
    where: { id },
    select: { categoryId: true },
  });
  if (!lesson) {
    return { success: false, error: "Aula não encontrada" };
  }
  await db.lessons.delete({ where: { id } });
  revalidatePath("/dashboard/lessons");
  revalidatePath(`/dashboard/categories/${lesson.categoryId}`);
  return { success: true };
}

export async function listLessons(filters?: unknown) {
  const lessons = await db.lessons.findMany({
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return { success: true, data: lessons };
}

export async function getLessonById(id: string) {
  const lesson = await db.lessons.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
  if (!lesson) {
    return { success: false, error: "Aula não encontrada" };
  }
  return { success: true, data: lesson };
}

export async function toggleLessonStatus(id: string) {
  // Exemplo: alternar campo isLive
  const lesson = await db.lessons.findUnique({
    where: { id },
    select: { isLive: true, categoryId: true },
  });
  if (!lesson) {
    return { success: false, error: "Aula não encontrada" };
  }
  const updatedLesson = await db.lessons.update({
    where: { id },
    data: { isLive: !lesson.isLive },
  });
  revalidatePath("/dashboard/lessons");
  revalidatePath(`/dashboard/categories/${lesson.categoryId}`);
  return { success: true, data: updatedLesson };
}
