-- DropForeignKey
ALTER TABLE "StudyAttempt" DROP CONSTRAINT "StudyAttempt_flashcardId_fkey";

-- AddForeignKey
ALTER TABLE "StudyAttempt" ADD CONSTRAINT "StudyAttempt_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
