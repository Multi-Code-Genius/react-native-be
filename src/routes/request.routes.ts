import express, { RequestHandler } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  getFriendRequests,
  requestAccept,
  requestDecline,
  requestUser
} from "../controllers/request.controller";

const router = express.Router();

router.post("/friend-request", authMiddleware, requestUser as RequestHandler);
router.post(
  "/friend-request/:id/accept",
  authMiddleware,
  requestAccept as RequestHandler
);
router.post(
  "/friend-request/:id/decline",
  authMiddleware,
  requestDecline as RequestHandler
);
router.get(
  "/friend-request/my-request",
  authMiddleware,
  getFriendRequests as RequestHandler
);

router.get(
  "/friend-request/sent-request",
  authMiddleware,
  getFriendRequests as RequestHandler
);

export default router;

/**
 * @swagger
 * /api/request/friend-request:
 *   post:
 *     summary: Send a friend request
 *     description: Sends a friend request from one user to another.
 *     tags:
 *       - Friend Request
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderId
 *               - receiverId
 *             properties:
 *               senderId:
 *                 type: string
 *                 format: uuid
 *                 description: UUID of the user sending the friend request.
 *                 example: 3cf5033f-b1bb-4816-aca0-fe4a59a4d445
 *               receiverId:
 *                 type: string
 *                 format: uuid
 *                 description: UUID of the user receiving the friend request.
 *                 example: e3bd6dc0-1dff-42d0-af0b-a231addad991
 *     responses:
 *       200:
 *         description: Friend request sent successfully.
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
 *                   example: Friend request sent successfully.
 *       400:
 *         description: Missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: senderId and receiverId are required.
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/request/friend-request/{requestId}/decline:
 *   post:
 *     summary: Decline a friend request
 *     description: Allows the receiver of a friend request to decline it.
 *     tags:
 *       - Friend Request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the friend request to decline.
 *         example: df5877ed-8a26-436c-b014-ffb4e17dae5d
 *     responses:
 *       200:
 *         description: Friend request declined successfully.
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
 *                   example: Friend request declined.
 *       400:
 *         description: Invalid request ID.
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *       404:
 *         description: Friend request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/request/friend-request/{requestId}/accept:
 *   post:
 *     summary: Accept a friend request
 *     description: Allows the receiver of a friend request to accept it.
 *     tags:
 *       - Friend Request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the friend request to accept.
 *         example: c2bca851-daf1-4e2f-a2e8-e282d91b2651
 *     responses:
 *       200:
 *         description: Friend request accepted successfully.
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
 *                   example: Friend request accepted.
 *       400:
 *         description: Invalid request ID.
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *       404:
 *         description: Friend request not found.
 *       500:
 *         description: Internal server error.
 */
