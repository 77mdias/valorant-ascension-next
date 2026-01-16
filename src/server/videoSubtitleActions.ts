"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import {
  VideoSubtitleInput,
  VideoSubtitleListSchema,
  VideoSubtitleUpdateInput,
} from "@/schemas/videoSubtitle";

const normalizeLanguage = (code: string) => {
  const trimmed = code.trim();
  const [base, region] = trimmed.split("-");
  if (region) {
    return `${base.toLowerCase()}-${region.toUpperCase()}`;
  }
  return base.toLowerCase();
};

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

export async function listVideoSubtitles(raw: unknown) {
  const { lessonId } = VideoSubtitleListSchema.parse(raw);
  const subtitles = await db.videoSubtitle.findMany({
    where: { lessonId },
    orderBy: [{ isDefault: "desc" }, { language: "asc" }],
  });
  return { success: true, data: subtitles };
}

export async function createVideoSubtitle(raw: unknown) {
  const parsed = VideoSubtitleInput.parse(raw);
  const payload = {
    ...parsed,
    language: normalizeLanguage(parsed.language),
  };

  const lesson = await db.lessons.findUnique({
    where: { id: payload.lessonId },
    select: {
      id: true,
      category: { select: { slug: true } },
    },
  });

  if (!lesson) {
    return { success: false, error: "Aula não encontrada" };
  }

  const existingLanguage = await db.videoSubtitle.findFirst({
    where: { lessonId: payload.lessonId, language: payload.language },
  });

  if (existingLanguage) {
    return {
      success: false,
      error: "Já existe uma legenda cadastrada para este idioma",
    };
  }

  const subtitle = await db.$transaction(async (tx) => {
    if (payload.isDefault) {
      await tx.videoSubtitle.updateMany({
        where: { lessonId: payload.lessonId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return tx.videoSubtitle.create({ data: payload });
  });

  await revalidateLessonRoutes(lesson.id, lesson.category?.slug);
  return { success: true, data: subtitle };
}

export async function updateVideoSubtitle(raw: unknown) {
  const parsed = VideoSubtitleUpdateInput.parse(raw);
  const payload = {
    ...parsed,
    language: normalizeLanguage(parsed.language),
  };

  const existing = await db.videoSubtitle.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      lessonId: true,
      lesson: { select: { category: { select: { slug: true } } } },
    },
  });

  if (!existing) {
    return { success: false, error: "Legenda não encontrada" };
  }

  const duplicateLanguage = await db.videoSubtitle.findFirst({
    where: {
      lessonId: existing.lessonId,
      language: payload.language,
      NOT: { id: payload.id },
    },
    select: { id: true },
  });

  if (duplicateLanguage) {
    return {
      success: false,
      error: "Já existe uma legenda cadastrada para este idioma",
    };
  }

  const subtitle = await db.$transaction(async (tx) => {
    if (payload.isDefault) {
      await tx.videoSubtitle.updateMany({
        where: { lessonId: existing.lessonId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return tx.videoSubtitle.update({
      where: { id: payload.id },
      data: {
        label: payload.label,
        language: payload.language,
        fileUrl: payload.fileUrl,
        isDefault: payload.isDefault,
      },
    });
  });

  await revalidateLessonRoutes(
    existing.lessonId,
    existing.lesson?.category?.slug,
  );
  return { success: true, data: subtitle };
}

export async function deleteVideoSubtitle(id: string) {
  const existing = await db.videoSubtitle.findUnique({
    where: { id },
    select: {
      lessonId: true,
      lesson: { select: { category: { select: { slug: true } } } },
    },
  });

  if (!existing) {
    return { success: false, error: "Legenda não encontrada" };
  }

  await db.videoSubtitle.delete({ where: { id } });
  await revalidateLessonRoutes(
    existing.lessonId,
    existing.lesson?.category?.slug,
  );
  return { success: true };
}
