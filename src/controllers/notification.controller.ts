import { Request, Response } from "express";
import admin from "../config/firebase.config";
import { prisma } from "../utils/prisma";

export const sendPushNotification = async (req: Request, res: Response) => {
  const { token, title, body } = req.body;

  const message = {
    token,
    notification: {
      title,
      body
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

  try {
    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, response });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const saveFCMToken = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const id = req.user.userId;
  const { token } = req.body;

  try {
    await prisma.user.update({
      where: { id: id },
      data: { fcmToken: token }
    });

    res.status(200).json({ success: true, message: "FCM token saved" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
