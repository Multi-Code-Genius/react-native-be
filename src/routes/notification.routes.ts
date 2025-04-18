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

/**
 * @swagger
 * /api/notification/send:
 *   post:
 *     summary: Send a push notification
 *     description: Sends a push notification to a specific device using its FCM token.
 *     tags:
 *       - Notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - device token
 *               - priority
 *               - notification
 *             properties:
 *               device token:
 *                 type: string
 *                 description: FCM device token to send the notification to.
 *                 example: dSsiA91bF8qWEspcWOsUCUjpCUybxXX2Asy21S77-ainU6UYimuJVSXbsjjZ5NpyB03synBYdwmNMERz0XOvr8C8T4VKS--zjXYkspUZHgMjw
 *               priority:
 *                 type: string
 *                 enum: [high, normal]
 *                 description: Notification priority.
 *                 example: high
 *               notification:
 *                 type: object
 *                 required:
 *                   - title
 *                   - body
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: 🎉 New Message
 *                   body:
 *                     type: string
 *                     example: You have a new notification!
 *                   sound:
 *                     type: string
 *                     example: default
 *               data:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *                 example:
 *                   customKey: any-value-you-need
 *     responses:
 *       200:
 *         description: Notification sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Notification sent
 *       400:
 *         description: Invalid request data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Token is required
 *       500:
 *         description: Internal server error while sending notification.
 */
