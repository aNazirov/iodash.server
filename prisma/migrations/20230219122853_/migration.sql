/*
  Warnings:

  - You are about to drop the column `phone` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `difficultyLevel` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `free` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `needsId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `videoId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `firstDevice` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `secondDevice` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Banner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Material` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LessonToMaterial` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Banner" DROP CONSTRAINT "Banner_descriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Banner" DROP CONSTRAINT "Banner_posterId_fkey";

-- DropForeignKey
ALTER TABLE "Banner" DROP CONSTRAINT "Banner_titleId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_needsId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_videoId_fkey";

-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_titleId_fkey";

-- DropForeignKey
ALTER TABLE "_LessonToMaterial" DROP CONSTRAINT "_LessonToMaterial_A_fkey";

-- DropForeignKey
ALTER TABLE "_LessonToMaterial" DROP CONSTRAINT "_LessonToMaterial_B_fkey";

-- DropIndex
DROP INDEX "Contact_phone_key";

-- DropIndex
DROP INDEX "Lesson_needsId_key";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "difficultyLevel",
DROP COLUMN "free",
DROP COLUMN "needsId",
DROP COLUMN "videoId",
ADD COLUMN     "fileId" INTEGER,
ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstDevice",
DROP COLUMN "secondDevice";

-- DropTable
DROP TABLE "Banner";

-- DropTable
DROP TABLE "Material";

-- DropTable
DROP TABLE "_LessonToMaterial";

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "iconId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LessonToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ViewedUsersToLessons" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_DownloadedUsersToLessons" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LessonToTag_AB_unique" ON "_LessonToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_LessonToTag_B_index" ON "_LessonToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ViewedUsersToLessons_AB_unique" ON "_ViewedUsersToLessons"("A", "B");

-- CreateIndex
CREATE INDEX "_ViewedUsersToLessons_B_index" ON "_ViewedUsersToLessons"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DownloadedUsersToLessons_AB_unique" ON "_DownloadedUsersToLessons"("A", "B");

-- CreateIndex
CREATE INDEX "_DownloadedUsersToLessons_B_index" ON "_DownloadedUsersToLessons"("B");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToTag" ADD CONSTRAINT "_LessonToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToTag" ADD CONSTRAINT "_LessonToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ViewedUsersToLessons" ADD CONSTRAINT "_ViewedUsersToLessons_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ViewedUsersToLessons" ADD CONSTRAINT "_ViewedUsersToLessons_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DownloadedUsersToLessons" ADD CONSTRAINT "_DownloadedUsersToLessons_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DownloadedUsersToLessons" ADD CONSTRAINT "_DownloadedUsersToLessons_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
