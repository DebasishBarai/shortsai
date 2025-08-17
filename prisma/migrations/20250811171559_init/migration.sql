/*
  Warnings:

  - You are about to drop the column `subscriptionEndDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionType` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "subscriptionEndDate",
DROP COLUMN "subscriptionType",
ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "public"."SubscriptionType";
