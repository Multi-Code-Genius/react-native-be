import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import admin from "../config/firebase.config";

export const requestUser = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.body;

  try {
    const request = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId
      }
    });

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { fcmToken: true }
    });
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { name: true }
    });

    if (receiver?.fcmToken) {
      const message = {
        token: receiver.fcmToken,
        notification: {
          title: "New Friend Request",
          body: `You’ve received a ${sender?.name} friend request!`
        },
        android: {
          priority: "high" as const,
          notification: {
            channelId: "default",
            sound: "default",
            defaultSound: true
          }
        },
        apns: {
          payload: {
            aps: {
              sound: "default"
            }
          }
        }
      };

      await admin.messaging().send(message);
    }

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

    // const receiver = await prisma.user.findUnique({
    //   where: { id: id },
    //   select: { fcmToken: true, name: true }
    // });

    // if (receiver?.fcmToken) {
    //   const message = {
    //     token: receiver.fcmToken,
    //     notification: {
    //       title: "New Friend Request",
    //       body: `You’ve received a ${receiver.name} new friend request!`
    //     },
    //     android: {
    //       priority: "high" as const,
    //       notification: {
    //         channelId: "default",
    //         sound: "default",
    //         defaultSound: true
    //       }
    //     },
    //     apns: {
    //       payload: {
    //         aps: {
    //           sound: "default"
    //         }
    //       }
    //     }
    //   };

    //   await admin.messaging().send(message);
    // }

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
    const updated = await prisma.friendRequest.delete({
      where: { id }
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
