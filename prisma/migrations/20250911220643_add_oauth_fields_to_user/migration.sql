-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "branchId" DROP NOT NULL,
ALTER COLUMN "nickname" DROP NOT NULL,
ALTER COLUMN "isActive" SET DEFAULT true;
