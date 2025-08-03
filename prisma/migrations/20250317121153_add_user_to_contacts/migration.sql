/*
  Warnings:

  - A unique constraint covering the columns `[phone,userId]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Contact_phone_key";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "groupId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Contact_phone_userId_key" ON "Contact"("phone", "userId");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
