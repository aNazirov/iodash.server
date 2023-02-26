-- CreateTable
CREATE TABLE "_FavouritedUsersToLessons" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FavouritedUsersToLessons_AB_unique" ON "_FavouritedUsersToLessons"("A", "B");

-- CreateIndex
CREATE INDEX "_FavouritedUsersToLessons_B_index" ON "_FavouritedUsersToLessons"("B");

-- AddForeignKey
ALTER TABLE "_FavouritedUsersToLessons" ADD CONSTRAINT "_FavouritedUsersToLessons_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavouritedUsersToLessons" ADD CONSTRAINT "_FavouritedUsersToLessons_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
