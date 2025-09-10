import { z } from "zod";

// Enum de níveis conforme schema.prisma
export const LessonLevelEnum = z.enum([
  "INICIANTE",
  "INTERMEDIARIO",
  "AVANCADO",
  "IMORTAL",
]);

export const LessonSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  content: z.string().optional(),
  videoUrl: z.string().url("URL do vídeo inválida").optional(),
  thumbnailUrl: z.string().url("URL da thumbnail inválida").optional(),
  duration: z.number().int().min(0).optional(),
  order: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  categoryId: z.string().uuid("ID da categoria inválido"),
});

// Schema mais compatível com o banco (baseado no actions)
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

// Schema para formulários (mais compatível com forms)
export const LessonFormInput = z.object({
  title: z.string(),
  description: z.string().optional(),
  categoryId: z.string(),
  videoUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  isLive: z.boolean().optional(),
  createdById: z.string(),
  duration: z.number().int().optional(),
  isCompleted: z.boolean().optional(),
  isLocked: z.boolean().optional(),
  number: z.number().int().optional(),
});

export const UpdateLessonSchema = LessonSchema.partial().extend({
  id: z.string().uuid(),
});

export const LessonFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  isPublished: z.boolean().optional(),
  isPremium: z.boolean().optional(),
});

export type LessonInput = z.infer<typeof LessonInput>;
export type LessonInputType = z.infer<typeof LessonInput>;
export type LessonFormInputType = z.infer<typeof LessonFormInput>;
export type UpdateLessonInput = z.infer<typeof UpdateLessonSchema>;
export type LessonFilter = z.infer<typeof LessonFilterSchema>;
export type Lesson = LessonInput & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
export type LessonList = {
  lessons: Lesson[];
  totalCount: number;
};
export type LessonWithCategory = Lesson & {
  category: {
    id: string;
    name: string;
    slug: string;
    level: "INICIANTE" | "INTERMEDIARIO" | "AVANCADO" | "IMORTAL";
  };
};
