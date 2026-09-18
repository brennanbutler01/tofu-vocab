/*
  Warnings:

  - You are about to drop the column `visible` on the `Flashcard` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserFlashcard" DROP CONSTRAINT "UserFlashcard_flashcardId_fkey";

-- AlterTable
ALTER TABLE "Flashcard" DROP COLUMN "visible";

-- AddForeignKey
ALTER TABLE "UserFlashcard" ADD CONSTRAINT "UserFlashcard_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
