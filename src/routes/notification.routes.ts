import { Router } from "express";
import {
  saveFCMToken,
  sendPushNotification
} from "../controllers/notification.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/send", sendPushNotification);
router.post("/save-token", authMiddleware, saveFCMToken);

export default router;
