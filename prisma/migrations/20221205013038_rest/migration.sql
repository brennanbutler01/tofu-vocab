/*
  Warnings:

  - You are about to drop the `_StudyGroupToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdById` to the `StudyGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_StudyGroupToUser" DROP CONSTRAINT "_StudyGroupToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudyGroupToUser" DROP CONSTRAINT "_StudyGroupToUser_B_fkey";

-- AlterTable
ALTER TABLE "StudyGroup" ADD COLUMN     "createdById" TEXT NOT NULL;

-- DropTable
DROP TABLE "_StudyGroupToUser";

-- CreateTable
CREATE TABLE "_Members" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Members_AB_unique" ON "_Members"("A", "B");

-- CreateIndex
CREATE INDEX "_Members_B_index" ON "_Members"("B");

-- AddForeignKey
ALTER TABLE "StudyGroup" ADD CONSTRAINT "StudyGroup_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Members" ADD CONSTRAINT "_Members_A_fkey" FOREIGN KEY ("A") REFERENCES "StudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Members" ADD CONSTRAINT "_Members_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
