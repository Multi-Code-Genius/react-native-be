import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const createMessage = async (req: Request, res: Response) => {
  const { senderId, receiverId, content } = req.body;

  try {
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content
      }
    });
    return res.status(200).json(newMessage);
  } catch (error: any) {
    console.error("Create message error:", error);
    res.status(500).json({ error: error.message || "Message failed" });
  }
};

export const missedMessage = async (req: Request, res: Response) => {
  try {
    const { userId, withUserId } = req.params;
    const { cursor, limit = 10 } = req.query;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: withUserId },
          { senderId: withUserId, receiverId: userId }
        ]
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            profile_pic: true
          }
        },
        sender: {
          select: {
            id: true,
            name: true,
            profile_pic: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: Number(limit),
      ...(cursor && {
        skip: 1,
        cursor: { id: String(cursor) }
      })
    });

    res.status(200).json(messages.reverse());
  } catch (error: any) {
    console.error("Message error:", error);
    res.status(500).json({ error: error.message || "Message failed" });
  }
};
