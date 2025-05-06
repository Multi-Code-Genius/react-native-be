/*
  Warnings:

  - You are about to drop the column `userId` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `userMobile` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Made the column `mobileNumber` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "userId",
ADD COLUMN     "userMobile" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "mobileNumber" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userMobile_fkey" FOREIGN KEY ("userMobile") REFERENCES "User"("mobileNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
