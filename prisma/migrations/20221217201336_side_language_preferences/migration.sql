-- CreateEnum
CREATE TYPE "Languages" AS ENUM ('VIETNAMESE', 'ENGLISH');

-- CreateEnum
CREATE TYPE "StudySides" AS ENUM ('FRONT', 'BACK');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "learningLanguage" "Languages" DEFAULT 'VIETNAMESE',
ADD COLUMN     "nativeLanguage" "Languages" DEFAULT 'ENGLISH',
ADD COLUMN     "studySide" "StudySides" DEFAULT 'FRONT';
