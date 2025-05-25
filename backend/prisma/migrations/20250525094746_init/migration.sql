/*
  Warnings:

  - A unique constraint covering the columns `[photoId]` on the table `Leaderboard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_photoId_key" ON "Leaderboard"("photoId");
