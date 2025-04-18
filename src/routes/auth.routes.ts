import express, { RequestHandler } from "express";
import {
  register,
  login,
  requestPasswordReset,
  resetPassword
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", register as unknown as RequestHandler);
router.post("/login", login as unknown as RequestHandler);
router.post(
  "/reset-password",
  requestPasswordReset as unknown as RequestHandler
);
router.post("/new-password", resetPassword as unknown as RequestHandler);

export default router;

// POST /register route
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - AUTH
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
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully registered
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

// POST /login route
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - AUTH
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Request a password reset email
 *     description: Sends a password reset link to the user's email address.
 *     tags:
 *        - AUTH
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jayrajshakha01@gmail.com
 *     responses:
 *       200:
 *         description: Email sent successfully or reset instructions provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset link sent to your email.
 *       400:
 *         description: Bad request (missing or invalid email).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid email address.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/auth/new-password:
 *   post:
 *     summary: Set a new password using the reset token
 *     description: Allows the user to set a new password using a valid reset token received via email.
 *     tags:
 *       - AUTH
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Reset token sent to the user's email.
 *                 example: 7ca481531cacd050adcdf5c0024ad2225be388692c2da60005fb1cca7938ff42
 *               newPassword:
 *                 type: string
 *                 description: The new password the user wants to set.
 *                 example: "5555"
 *     responses:
 *       200:
 *         description: Password reset successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password has been updated successfully.
 *       400:
 *         description: Invalid or expired token / missing data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Token is invalid or has expired.
 *       500:
 *         description: Internal server error.
 */
