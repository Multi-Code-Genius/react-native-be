import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const requestUser = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.body;
  try {
    const request = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId
      }
    });
    res.json(request);
  } catch (err: any) {
    res.status(400).json({
      error: err.message || "Friend request already exists or failed."
    });
  }
};

export const requestAccept = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await prisma.friendRequest.update({
    where: { id },
    data: { status: "accepted" }
  });
  res.json(updated);
};

export const requestDecline = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await prisma.friendRequest.update({
    where: { id },
    data: { status: "declined" }
  });
  res.json(updated);
};
