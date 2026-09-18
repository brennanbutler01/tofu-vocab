/*
  Warnings:

  - Added the required column `boxNumber` to the `LeitnerBox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeitnerBox" ADD COLUMN     "boxNumber" INTEGER NOT NULL;
