/*
  Warnings:

  - You are about to drop the `StudyGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFlashcard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FlashcardToStudyGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Members` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `boxId` to the `Flashcard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StudyGroup" DROP CONSTRAINT "StudyGroup_createdById_fkey";

-- DropForeignKey
ALTER TABLE "UserFlashcard" DROP CONSTRAINT "UserFlashcard_flashcardId_fkey";

-- DropForeignKey
ALTER TABLE "UserFlashcard" DROP CONSTRAINT "UserFlashcard_userId_fkey";

-- DropForeignKey
ALTER TABLE "_FlashcardToStudyGroup" DROP CONSTRAINT "_FlashcardToStudyGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_FlashcardToStudyGroup" DROP CONSTRAINT "_FlashcardToStudyGroup_B_fkey";

-- DropForeignKey
ALTER TABLE "_Members" DROP CONSTRAINT "_Members_A_fkey";

-- DropForeignKey
ALTER TABLE "_Members" DROP CONSTRAINT "_Members_B_fkey";

-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "boxId" TEXT NOT NULL;

-- DropTable
DROP TABLE "StudyGroup";

-- DropTable
DROP TABLE "UserFlashcard";

-- DropTable
DROP TABLE "_FlashcardToStudyGroup";

-- DropTable
DROP TABLE "_Members";

-- CreateTable
CREATE TABLE "StudyAttempt" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,

    CONSTRAINT "StudyAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeitnerBox" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LeitnerBox_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "LeitnerBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyAttempt" ADD CONSTRAINT "StudyAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyAttempt" ADD CONSTRAINT "StudyAttempt_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeitnerBox" ADD CONSTRAINT "LeitnerBox_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
