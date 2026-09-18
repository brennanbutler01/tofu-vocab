/*
  Warnings:

  - Made the column `learningLanguage` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nativeLanguage` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `studySide` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "learningLanguage" SET NOT NULL,
ALTER COLUMN "nativeLanguage" SET NOT NULL,
ALTER COLUMN "studySide" SET NOT NULL;
