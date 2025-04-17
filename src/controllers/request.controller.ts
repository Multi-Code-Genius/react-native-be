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
  try {
    const { id } = req.params;
    const updated = await prisma.friendRequest.update({
      where: { id },
      data: { status: "accepted" }
    });
    res.status(200).json({ message: "Request Accepted", updated });
  } catch (err: any) {
    res.status(400).json({
      error: err.message || "Friend request already exists or failed."
    });
  }
};

export const requestDecline = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await prisma.friendRequest.update({
      where: { id },
      data: { status: "declined" }
    });
    res.status(200).json({ message: "Request declined", updated });
  } catch (err: any) {
    res.status(400).json({
      error: err.message || "Friend request already exists or failed."
    });
  }
};

export const getFriendRequests = async (req: Request, res: Response) => {
  try {
    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        receiverId: req.user?.userId
      }
    });

    return res.status(200).json({
      message: " Friend requests retrieved successfully",
      friendRequests
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message || "Friend request already exists or failed."
    });
  }
};

export const getSendRequests = async (req: Request, res: Response) => {
  try {
    const sendRequests = await prisma.friendRequest.findMany({
      where: {
        senderId: req.user?.userId
      }
    });

    return res.status(200).json({
      message: "Send requests retrieved successfully",
      sendRequests
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message || "Friend request already exists or failed."
    });
  }
};
