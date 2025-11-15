-- CreateTable
CREATE TABLE "VideoTimestamp" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoTimestamp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VideoTimestamp_lessonId_time_idx" ON "VideoTimestamp"("lessonId", "time");

-- AddForeignKey
ALTER TABLE "VideoTimestamp" ADD CONSTRAINT "VideoTimestamp_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
