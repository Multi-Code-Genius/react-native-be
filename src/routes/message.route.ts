import { RequestHandler, Router } from "express";
import {
  createMessage,
  missedMessage
} from "../controllers/message.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router: Router = Router();

router.post("/", authMiddleware, createMessage as unknown as RequestHandler);
router.get(
  "/messages/:userId/:withUserId",
  authMiddleware,
  missedMessage as unknown as RequestHandler
);

export default router;
