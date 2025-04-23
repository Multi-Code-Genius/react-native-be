import express, { RequestHandler } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  uploadPost as useUploadPost,
  handleUploadPost
} from "../helper/upload";
import {
  commentsPost,
  getPost,
  getPostById,
  likePost,
  uploadPost
} from "../controllers/post.controller";

const postRouter = express.Router();

postRouter.post(
  "/upload-post",
  useUploadPost.single("post"),
  handleUploadPost,
  authMiddleware,
  uploadPost as RequestHandler
);

postRouter.get("/", authMiddleware, getPost);
postRouter.get("/like/:id", authMiddleware, likePost);
postRouter.post("/comments/:id", authMiddleware, commentsPost);
postRouter.get("/:id", authMiddleware, getPostById);

export default postRouter;

/**
 * @swagger
 * /api/post/upload-post:
 *   post:
 *     tags:
 *       - Post
 *     summary: Upload a new post with media
 *     description: Upload a new post with a media file (e.g., image or video), title, and description. Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - post
 *               - title
 *               - description
 *             properties:
 *               post:
 *                 type: string
 *                 format: binary
 *                 description: The media file to upload
 *               title:
 *                 type: string
 *                 description: Title of the post
 *               description:
 *                 type: string
 *                 description: Description of the post
 *     responses:
 *       200:
 *         description: Post uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post uploaded successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized – JWT missing or invalid
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/post:
 *   get:
 *     tags:
 *       - Post
 *     summary: Get all posts
 *     description: Retrieve all posts from the database. Requires JWT token in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   mediaUrl:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   user:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *       401:
 *         description: Unauthorized – JWT missing or invalid
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/post/like/{postId}:
 *   get:
 *     tags:
 *       - Post
 *     summary: Like or Unlike a Post
 *     description: Toggle like/unlike on a post by its ID. Requires JWT token in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the post to be liked or unliked.
 *     responses:
 *       200:
 *         description: Post liked/unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 liked:
 *                   type: boolean
 *       401:
 *         description: Unauthorized – JWT missing or invalid
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/post/comments/{postId}:
 *   post:
 *     tags:
 *       - Post
 *     summary: Add a comment to a post
 *     description: Adds a new comment to the post with the specified ID. Requires JWT token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the post to comment on.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: Hello this is first comment in First dog Post
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request – missing or invalid data
 *       401:
 *         description: Unauthorized – JWT required or invalid
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/post/{postId}:
 *   get:
 *     tags:
 *       - Post
 *     summary: Get single post by ID
 *     description: Retrieve detailed data for a specific post using its post ID. Requires authentication via Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The UUID of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: dd8865ae-0b81-4ee5-84c1-d952dd2f55e0
 *                 title:
 *                   type: string
 *                   example: My first post
 *                 description:
 *                   type: string
 *                   example: This is a description of my post
 *                 post:
 *                   type: string
 *                   format: binary
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *                 likes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Like'
 *       401:
 *         description: Unauthorized – Invalid or missing Bearer token
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
