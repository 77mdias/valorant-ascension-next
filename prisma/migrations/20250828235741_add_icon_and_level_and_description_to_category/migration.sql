-- CreateEnum
CREATE TYPE "public"."LessonLevel" AS ENUM ('INICIANTE', 'INTERMEDIARIO', 'AVANÇADO', 'IMORTAL');

-- AlterTable
ALTER TABLE "public"."lessonCategory" ADD COLUMN     "description" TEXT,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "level" "public"."LessonLevel" NOT NULL DEFAULT 'INICIANTE';
