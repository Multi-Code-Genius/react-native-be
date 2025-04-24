import express, { RequestHandler } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  deleteRoom,
  findOrCreateRoom,
  getAllRooms,
  rejectRoom
} from "../controllers/room.controller";

const route = express.Router();

route.post(
  "/find-or-create",
  authMiddleware,
  findOrCreateRoom as unknown as RequestHandler
);
route.delete("/delete/:roomId", authMiddleware, deleteRoom as RequestHandler);
route.get("/", authMiddleware, getAllRooms as RequestHandler);
route.get(
  "/reject/:roomId",
  authMiddleware,
  rejectRoom as unknown as RequestHandler
);

export default route;

/**
 * @swagger
 * /api/room/find-or-create:
 *   post:
 *     summary: Find or create a room based on user location and platform
 *     tags:
 *       - Room
 *     security:
 *       - bearerAuth: []
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
 *                 example: "Android"
 *                 description: The platform or device name.
 *     responses:
 *       200:
 *         description: Room found or created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 room:
 *                   type: object
 *                   description: The room object that was found or created.
 *                 joined:
 *                   type: boolean
 *                   description: True if joined existing room.
 *                 created:
 *                   type: boolean
 *                   description: True if a new room was created.
 *                 message:
 *                   type: string
 *                   example: "Joined existing room"
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Server error.
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

/**
 * @swagger
 * /api/room:
 *   get:
 *     summary: Get room information for the authenticated user
 *     tags:
 *       - Room
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved room details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 room:
 *                   type: object
 *                   description: Room information the user is part of
 *                 message:
 *                   type: string
 *                   example: "Room details retrieved successfully"
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       404:
 *         description: No active room found for the user
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/room/reject/{roomId}:
 *   get:
 *     summary: Reject a room for the authenticated user
 *     tags:
 *       - Room
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the room to reject
 *     responses:
 *       200:
 *         description: Room rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Room rejected successfully"
 *       400:
 *         description: Bad request – invalid or missing room ID
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       404:
 *         description: Room not found or already rejected
 *       500:
 *         description: Server error
 */
