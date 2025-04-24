import express, { RequestHandler } from "express";
import {
  UpdateUser,
  deleteUser,
  getAllUser,
  getProfile,
  getUserByid,
  pingOnline,
  searchUser,
  uploadProfilePicture
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { handleUploadProfile, uploadProfile } from "../helper/upload";

const router = express.Router();

router.patch("/update", authMiddleware, UpdateUser as RequestHandler);
router.delete("/delete", authMiddleware, deleteUser as RequestHandler);
router.get("/", authMiddleware, getProfile as RequestHandler);
router.post(
  "/upload-profile/:userId",
  uploadProfile.single("profile_pic"),
  handleUploadProfile,
  uploadProfilePicture as RequestHandler
);
router.get("/all-user", authMiddleware, getAllUser as RequestHandler);
router.get("/search", authMiddleware, searchUser as RequestHandler);
router.get("/user-data/:id", authMiddleware, getUserByid as RequestHandler);
router.get("/ping", authMiddleware, pingOnline as RequestHandler);

// GET PROFILE /Get User route
/**
 * @swagger
 * /api/user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user details
 *     description: Fetch the authenticated user's details using the provided JWT token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 mobileNumber:
 *                   type: string
 *                 location:
 *                   type: string
 *                 status:
 *                   type: string
 *                 dob:
 *                   type: string
 *                   format: date
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       500:
 *         description: Internal server error
 */

// Update User /UPDATE User route
/**
 * @swagger
 * /api/user/update:
 *   patch:
 *     summary: Update user profile
 *     description: Updates user's profile data such as name, email, dob, mobile number, location, and status.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jayrajshakha@gmail.com
 *               name:
 *                 type: string
 *                 example: Jay
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 2001-11-20
 *               mobileNumber:
 *                 type: string
 *                 example: "9876543210"
 *               location:
 *                 type: string
 *                 example: Surat
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *                 example: active
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

// GET upload profile
/**
 * @swagger
 * /api/user/upload-profile/{id}:
 *   post:
 *     tags:
 *       - User
 *     summary: Upload a user profile picture
 *     description: Uploads a profile picture for the specified user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile_pic:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file (PNG, JPG)
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 filePath:
 *                   type: string
 *       400:
 *         description: Bad request (Invalid file format or missing file)
 *       401:
 *         description: Unauthorized (Invalid or missing token)
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
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
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

/**
 * @swagger
 * /api/user/all-user:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []  # If you're using JWT auth
 *     responses:
 *       200:
 *         description: User data fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User data fetched successfully.
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @swagger
 * /api/user/user-data/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by ID
 *     description: Fetch user details by ID using the provided JWT token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID (UUID)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: f645da0c-caac-4d96-8036-7cc95b0633ef
 *                 name:
 *                   type: string
 *                   example: JAY R
 *                 email:
 *                   type: string
 *                   example: jay@example.com
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/search:
 *   get:
 *     summary: Search users by name
 *     description: Search for users whose names contain the provided query string.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: The name (or partial name) to search for
 *     responses:
 *       200:
 *         description: List of matched users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Search Items
 *                 Users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: 22108fc2-c796-4893-ab4c-ccc1e446316c
 *                       name:
 *                         type: string
 *                         example: Jay R
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: jay@gmail.com
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-04-01T12:34:56Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-04-10T09:21:00Z
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/user/ping:
 *   get:
 *     summary: Ping user session
 *     description: Used to check if the user token is valid and the user is authenticated.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: _
 *         required: false
 *         schema:
 *           type: integer
 *         description: Optional timestamp to prevent request caching.
 *         example: 1744972129990
 *     responses:
 *       200:
 *         description: Successfully authenticated and user is active.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: User is active
 *                 userId: 3cf5033f-b1bb-4816-aca0-fe4a59a4d445
 *       401:
 *         description: Unauthorized - Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

export default router;
