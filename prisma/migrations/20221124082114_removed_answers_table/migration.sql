/*
  Warnings:

  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_flashcardId_fkey";

-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "correct" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "incorrect" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "last_studied" TIMESTAMP(3);

-- DropTable
DROP TABLE "Answer";
