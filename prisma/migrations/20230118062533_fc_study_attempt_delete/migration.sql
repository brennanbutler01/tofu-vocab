-- DropForeignKey
ALTER TABLE "StudyAttempt" DROP CONSTRAINT "StudyAttempt_flashcardId_fkey";

-- AlterTable
ALTER TABLE "StudyAttempt" ALTER COLUMN "flashcardId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StudyAttempt" ADD CONSTRAINT "StudyAttempt_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
