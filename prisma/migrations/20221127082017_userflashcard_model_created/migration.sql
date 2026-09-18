/*
  Warnings:

  - You are about to drop the column `attempts` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `correct` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `current_box` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `incorrect` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `last_studied` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `previous_box` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `times_seen` on the `Flashcard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Flashcard" DROP COLUMN "attempts",
DROP COLUMN "correct",
DROP COLUMN "current_box",
DROP COLUMN "incorrect",
DROP COLUMN "last_studied",
DROP COLUMN "previous_box",
DROP COLUMN "times_seen";

-- CreateTable
CREATE TABLE "UserFlashcard" (
    "flashcardId" TEXT NOT NULL,
    "current_box" INTEGER NOT NULL DEFAULT 0,
    "previous_box" INTEGER NOT NULL DEFAULT 0,
    "last_studied" TIMESTAMP(3),
    "correct" INTEGER NOT NULL DEFAULT 0,
    "incorrect" INTEGER NOT NULL DEFAULT 0,
    "times_seen" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserFlashcard_pkey" PRIMARY KEY ("flashcardId")
);

-- AddForeignKey
ALTER TABLE "UserFlashcard" ADD CONSTRAINT "UserFlashcard_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFlashcard" ADD CONSTRAINT "UserFlashcard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
