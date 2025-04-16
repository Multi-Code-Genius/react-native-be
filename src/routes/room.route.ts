import express, { RequestHandler } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { deleteRoom, findOrCreateRoom } from "../controllers/room.controller";

const route = express.Router();

route.post(
  "/find-or-create",
  authMiddleware,
  findOrCreateRoom as unknown as RequestHandler
);
route.delete("/delete/:roomId", authMiddleware, deleteRoom as RequestHandler);

export default route;

/**
 * @swagger
 * /api/room/find-or-create:
 *   post:
 *     summary: Find or create a room based on user location and platform
 *     tags:
 *       - Room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitude
 *               - longitude
 *               - platform
 *             properties:
 *               latitude:
 *                 type: number
 *                 example: 19.0760
 *                 description: The latitude of the user's location.
 *               longitude:
 *                 type: number
 *                 example: 72.8777
 *                 description: The longitude of the user's location.
 *               platform:
 *                 type: string
 *                 example: "platform Name"
 *                 description: The name of the platform or device.
 *     responses:
 *       200:
 *         description: Room found or created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 roomId: "12345"
 *                 status: "created"
 *       400:
 *         description: Bad request – missing or invalid parameters
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/room/delete/{roomId}:
 *   delete:
 *     summary: Delete a specific room by ID
 *     tags:
 *       - Room
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the room to delete.
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: Room deleted successfully
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */
