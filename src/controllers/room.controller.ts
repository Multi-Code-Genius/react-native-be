import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { Mutex } from "async-mutex";
import { generateReadableName } from "../helper/useGenerateReadableName";
const roomMutex = new Mutex();

const MAX_RETRIES = 3;

const retryTransaction = async (
  fn: Function,
  retries: number = MAX_RETRIES
): Promise<any> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries === 0) {
      throw error;
    }
    console.log(
      `Retrying due to error: ${error.message}. Retries left: ${retries - 1}`
    );
    return retryTransaction(fn, retries - 1);
  }
};

export const findOrCreateRoom = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user || !user.location) {
    return res.status(400).json({ message: "User location not found" });
  }

  const location = user.location as { latitude: number; longitude: number };
  const userLatitude = location.latitude;
  const userLongitude = location.longitude;

  const latDegreeDistance = 10 / 111;
  const lngDegreeDistance =
    10 / (111 * Math.cos(userLatitude * (Math.PI / 180)));

  const minLat = userLatitude - latDegreeDistance;
  const maxLat = userLatitude + latDegreeDistance;
  const minLng = userLongitude - lngDegreeDistance;
  const maxLng = userLongitude + lngDegreeDistance;

  try {
    const result = await retryTransaction(async () => {
      return await roomMutex.runExclusive(async () => {
        return await prisma.$transaction(async (prisma) => {
          const activeRoomUser = await prisma.roomUser.findFirst({
            where: {
              userId,
              Room: {
                status: {
                  not: "closed",
                },
              },
            },
            include: {
              Room: {
                include: {
                  RoomUser: {
                    include: {
                      User: {
                        select: {
                          id: true,
                          email: true,
                          name: true,
                          profile_pic: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          });

          if (activeRoomUser) {
            return {
              room: activeRoomUser.Room,
              joined: true,
              message: "User is already in an active room.",
            };
          }

          let room = await prisma.room.findFirst({
            where: {
              status: "open",
              capacity: { gt: 0 },
              RoomUser: {
                none: {
                  userId,
                },
              },
              RejectedRoom: {
                none: {
                  userId,
                },
              },
              AND: [
                {
                  location: {
                    path: ["lat"],
                    gte: minLat,
                    lte: maxLat,
                  },
                },
                {
                  location: {
                    path: ["lng"],
                    gte: minLng,
                    lte: maxLng,
                  },
                },
              ],
            },
            include: {
              RoomUser: true,
            },
          });

          if (room) {
            const count = room.RoomUser.length;

            await prisma.roomUser.create({
              data: { userId, roomId: room.id },
            });

            const updatedCount = count + 1;
            if (updatedCount >= room.capacity) {
              await prisma.room.update({
                where: { id: room.id },
                data: { status: "full" },
              });
            }

            const updatedRoom = await prisma.room.findUnique({
              where: { id: room.id },
              include: {
                RoomUser: {
                  include: {
                    User: {
                      select: {
                        id: true,
                        email: true,
                        name: true,
                        profile_pic: true,
                      },
                    },
                  },
                },
              },
            });

            return {
              room: updatedRoom,
              joined: true,
              message: "Joined existing room",
            };
          }

          const newRoom = await prisma.room.create({
            data: {
              platform: generateReadableName(),
              location: {
                lat: location.latitude,
                lng: location.longitude,
              },
              capacity: 3,
              status: "open",
              RoomUser: {
                create: {
                  userId,
                },
              },
            },
            include: {
              RoomUser: {
                include: {
                  User: {
                    select: {
                      id: true,
                      email: true,
                      name: true,
                      profile_pic: true,
                    },
                  },
                },
              },
            },
          });

          return {
            room: newRoom,
            joined: true,
            message: "New Room created and joined",
          };
        });
      });
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error in findOrCreateRoom:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  try {
    const room = await prisma.room.delete({
      where: { id: roomId },
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

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.location) {
      return res.status(400).json({ message: "User location not found" });
    }

    const location = user.location as { latitude: number; longitude: number };
    const userLatitude = location.latitude;
    const userLongitude = location.longitude;

    const latDegreeDistance = 10 / 111;
    const lngDegreeDistance =
      10 / (111 * Math.cos(userLatitude * (Math.PI / 180)));

    const minLat = userLatitude - latDegreeDistance;
    const maxLat = userLatitude + latDegreeDistance;
    const minLng = userLongitude - lngDegreeDistance;
    const maxLng = userLongitude + lngDegreeDistance;

    const rooms = await prisma.room.findMany({
      where: {
        RejectedRoom: {
          none: {
            userId,
          },
        },
        AND: [
          {
            location: {
              path: ["lat"],
              gte: minLat,
              lte: maxLat,
            },
          },
          {
            location: {
              path: ["lng"],
              gte: minLng,
              lte: maxLng,
            },
          },
        ],
      },
      include: {
        RoomUser: {
          include: {
            User: {
              select: {
                name: true,
                id: true,
                profile_pic: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!rooms || rooms.length === 0) {
      return res
        .status(200)
        .json({ message: "No rooms found near your location" });
    }

    res.status(200).json({ rooms });
  } catch (error: any) {
    console.error("Error fetching rooms:", error);
    res
      .status(500)
      .json({ message: error.message || "Server error while fetching rooms" });
  }
};

export const rejectRoom = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({ message: "roomId is required." });
  }

  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { RoomUser: true },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    await prisma.rejectedRoom.upsert({
      where: {
        userId_roomId: { userId, roomId },
      },
      update: {},
      create: {
        userId,
        roomId,
      },
    });

    const roomUser = await prisma.roomUser.findFirst({
      where: { userId, roomId },
    });

    if (roomUser) {
      await prisma.roomUser.delete({ where: { id: roomUser.id } });

      const remaining = await prisma.roomUser.count({
        where: { roomId },
      });

      if (room.status === "full" && remaining < room.capacity) {
        await prisma.room.update({
          where: { id: roomId },
          data: { status: "open" },
        });
      }
    }

    return res.status(200).json({ message: "Room rejected successfully." });
  } catch (error: any) {
    console.error("Error rejecting room:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getRoomById = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        RoomUser: {
          orderBy: {
            joinedAt: "asc",
          },
          include: {
            User: {
              select: {
                id: true,
                email: true,
                name: true,
                profile_pic: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    return res.status(200).json({
      message: "Joined existing room",
      room,
      joined: true,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const joinRoomById = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const userId = (req as any).user?.userId;

    const activeRoomUser = await prisma.roomUser.findFirst({
      where: {
        userId,
        Room: {
          status: {
            not: "closed",
          },
        },
      },
      include: {
        Room: {
          include: {
            RoomUser: {
              include: {
                User: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                    profile_pic: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (activeRoomUser) {
      return res.status(200).json({
        room: activeRoomUser.Room,
        joined: false,
        message: "User is already in an active room.",
      });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        RoomUser: true,
      },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    if (room.status !== "open") {
      return res.status(501).json({ message: "Room not available" });
    }

    if (room) {
      const count = room.RoomUser.length;

      await prisma.roomUser.create({
        data: { userId, roomId: room.id },
      });

      const updatedCount = count + 1;
      if (updatedCount >= room.capacity) {
        await prisma.room.update({
          where: { id: room.id },
          data: { status: "full" },
        });
      }

      const updatedRoom = await prisma.room.findUnique({
        where: { id: room.id },
        include: {
          RoomUser: {
            include: {
              User: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  profile_pic: true,
                },
              },
            },
          },
        },
      });

      return {
        room: updatedRoom,
        joined: true,
        message: "Joined existing room",
      };
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getAllLocations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: userId,
        },
      },
      select: {
        id: true,
        name: true,
        isOnline: true,
        lastSeen: true,
        location: true,
        profile_pic: true,
      },
    });

    return res.status(200).json({
      message: "Fetched User Locations",
      usersWithLocations: users,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};
