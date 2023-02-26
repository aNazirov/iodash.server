/*
  Warnings:

  - You are about to drop the column `todayDowloads` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "todayDowloads",
ADD COLUMN     "todayDownloads" INTEGER NOT NULL DEFAULT 0;
