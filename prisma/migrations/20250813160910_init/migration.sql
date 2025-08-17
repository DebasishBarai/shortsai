-- AlterTable
ALTER TABLE "public"."Video" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "error" BOOLEAN NOT NULL DEFAULT false;
