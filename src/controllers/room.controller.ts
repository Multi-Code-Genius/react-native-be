import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const findOrCreateRoom = async (req: Request, res: Response) => {
  const { latitude, longitude, platform }: any = req.body;
  const userId = (req as any).user?.userId;

  if (!latitude || !longitude || !platform) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const nearbyRooms = await prisma.room.findMany({
      where: {
        status: "open",
        platform,
        location: {
          path: ["lat"],
          gte: latitude - 0.1,
          lte: latitude + 0.1
        },
        AND: {
          location: {
            path: ["lng"],
            gte: longitude - 0.1,
            lte: longitude + 0.1
          }
        }
      },
      include: {
        RoomUser: {
          include: {
            User: true
          }
        }
      }
    });

    const roomWithUsers = nearbyRooms.map((room) => ({
      ...room,
      users: room.RoomUser.map((ru) => ru.User)
    }));

    const availableRoom = roomWithUsers.find(
      (room) => room.users.length < room.capacity
    );

    if (availableRoom) {
      const isAlreadyJoined = await prisma.roomUser.findFirst({
        where: {
          userId,
          roomId: availableRoom.id
        }
      });

      if (!isAlreadyJoined) {
        await prisma.roomUser.create({
          data: {
            userId,
            roomId: availableRoom.id
          }
        });

        const userCount = availableRoom.users.length + 1;
        if (userCount >= availableRoom.capacity) {
          await prisma.room.update({
            where: { id: availableRoom.id },
            data: { status: "full" }
          });
        }
      }

      const totalUsers = await prisma.roomUser.count({
        where: { roomId: availableRoom.id }
      });

      if (totalUsers >= availableRoom.capacity) {
        await prisma.room.update({
          where: { id: availableRoom.id },
          data: { status: "full" }
        });
      }

      const room = await prisma.room.findUnique({
        where: { id: availableRoom.id },
        include: {
          RoomUser: {
            include: {
              User: true
            }
          }
        }
      });

      return res.status(200).json({
        room: room,
        joined: true,
        message: "Joined existing room"
      });
    }

    const newRoom = await prisma.room.create({
      data: {
        platform,
        location: {
          lat: latitude,
          lng: longitude
        },
        capacity: 5,
        status: "open",
        RoomUser: {
          create: {
            userId
          }
        }
      },
      include: {
        RoomUser: {
          include: {
            User: true
          }
        }
      }
    });

    return res.status(201).json({
      room: newRoom,
      created: true,
      message: "New Room created and joined"
    });
  } catch (error) {
    console.error("Error finding or creating room:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  try {
    const room = await prisma.room.delete({
      where: { id: roomId }
    });

    if (!room) {
      res.status(500).json({ message: "Room Does not Exit" });
    }

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting room:", error);
    res
      .status(500)
      .json({ message: error.message || "Server error while deleting room" });
  }
};
