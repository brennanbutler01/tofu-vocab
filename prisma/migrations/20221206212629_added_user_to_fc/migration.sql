/*
  Warnings:

  - The primary key for the `UserFlashcard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `userId` to the `Flashcard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserFlashcard" DROP CONSTRAINT "UserFlashcard_pkey",
ADD CONSTRAINT "UserFlashcard_pkey" PRIMARY KEY ("flashcardId", "userId");

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
