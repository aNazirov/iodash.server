/*
  Warnings:

  - You are about to drop the column `iconId` on the `Tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_iconId_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "iconId",
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "show" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Technology" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "iconId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LessonToTechnology" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LessonToTechnology_AB_unique" ON "_LessonToTechnology"("A", "B");

-- CreateIndex
CREATE INDEX "_LessonToTechnology_B_index" ON "_LessonToTechnology"("B");

-- AddForeignKey
ALTER TABLE "Technology" ADD CONSTRAINT "Technology_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToTechnology" ADD CONSTRAINT "_LessonToTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToTechnology" ADD CONSTRAINT "_LessonToTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
