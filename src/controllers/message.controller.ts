import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const createMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
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
    return res.status(500).json({ error: error.message });
  }
};

export const missedMessage = async (req: Request, res: Response) => {
  const { userId, withUserId } = req.params;
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: withUserId },
        { senderId: withUserId, receiverId: userId }
      ]
    },
    orderBy: { createdAt: "asc" }
  });
  res.status(200).json(messages);
};
