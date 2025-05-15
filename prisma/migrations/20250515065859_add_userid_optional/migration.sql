/*
  Warnings:

  - You are about to drop the column `userMobile` on the `Booking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userMobile_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "userMobile",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
