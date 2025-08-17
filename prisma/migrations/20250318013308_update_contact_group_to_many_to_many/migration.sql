/*
  Warnings:

  - You are about to drop the `ContactsOnGroups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContactsOnGroups" DROP CONSTRAINT "ContactsOnGroups_contactId_fkey";

-- DropForeignKey
ALTER TABLE "ContactsOnGroups" DROP CONSTRAINT "ContactsOnGroups_groupId_fkey";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "groupId" TEXT;

-- DropTable
DROP TABLE "ContactsOnGroups";

-- CreateTable
CREATE TABLE "_ContactToGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ContactToGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ContactToGroup_B_index" ON "_ContactToGroup"("B");

-- AddForeignKey
ALTER TABLE "_ContactToGroup" ADD CONSTRAINT "_ContactToGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToGroup" ADD CONSTRAINT "_ContactToGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
