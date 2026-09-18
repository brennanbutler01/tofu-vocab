/*
  Warnings:

  - A unique constraint covering the columns `[userId,boxNumber]` on the table `LeitnerBox` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LeitnerBox_userId_boxNumber_key" ON "LeitnerBox"("userId", "boxNumber");
