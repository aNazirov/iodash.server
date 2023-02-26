-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('first', 'second', 'third', 'fourth', 'fifth');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contactId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "subscriptionTypeId" INTEGER,
    "firstDevice" TEXT,
    "secondDevice" TEXT,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "password" TEXT NOT NULL,
    "activeBefore" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionType" (
    "id" SERIAL NOT NULL,
    "titleId" INTEGER NOT NULL,
    "descriptionId" INTEGER,
    "months" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentType" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentStatusType" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentStatusType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "titleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" SERIAL NOT NULL,
    "titleId" INTEGER NOT NULL,
    "descriptionId" INTEGER NOT NULL,
    "posterId" INTEGER NOT NULL,
    "link" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "titleId" INTEGER NOT NULL,
    "posterId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Translate" (
    "id" SERIAL NOT NULL,
    "ru" TEXT NOT NULL,
    "uz" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Translate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "titleId" INTEGER NOT NULL,
    "descriptionId" INTEGER,
    "needsId" INTEGER,
    "free" BOOLEAN NOT NULL DEFAULT false,
    "difficultyLevel" "DifficultyLevel" NOT NULL,
    "posterId" INTEGER,
    "videoId" INTEGER,
    "genders" "Gender"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "typeId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "summa" DOUBLE PRECISION NOT NULL,
    "click_trans_id" TEXT,
    "click_paydoc_id" TEXT,
    "merchant_trans_id" TEXT,
    "merchant_prepare_id" TEXT,
    "merchant_confirm_id" TEXT,
    "payme_transaction_id" TEXT,
    "cancel_reason" TEXT,
    "phone_number" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "perfermAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToLesson" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LessonToMaterial" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionType_titleId_key" ON "SubscriptionType"("titleId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionType_descriptionId_key" ON "SubscriptionType"("descriptionId");

-- CreateIndex
CREATE INDEX "SubscriptionType_titleId_idx" ON "SubscriptionType" USING HASH ("titleId");

-- CreateIndex
CREATE INDEX "SubscriptionType_descriptionId_idx" ON "SubscriptionType" USING HASH ("descriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_phone_key" ON "Contact"("phone");

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "Contact" USING HASH ("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_title_key" ON "Role"("title");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentType_title_key" ON "PaymentType"("title");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentStatusType_title_key" ON "PaymentStatusType"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Material_titleId_key" ON "Material"("titleId");

-- CreateIndex
CREATE INDEX "Material_titleId_idx" ON "Material" USING HASH ("titleId");

-- CreateIndex
CREATE UNIQUE INDEX "Banner_titleId_key" ON "Banner"("titleId");

-- CreateIndex
CREATE UNIQUE INDEX "Banner_descriptionId_key" ON "Banner"("descriptionId");

-- CreateIndex
CREATE INDEX "Banner_titleId_idx" ON "Banner" USING HASH ("titleId");

-- CreateIndex
CREATE INDEX "Banner_descriptionId_idx" ON "Banner" USING HASH ("descriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_titleId_key" ON "Category"("titleId");

-- CreateIndex
CREATE INDEX "Category_titleId_idx" ON "Category" USING HASH ("titleId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_titleId_key" ON "Lesson"("titleId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_descriptionId_key" ON "Lesson"("descriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_needsId_key" ON "Lesson"("needsId");

-- CreateIndex
CREATE INDEX "Lesson_titleId_idx" ON "Lesson" USING HASH ("titleId");

-- CreateIndex
CREATE INDEX "Lesson_descriptionId_idx" ON "Lesson" USING HASH ("descriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_click_trans_id_key" ON "Payment"("click_trans_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_merchant_trans_id_key" ON "Payment"("merchant_trans_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_payme_transaction_id_key" ON "Payment"("payme_transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "File_name_key" ON "File"("name");

-- CreateIndex
CREATE INDEX "File_name_idx" ON "File" USING HASH ("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToLesson_AB_unique" ON "_CategoryToLesson"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToLesson_B_index" ON "_CategoryToLesson"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LessonToMaterial_AB_unique" ON "_LessonToMaterial"("A", "B");

-- CreateIndex
CREATE INDEX "_LessonToMaterial_B_index" ON "_LessonToMaterial"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_subscriptionTypeId_fkey" FOREIGN KEY ("subscriptionTypeId") REFERENCES "SubscriptionType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionType" ADD CONSTRAINT "SubscriptionType_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Translate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionType" ADD CONSTRAINT "SubscriptionType_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES "Translate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Translate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Translate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES "Translate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_posterId_fkey" FOREIGN KEY ("posterId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Translate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_posterId_fkey" FOREIGN KEY ("posterId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Translate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES "Translate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_needsId_fkey" FOREIGN KEY ("needsId") REFERENCES "Translate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_posterId_fkey" FOREIGN KEY ("posterId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "PaymentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "PaymentStatusType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToLesson" ADD CONSTRAINT "_CategoryToLesson_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToLesson" ADD CONSTRAINT "_CategoryToLesson_B_fkey" FOREIGN KEY ("B") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToMaterial" ADD CONSTRAINT "_LessonToMaterial_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToMaterial" ADD CONSTRAINT "_LessonToMaterial_B_fkey" FOREIGN KEY ("B") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
