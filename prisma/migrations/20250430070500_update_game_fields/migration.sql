/*
  Warnings:

  - Added the required column `nets` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `location` on the `Game` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "TimeSlot" DROP CONSTRAINT "TimeSlot_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "TimeSlot" DROP CONSTRAINT "TimeSlot_gameId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "nets" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "gameInfo" JSONB,
ADD COLUMN     "net" DOUBLE PRECISION,
DROP COLUMN "location",
ADD COLUMN     "location" JSONB NOT NULL;

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
