/*
  Warnings:

  - The `front` column on the `Flashcard` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `back` column on the `Flashcard` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Flashcard" DROP COLUMN "front",
ADD COLUMN     "front" TEXT[],
DROP COLUMN "back",
ADD COLUMN     "back" TEXT[];
