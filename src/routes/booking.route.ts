import express, { RequestHandler, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  cancelBooking,
  createBooking,
  getBookigById,
  getBookingByGameId,
  getBookingByWeek,
  updateBooking,
  updateBookingStatus,
} from "../controllers/booking.controller";

const bookingRoutes: Router = express.Router();

bookingRoutes.post(
  "/create",
  authMiddleware,
  createBooking as unknown as RequestHandler
);

bookingRoutes.patch(
  "/status/:id",
  authMiddleware,
  updateBookingStatus as unknown as RequestHandler
);

bookingRoutes.get(
  "/one-booking/:bookingId",
  authMiddleware,
  getBookigById as unknown as RequestHandler
);

bookingRoutes.get(
  "/game/:id/:date",
  authMiddleware,
  getBookingByGameId as unknown as RequestHandler
);

bookingRoutes.delete(
  "/cancel/:bookingId",
  authMiddleware,
  cancelBooking as unknown as RequestHandler
);

bookingRoutes.patch(
  "/update/:id",
  authMiddleware,
  updateBooking as unknown as RequestHandler
);

bookingRoutes.get(
  "/week/:gameId/:start/:end",
  authMiddleware,
  getBookingByWeek as unknown as RequestHandler
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

/**
 * @swagger
 * /api/booking/cancel/{id}:
 *   delete:
 *     summary: Cancel a booking by ID
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the booking to cancel
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booking cancelled successfully
 *       401:
 *         description: Unauthorized – JWT is missing or invalid
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/booking/update/{id}:
 *   patch:
 *     summary: Update an existing booking
 *     description: Updates only the provided fields of a booking by ID.
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The booking ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 example: "08:30 AM"
 *               endTime:
 *                 type: string
 *                 example: "09:30 AM"
 *               nets:
 *                 type: number
 *                 example: 2
 *               totalAmount:
 *                 type: number
 *                 example: 2500
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-19"
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 booking:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Failed to update booking
 */
/**
 * @swagger
 * /api/booking/status/{id}:
 *   patch:
 *     summary: Update booking status
 *     description: Updates the status of an existing booking by its ID.
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, CANCELLED]
 *                 example: CONFIRMED
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 booking:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Failed to update booking status
 */
