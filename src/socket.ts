import { Server, Socket } from "socket.io";
import { prisma } from "./utils/prisma";
import { sendMessageNotification } from "./helper/sendMessageNotification";

export let io: Server;

export const userSocketMap = new Map<string, string>();

export const initSocket = (server: any): void => {
  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;

    if (!userId) {
      return socket.disconnect();
    }

    userSocketMap.set(userId, socket.id);
    socket.on("sendMessage", async (messageData) => {
      const { senderId, receiverId, content, messageId } = messageData;

      const receiverSocketId = userSocketMap.get(receiverId);
      const senderSocketId = userSocketMap.get(senderId);

      const newMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          content,
          id: messageId,
          read: receiverSocketId ? true : false
        }
      });

      if (
        (receiverSocketId && io.sockets.sockets.get(receiverSocketId)) ||
        (senderSocketId && io.sockets.sockets.get(senderSocketId))
      ) {
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        if (senderSocketId) {
          io.to(senderSocketId).emit("newMessage", newMessage);
        }
      } else {
        console.log("🔴 Receiver not connected, sending push notification...");
        const receiver = await prisma.user.findUnique({
          where: { id: receiverId }
        });
        if (receiver?.fcmToken) {
          await sendMessageNotification(receiver.fcmToken, {
            notification: {
              title: "New Message",
              body: content
            },
            data: {
              senderId,
              type: "message"
            },
            android: {
              priority: "high",
              notification: {
                channelId: "default",
                sound: "default",
                defaultSound: true
              }
            },
            apns: {
              payload: {
                aps: {
                  alert: {
                    title: "New Message",
                    body: content
                  },
                  sound: "default"
                }
              }
            }
          });
        }
      }
    });

    socket.on("markMessageAsRead", async ({ userId, senderId }) => {
      const senderSocketId = userSocketMap.get(senderId);
      const receverId = userSocketMap.get(userId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesRead", { by: userId });
      }
      if (receverId) {
        io.to(receverId).emit("messagesRead", { by: userId });
      }
    });

    socket.on("disconnect", async () => {
      console.log(`User ${userId} disconnected`);
      userSocketMap.delete(userId);
    });
  });
};
