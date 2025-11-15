import { z } from "zod";

export const VideoTimestampInput = z.object({
  lessonId: z.string().min(1, "Aula obrigatória"),
  time: z
    .number()
    .int({ message: "Timestamp deve ser inteiro" })
    .min(0, "Timestamp não pode ser negativo"),
  label: z.string().min(2, "Descrição muito curta").max(140),
});

export const VideoTimestampUpdateInput = VideoTimestampInput.extend({
  id: z.string().min(1, "ID obrigatório"),
});

export const VideoTimestampIdSchema = z.object({
  id: z.string().min(1),
});

export const VideoTimestampListSchema = z.object({
  lessonId: z.string().min(1),
});

export type VideoTimestampInputType = z.infer<typeof VideoTimestampInput>;
export type VideoTimestampUpdateInputType = z.infer<
  typeof VideoTimestampUpdateInput
>;
