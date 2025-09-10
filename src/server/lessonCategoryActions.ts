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

// Schema de entrada para categoria
export const LessonCategoryInput = z.object({
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  level: LessonLevelEnum.default("INICIANTE"),
  slug: z.string().optional(),
});
export type LessonCategoryInputType = z.infer<typeof LessonCategoryInput>;

export async function createLessonCategory(raw: unknown) {
  const data = LessonCategoryInput.parse(raw);
  // Gerar slug simples se não fornecido
  const slug = data.slug ?? data.name.toLowerCase().replace(/\s+/g, "-");
  const category = await db.lessonCategory.create({
    data: {
      name: data.name,
      description: data.description,
      icon: data.icon,
      level: data.level,
      slug,
    },
    include: {
      lessons: true,
    },
  });
  revalidatePath("/dashboard/categories");
  return { success: true, data: category };
}

export async function updateLessonCategory(raw: unknown) {
  const input = LessonCategoryInput.partial().extend({ id: z.string() });
  const { id, ...data } = input.parse(raw);
  const category = await db.lessonCategory.update({
    where: { id },
    data,
    include: {
      lessons: true,
    },
  });
  revalidatePath("/dashboard/categories");
  return { success: true, data: category };
}

export async function deleteLessonCategory(id: string) {
  // Verificar se existem aulas vinculadas
  const lessonsCount = await db.lessons.count({
    where: { categoryId: id },
  });
  if (lessonsCount > 0) {
    return {
      success: false,
      error: "Não é possível deletar categoria com aulas vinculadas",
    };
  }
  await db.lessonCategory.delete({ where: { id } });
  revalidatePath("/dashboard/categories");
  return { success: true };
}

export async function listLessonCategories(filters?: unknown) {
  const categories = await db.lessonCategory.findMany({
    include: {
      lessons: true,
    },
    orderBy: { name: "asc" }, // lessonCategory não tem createdAt, usar campo válido
  });
  return { success: true, data: categories };
}

export async function getLessonCategoryById(id: string) {
  const category = await db.lessonCategory.findUnique({
    where: { id },
    include: {
      lessons: true,
    },
  });
  if (!category) {
    return { success: false, error: "Categoria não encontrada" };
  }
  return { success: true, data: category };
}
