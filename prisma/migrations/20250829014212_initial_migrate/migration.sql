/*
  Warnings:

  - The values [AVANCADO] on the enum `LessonLevel` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `lessonCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."LessonLevel_new" AS ENUM ('INICIANTE', 'INTERMEDIARIO', 'AVANÇADO', 'IMORTAL');
ALTER TABLE "public"."lessonCategory" ALTER COLUMN "level" DROP DEFAULT;
ALTER TABLE "public"."lessonCategory" ALTER COLUMN "level" TYPE "public"."LessonLevel_new" USING ("level"::text::"public"."LessonLevel_new");
ALTER TYPE "public"."LessonLevel" RENAME TO "LessonLevel_old";
ALTER TYPE "public"."LessonLevel_new" RENAME TO "LessonLevel";
DROP TYPE "public"."LessonLevel_old";
ALTER TABLE "public"."lessonCategory" ALTER COLUMN "level" SET DEFAULT 'INICIANTE';
COMMIT;

-- AlterTable
ALTER TABLE "public"."lessonCategory" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT 'default-slug';

-- CreateIndex
CREATE UNIQUE INDEX "lessonCategory_slug_key" ON "public"."lessonCategory"("slug");
