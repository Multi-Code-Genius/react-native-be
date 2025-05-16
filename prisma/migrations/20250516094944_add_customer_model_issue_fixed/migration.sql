/*
  Warnings:

  - A unique constraint covering the columns `[userId,createdById]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Customer_userId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_createdById_key" ON "Customer"("userId", "createdById");
