import { z } from "zod";

// Enum de níveis conforme schema.prisma
export const LessonLevelEnum = z.enum([
  "INICIANTE",
  "INTERMEDIARIO",
  "AVANCADO",
  "IMORTAL",
]);

export const LessonCategorySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  icon: z.string().optional(),
  level: z
    .enum(["INICIANTE", "INTERMEDIARIO", "AVANCADO", "IMORTAL"])
    .optional(),
  slug: z.string().min(2, "Slug deve ter pelo menos 2 caracteres"),
});

// Schema mais compatível com o banco (baseado no actions)
export const LessonCategoryInput = z.object({
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  level: LessonLevelEnum.default("INICIANTE"),
  slug: z.string().optional(),
});

// Schema para formulários (level opcional)
export const LessonCategoryFormInput = z.object({
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  level: LessonLevelEnum.optional(),
  slug: z.string().optional(),
});

export const UpdateLessonCategorySchema = LessonCategorySchema.partial().extend(
  {
    id: z.string().uuid(),
  }
);

export const LessonCategoryFilterSchema = z.object({
  search: z.string().optional(),
  level: z
    .enum(["INICIANTE", "INTERMEDIARIO", "AVANCADO", "IMORTAL"])
    .optional(),
});

export type LessonCategoryInput = z.infer<typeof LessonCategoryInput>;
export type LessonCategoryInputType = z.infer<typeof LessonCategoryInput>;
export type LessonCategoryFormInputType = z.infer<
  typeof LessonCategoryFormInput
>;
export type UpdateLessonCategoryInput = z.infer<
  typeof UpdateLessonCategorySchema
>;
export type LessonCategoryFilter = z.infer<typeof LessonCategoryFilterSchema>;
