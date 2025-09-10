"use server";

import { db } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { LessonInput, LessonInputType } from "@/schemas/lessons";

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
