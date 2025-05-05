import express, { RequestHandler, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createBooking,
  getBookigById,
  getBookingByGameId,
  updateBooking,
} from "../controllers/booking.controller";

const bookingRoutes: Router = express.Router();

bookingRoutes.post(
  "/create",
  authMiddleware,
  createBooking as unknown as RequestHandler
);

bookingRoutes.put(
  "/status/:id",
  authMiddleware,
  updateBooking as unknown as RequestHandler
);

bookingRoutes.post(
  "/user/:userId",
  authMiddleware,
  getBookigById as unknown as RequestHandler
);

bookingRoutes.get(
  "/game/:id/:date",
  authMiddleware,
  getBookingByGameId as unknown as RequestHandler
);

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

/**
 * @swagger
 * /api/booking/game/{id}/{date}:
 *   get:
 *     summary: Get bookings for a specific game on a specific date
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The game ID (UUID)
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: date
 *         required: true
 *         description: The booking date in DD-MM-YYYY format
 *         schema:
 *           type: string
 *           example: "02-05-2025"
 *     responses:
 *       200:
 *         description: Successful response with bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fetch Booking Data
 *                 booking:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid date format
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
