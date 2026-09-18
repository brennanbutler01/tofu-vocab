-- CreateTable
CREATE TABLE "StudyGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FlashcardToStudyGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_StudyGroupToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FlashcardToStudyGroup_AB_unique" ON "_FlashcardToStudyGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_FlashcardToStudyGroup_B_index" ON "_FlashcardToStudyGroup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StudyGroupToUser_AB_unique" ON "_StudyGroupToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_StudyGroupToUser_B_index" ON "_StudyGroupToUser"("B");

-- AddForeignKey
ALTER TABLE "_FlashcardToStudyGroup" ADD CONSTRAINT "_FlashcardToStudyGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FlashcardToStudyGroup" ADD CONSTRAINT "_FlashcardToStudyGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "StudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudyGroupToUser" ADD CONSTRAINT "_StudyGroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "StudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudyGroupToUser" ADD CONSTRAINT "_StudyGroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
