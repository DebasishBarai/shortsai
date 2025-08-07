/*
  Warnings:

  - The values [female,male] on the enum `VoiceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VoiceType_new" AS ENUM ('Joanna', 'Salli', 'Kimberly', 'Kendra', 'Ivy', 'Matthew', 'Justin', 'Joey');
ALTER TABLE "Video" ALTER COLUMN "voiceType" DROP DEFAULT;
ALTER TABLE "Video" ALTER COLUMN "voiceType" TYPE "VoiceType_new" USING ("voiceType"::text::"VoiceType_new");
ALTER TYPE "VoiceType" RENAME TO "VoiceType_old";
ALTER TYPE "VoiceType_new" RENAME TO "VoiceType";
DROP TYPE "VoiceType_old";
ALTER TABLE "Video" ALTER COLUMN "voiceType" SET DEFAULT 'Joanna';
COMMIT;

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "voiceType" SET DEFAULT 'Joanna';
