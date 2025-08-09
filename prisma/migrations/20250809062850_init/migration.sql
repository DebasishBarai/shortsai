/*
  Warnings:

  - You are about to drop the column `ImagesUrl` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "ImagesUrl",
ADD COLUMN     "imagesUrl" TEXT[];
