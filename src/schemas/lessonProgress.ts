import { z } from "zod";

export const lessonProgressUpdateSchema = z.object({
  lastPosition: z.number().nonnegative(),
  totalDuration: z.number().nonnegative(),
});

export type LessonProgressUpdateInput = z.infer<
  typeof lessonProgressUpdateSchema
>;

export const LESSON_COMPLETE_RATIO = 0.9;
