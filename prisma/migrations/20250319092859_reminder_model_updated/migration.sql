-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_contactId_fkey";

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
