import admin from "../config/firebase.config";

export const sendMessageNotification = async (token: string, payload: any) => {
  try {
    await admin.messaging().send({
      token,
      notification: {
        title: payload.title,
        body: payload.body
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
      },
      data: payload.data || {}
    });
  } catch (err) {
    console.error("Error sending FCM:", err);
  }
};
