-- AlterTable
ALTER TABLE "public"."lessonProgress"
ADD COLUMN     "lastPosition" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalDuration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "completedAt" TIMESTAMP(3);

-- Ensure existing rows have a numeric progress value before enforcing NOT NULL
UPDATE "public"."lessonProgress" SET "progress" = 0 WHERE "progress" IS NULL;
ALTER TABLE "public"."lessonProgress" ALTER COLUMN "progress" SET DEFAULT 0;
ALTER TABLE "public"."lessonProgress" ALTER COLUMN "progress" SET NOT NULL;
