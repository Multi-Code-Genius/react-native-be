import { RequestHandler, Router, Request, Response } from "express";
import {
  createMessage,
  markMessagesAsRead,
  missedMessage
} from "../controllers/message.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { uploadMessageImage } from "../helper/upload";
import { prisma } from "../utils/prisma";
import { userSocketMap, io } from "../socket";

const router: Router = Router();

router.post("/", authMiddleware, createMessage as unknown as RequestHandler);
router.get(
  "/messages/:userId/:withUserId",
  authMiddleware,
  missedMessage as unknown as RequestHandler
);

router.put(
  "/mark-as-read/:userId/:withUserId",
  authMiddleware,
  markMessagesAsRead as unknown as RequestHandler
);

router.post(
  "/upload-message-image/:senderId/:receiverId",
  uploadMessageImage.single("image"),
  (async (req: Request, res: Response) => {
    try {
      const { senderId, receiverId } = req.params;
      const file = req.file;

      if (!file || !file.path) {
        return res.status(400).json({ error: "Image upload failed" });
      }

      const newMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          imageUrl: file.path
        }
      });

      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId && io.sockets.sockets.get(receiverSocketId)) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      res.status(200).json(newMessage);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to upload image" });
    }
  }) as RequestHandler
);

export default router;
