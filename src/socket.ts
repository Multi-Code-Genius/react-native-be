import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { prisma } from "./utils/prisma";
import { SECRET_KEY } from "./config/env";

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", async (socket) => {
    const token = socket.handshake.auth?.token;

    if (!token) return socket.disconnect();

    try {
      const decoded: any = jwt.verify(token, SECRET_KEY!);
      const user = decoded;

      const id = user.userId;

      await prisma.user.update({
        where: { id: id },
        data: { isOnline: true, lastSeen: null }
      });

      socket.on("disconnect", async () => {
        await prisma.user.update({
          where: { id: id },
          data: { isOnline: false, lastSeen: new Date() }
        });
      });
    } catch (err) {
      console.error("Invalid token", err);
      socket.disconnect();
    }
  });
}
