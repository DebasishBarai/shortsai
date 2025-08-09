/*
  Warnings:

  - The values [5:4,2:3,3:5,4:5] on the enum `AspectRatio` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImageList` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AspectRatio_new" AS ENUM ('9:16', '16:9', '4:3', '3:4', '1:1');
ALTER TABLE "Video" ALTER COLUMN "aspectRatio" DROP DEFAULT;
ALTER TABLE "Video" ALTER COLUMN "aspectRatio" TYPE "AspectRatio_new" USING ("aspectRatio"::text::"AspectRatio_new");
ALTER TYPE "AspectRatio" RENAME TO "AspectRatio_old";
ALTER TYPE "AspectRatio_new" RENAME TO "AspectRatio";
DROP TYPE "AspectRatio_old";
ALTER TABLE "Video" ALTER COLUMN "aspectRatio" SET DEFAULT '9:16';
COMMIT;

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_imageListId_fkey";

-- DropForeignKey
ALTER TABLE "ImageList" DROP CONSTRAINT "ImageList_videoId_fkey";

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "ImagesUrl" TEXT[],
ADD COLUMN     "caption" TEXT;

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "ImageList";
