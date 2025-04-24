-- DropForeignKey
ALTER TABLE "RejectedRoom" DROP CONSTRAINT "RejectedRoom_roomId_fkey";

-- DropForeignKey
ALTER TABLE "RejectedRoom" DROP CONSTRAINT "RejectedRoom_userId_fkey";

-- AddForeignKey
ALTER TABLE "RejectedRoom" ADD CONSTRAINT "RejectedRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedRoom" ADD CONSTRAINT "RejectedRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
