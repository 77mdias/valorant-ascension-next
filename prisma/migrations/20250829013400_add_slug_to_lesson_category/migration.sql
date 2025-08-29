/*
  Warnings:

  - The values [AVANÇADO] on the enum `LessonLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."LessonLevel_new" AS ENUM ('INICIANTE', 'INTERMEDIARIO', 'AVANCADO', 'IMORTAL');
ALTER TABLE "public"."lessonCategory" ALTER COLUMN "level" DROP DEFAULT;
ALTER TABLE "public"."lessonCategory" ALTER COLUMN "level" TYPE "public"."LessonLevel_new" USING ("level"::text::"public"."LessonLevel_new");
ALTER TYPE "public"."LessonLevel" RENAME TO "LessonLevel_old";
ALTER TYPE "public"."LessonLevel_new" RENAME TO "LessonLevel";
DROP TYPE "public"."LessonLevel_old";
ALTER TABLE "public"."lessonCategory" ALTER COLUMN "level" SET DEFAULT 'INICIANTE';
COMMIT;
