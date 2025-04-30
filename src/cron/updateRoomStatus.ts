import { prisma } from "../utils/prisma";

export async function updateRoomStatus() {
  const rooms = await prisma.room.findMany({
    where: { status: "full" },
  });

  for (const room of rooms) {
    const roomStatusTime = room.updatedAt;
    const now = new Date();

    if (true) {
      await prisma.room.update({
        where: { id: room.id },
        data: { status: "closed" },
      });

      console.log(`Room ${room.id} status changed to "closed".`);
    }
  }
}
