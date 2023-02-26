/*
  Warnings:

  - You are about to drop the column `titleId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `titleId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionId` on the `SubscriptionType` table. All the data in the column will be lost.
  - You are about to drop the column `titleId` on the `SubscriptionType` table. All the data in the column will be lost.
  - You are about to drop the `Translate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `SubscriptionType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_titleId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_descriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_titleId_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionType" DROP CONSTRAINT "SubscriptionType_descriptionId_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionType" DROP CONSTRAINT "SubscriptionType_titleId_fkey";

-- DropIndex
DROP INDEX "Category_titleId_idx";

-- DropIndex
DROP INDEX "Category_titleId_key";

-- DropIndex
DROP INDEX "Lesson_descriptionId_idx";

-- DropIndex
DROP INDEX "Lesson_descriptionId_key";

-- DropIndex
DROP INDEX "Lesson_titleId_idx";

-- DropIndex
DROP INDEX "Lesson_titleId_key";

-- DropIndex
DROP INDEX "SubscriptionType_descriptionId_idx";

-- DropIndex
DROP INDEX "SubscriptionType_descriptionId_key";

-- DropIndex
DROP INDEX "SubscriptionType_titleId_idx";

-- DropIndex
DROP INDEX "SubscriptionType_titleId_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "titleId",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "descriptionId",
DROP COLUMN "titleId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubscriptionType" DROP COLUMN "descriptionId",
DROP COLUMN "titleId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "Translate";
