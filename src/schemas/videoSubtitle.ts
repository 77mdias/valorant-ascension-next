import { z } from "zod";

const LANGUAGE_PATTERN = /^[a-z]{2}(?:-[A-Za-z]{2,})?$/;

export const VideoSubtitleInput = z.object({
  lessonId: z.string().min(1, "Aula obrigatória"),
  language: z
    .string()
    .min(2, "Idioma obrigatório")
    .max(10, "Idioma muito longo")
    .regex(LANGUAGE_PATTERN, "Use formato de idioma como pt-BR ou en"),
  label: z
    .string()
    .min(2, "Descrição muito curta")
    .max(80, "Descrição muito longa"),
  fileUrl: z
    .string()
    .url("URL do arquivo .vtt obrigatória")
    .refine((value) => value.toLowerCase().endsWith(".vtt"), {
      message: "Somente arquivos .vtt são aceitos",
    }),
  isDefault: z.boolean().default(false),
});

export const VideoSubtitleUpdateInput = VideoSubtitleInput.extend({
  id: z.string().min(1, "ID obrigatório"),
});

export const VideoSubtitleIdSchema = z.object({
  id: z.string().min(1),
});

export const VideoSubtitleListSchema = z.object({
  lessonId: z.string().min(1),
});

export type VideoSubtitleInputType = z.infer<typeof VideoSubtitleInput>;
export type VideoSubtitleUpdateInputType = z.infer<
  typeof VideoSubtitleUpdateInput
>;
