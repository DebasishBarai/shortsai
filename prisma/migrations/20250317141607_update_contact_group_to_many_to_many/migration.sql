/*
  Warnings:

  - You are about to drop the column `groupId` on the `Contact` table. All the data in the column will be lost.
  - Made the column `userId` on table `Contact` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_groupId_fkey";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "groupId",
ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "ContactsOnGroups" (
    "contactId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactsOnGroups_pkey" PRIMARY KEY ("contactId","groupId")
);

-- AddForeignKey
ALTER TABLE "ContactsOnGroups" ADD CONSTRAINT "ContactsOnGroups_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactsOnGroups" ADD CONSTRAINT "ContactsOnGroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
