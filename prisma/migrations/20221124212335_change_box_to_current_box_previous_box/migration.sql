/*
  Warnings:

  - You are about to drop the column `box` on the `Flashcard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Flashcard" DROP COLUMN "box",
ADD COLUMN     "current_box" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "previous_box" INTEGER NOT NULL DEFAULT 0;
