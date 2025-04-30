import express, { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createBooking,
  getBookigById,
  updateBooking,
} from "../controllers/booking.controller";

const bookingRoutes: Router = express.Router();

bookingRoutes.post("/create", authMiddleware, createBooking);

bookingRoutes.put("/status/:id", authMiddleware, updateBooking);

bookingRoutes.post("/user/:userId", authMiddleware, getBookigById);
export default bookingRoutes;

/**
 * @swagger
 * /api/booking/create:
 *   post:
 *     summary: Create a new booking
 *     description: Allows a user to create a new game booking.
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startTime
 *               - endTime
 *               - nets
 *               - gameId
 *               - totalAmount
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-30T10:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-30T12:00:00Z"
 *               nets:
 *                 type: integer
 *                 example: 2
 *               gameId:
 *                 type: string
 *                 format: uuid
 *                 example: "3c3a9170-2b13-443f-a3e3-67d141909b49"
 *               totalAmount:
 *                 type: number
 *                 example: 2500
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-30"
 *     responses:
 *       200:
 *         description: Booking successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booking Created
 *                 booking:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
