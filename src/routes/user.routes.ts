import express, { RequestHandler } from "express";
import {
  UpdateUser,
  deleteUser,
  getProfile,
  uploadProfilePicture
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import upload from "../helper/upload";

const router = express.Router();

// PUT /Update User route
/**
 * @swagger
 * /api/auth/user:
 *   patch:
 *     summary: Update the authenticated user's information
 *     tags:
 *       - Update User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: mySecret123
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request (e.g., email already in use)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

// DELETE /Delete User route
/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully.
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.patch("/update", authMiddleware, UpdateUser as RequestHandler);
router.delete("/delete", authMiddleware, deleteUser as RequestHandler);
router.get("/", authMiddleware, getProfile as RequestHandler);
router.post(
  "/upload-profile/:userId",
  upload.single("profile_pic"),
  uploadProfilePicture as RequestHandler
);

export default router;
