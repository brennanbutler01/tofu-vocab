-- CreateEnum
CREATE TYPE "FlashcardSources" AS ENUM ('ALL', 'BOX4', 'NOT_STUDIED', 'IN_PROGRESS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "flashcardSource" "FlashcardSources" NOT NULL DEFAULT 'ALL';
