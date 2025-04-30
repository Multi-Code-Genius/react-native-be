/*
  Warnings:

  - You are about to drop the column `timeSlotId` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `date` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_timeSlotId_fkey";

-- DropIndex
DROP INDEX "Booking_timeSlotId_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "timeSlotId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TimeSlot" ADD COLUMN     "bookingId" TEXT;

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
