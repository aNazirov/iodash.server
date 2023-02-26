/*
  Warnings:

  - You are about to drop the column `posterId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_posterId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "posterId",
ADD COLUMN     "show" BOOLEAN NOT NULL DEFAULT true;
