/*
  Warnings:

  - The `origin` column on the `Flashcard` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "FlashcardOrigins" AS ENUM ('USER', 'GROUP', 'RANDOM_WORD');

-- AlterTable
ALTER TABLE "Flashcard" DROP COLUMN "origin",
ADD COLUMN     "origin" "FlashcardOrigins" NOT NULL DEFAULT 'USER';
