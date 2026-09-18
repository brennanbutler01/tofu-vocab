/*
  Warnings:

  - A unique constraint covering the columns `[flashcardId,userId]` on the table `UserFlashcard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserFlashcard_flashcardId_userId_key" ON "UserFlashcard"("flashcardId", "userId");
