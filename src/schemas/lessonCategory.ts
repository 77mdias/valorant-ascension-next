import { z } from "zod";

export const LessonCategorySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  icon: z.string().optional(),
  level: z
    .enum(["INICIANTE", "INTERMEDIARIO", "AVANCADO", "IMORTAL"])
    .optional(),
  slug: z.string().min(2, "Slug deve ter pelo menos 2 caracteres"),
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

export type LessonCategoryInput = z.infer<typeof LessonCategorySchema>;
export type UpdateLessonCategoryInput = z.infer<
  typeof UpdateLessonCategorySchema
>;
export type LessonCategoryFilter = z.infer<typeof LessonCategoryFilterSchema>;
