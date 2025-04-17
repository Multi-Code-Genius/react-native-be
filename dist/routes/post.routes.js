"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authMiddleware_1 = require("../middlewares/authMiddleware");
var upload_1 = require("../helper/upload");
var post_controller_1 = require("../controllers/post.controller");
var postRouter = express_1.default.Router();
postRouter.post("/upload-post", upload_1.uploadPost.single("post"), authMiddleware_1.authMiddleware, post_controller_1.uploadPost);
postRouter.get("/", authMiddleware_1.authMiddleware, post_controller_1.getPost);
postRouter.get("/like/:id", authMiddleware_1.authMiddleware, post_controller_1.likePost);
postRouter.post("/comments/:id", authMiddleware_1.authMiddleware, post_controller_1.commentsPost);
postRouter.get("/:id", authMiddleware_1.authMiddleware, post_controller_1.getPostById);
exports.default = postRouter;
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
