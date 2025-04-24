import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import admin from "../config/firebase.config";

export const requestUser = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ error: "Sender and Receiver ID required." });
  }

  if (senderId === receiverId) {
    return res
      .status(400)
      .json({ error: "You cannot send a request to yourself." });
  }

  try {
    const existingRequest = await prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId
        }
      }
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Friend request already sent." });
    }

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
          body: `${sender?.name} sent you a friend request!`
        },
        data: {
          title: "New Friend Request",
          body: `${sender?.name} sent you a friend request!`
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

    return res.status(201).json(request);
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || "Failed to send friend request."
    });
  }
};

export const requestAccept = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existingRequest = await prisma.friendRequest.findUnique({
      where: { id }
    });

    if (!existingRequest) {
      return res.status(404).json({ error: "Friend request not found." });
    }

    const updated = await prisma.friendRequest.update({
      where: { id },
      data: { status: "accepted" }
    });

    await prisma.friend.createMany({
      data: [
        {
          userId: existingRequest.senderId,
          friendId: existingRequest.receiverId
        },
        {
          userId: existingRequest.receiverId,
          friendId: existingRequest.senderId
        }
      ]
    });
    const receiver = await prisma.user.findUnique({
      where: { id: existingRequest.receiverId },
      select: { fcmToken: true, name: true }
    });

    const sender = await prisma.user.findUnique({
      where: { id: existingRequest.senderId },
      select: { fcmToken: true, name: true }
    });

    if (sender?.fcmToken) {
      const message = {
        token: sender?.fcmToken,
        notification: {
          title: "Friend Request Accepted",
          body: `${receiver?.name} Accepted your friend request!`
        },
        data: {
          title: "Friend Request Accepted",
          body: `${receiver?.name} Accepted your friend request!`
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

    return res.status(200).json({
      message: "Friend request accepted successfully.",
      updated
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || "Failed to accept friend request."
    });
  }
};

export const requestDecline = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingRequest = await prisma.friendRequest.findUnique({
      where: { id }
    });

    if (!existingRequest) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    const { senderId, receiverId } = existingRequest;

    await prisma.friend.deleteMany({
      where: {
        OR: [
          { userId: senderId, friendId: receiverId },
          { userId: receiverId, friendId: senderId }
        ]
      }
    });

    await prisma.friendRequest.delete({
      where: { id }
    });

    const sender = await prisma.user.findUnique({
      where: { id: existingRequest.senderId },
      select: { fcmToken: true, name: true }
    });

    const receiver = await prisma.user.findUnique({
      where: { id: existingRequest.receiverId },
      select: { fcmToken: true, name: true }
    });

    if (sender?.fcmToken) {
      const message = {
        token: sender?.fcmToken,
        notification: {
          title: "Declined Your Friend Request",
          body: `${receiver?.name} Declined your friend request!`
        },
        data: {
          title: "Declined Your Friend Request",
          body: `${receiver?.name} Declined your friend request!`
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

    res.status(200).json({ message: "Friend request declined successfully." });
  } catch (err: any) {
    res.status(400).json({
      error: err.message || "Failed to decline friend request."
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

export const getPendingRequests = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = req.user.userId;

    const pendingRequests = await prisma.friendRequest.findMany({
      where: {
        receiverId: id,
        status: "pending"
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profile_pic: true,
            isOnline: true,
            lastSeen: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json({
      message: "Pending friend requests fetched successfully.",
      pendingRequests
    });
  } catch (error: unknown) {
    console.error("Pending request error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error"
    });
  }
};
