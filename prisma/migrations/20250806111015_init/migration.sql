/*
  Warnings:

  - You are about to drop the `Audio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Script` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('customPrompt', 'randomAiStory', 'scaryStay', 'historicalFacts', 'bedTimeStory', 'motivational', 'funFacts');

-- CreateEnum
CREATE TYPE "VideoStyle" AS ENUM ('realistic', 'cartoon', 'watercolor', 'sketch');

-- CreateEnum
CREATE TYPE "VideoDuration" AS ENUM ('15 sec', '30 sec', '60 sec');

-- DropForeignKey
ALTER TABLE "Audio" DROP CONSTRAINT "Audio_videoId_fkey";

-- DropForeignKey
ALTER TABLE "Script" DROP CONSTRAINT "Script_videoId_fkey";

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "audioUrl" TEXT,
ADD COLUMN     "contentType" "ContentType" DEFAULT 'historicalFacts',
ADD COLUMN     "duration" "VideoDuration" DEFAULT '60 sec',
ADD COLUMN     "frames" JSONB,
ADD COLUMN     "prompt" TEXT,
ADD COLUMN     "script" TEXT,
ADD COLUMN     "style" "VideoStyle" DEFAULT 'realistic',
ALTER COLUMN "url" DROP NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "voiceType" DROP NOT NULL,
ALTER COLUMN "aspectRatio" DROP NOT NULL;

-- DropTable
DROP TABLE "Audio";

-- DropTable
DROP TABLE "Script";
