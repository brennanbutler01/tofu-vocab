/*
  Warnings:

  - You are about to drop the `_FlashcardToStudyGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FlashcardToStudyGroup" DROP CONSTRAINT "_FlashcardToStudyGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_FlashcardToStudyGroup" DROP CONSTRAINT "_FlashcardToStudyGroup_B_fkey";

-- DropTable
DROP TABLE "_FlashcardToStudyGroup";

-- CreateTable
CREATE TABLE "GroupFlashcard" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupId" TEXT NOT NULL,
    "front" TEXT[],
    "back" TEXT[],

    CONSTRAINT "GroupFlashcard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupFlashcard" ADD CONSTRAINT "GroupFlashcard_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "StudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
