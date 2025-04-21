import { Server, Socket } from "socket.io";
import { prisma } from "./utils/prisma";
import { sendMessageNotification } from "./helper/sendMessageNotification";

let io: Server;

const userSocketMap = new Map<string, string>();

export const initSocket = (server: any): void => {
  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;
    if (!userId) {
      console.log("Connection rejected: No userId");
      return socket.disconnect();
    }

    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} connected via socket ${socket.id}`);

    socket.on("sendMessage", async (messageData) => {
      const { senderId, receiverId, content } = messageData;

      const newMessage = await prisma.message.create({
        data: { senderId, receiverId, content }
      });

      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId && io.sockets.sockets.get(receiverSocketId)) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      } else {
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

    socket.on("disconnect", async () => {
      console.log(`User ${userId} disconnected`);
      userSocketMap.delete(userId);
    });
  });
};
