/*
  Warnings:

  - Added the required column `number` to the `lessons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."lessons" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "number" INTEGER NOT NULL;
