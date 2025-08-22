/*
  Warnings:

  - A unique constraint covering the columns `[polarCustomerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "polarCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_polarCustomerId_key" ON "public"."User"("polarCustomerId");
