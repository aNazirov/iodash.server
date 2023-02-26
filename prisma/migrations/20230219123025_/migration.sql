/*
  Warnings:

  - You are about to drop the column `genders` on the `Lesson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "genders";

-- DropEnum
DROP TYPE "DifficultyLevel";

-- DropEnum
DROP TYPE "Gender";
