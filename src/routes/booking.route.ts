import express, { RequestHandler, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  allUserBooking,
  cancelBooking,
  createBooking,
  customer,
  getBookigById,
  getBookingByGameId,
  getBookingByWeek,
  suggestExistingCustomer,
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

bookingRoutes.get(
  "/user-booking",
  authMiddleware,
  allUserBooking as unknown as RequestHandler
);

bookingRoutes.get(
  "/customer/:customerId",
  authMiddleware,
  customer as unknown as RequestHandler
);

bookingRoutes.get(
  "/suggest-customer/:number",
  authMiddleware,
  suggestExistingCustomer as unknown as RequestHandler
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

/**
 * @swagger
 * /api/booking/user-booking:
 *   get:
 *     summary: Get bookings of the current user
 *     description: Returns a list of bookings created by the authenticated user.
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     mobileNumber:
 *                       type: string
 *                     bookings:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           gameId:
 *                             type: string
 *                           date:
 *                             type: string
 *                             format: date-time
 *                           startTime:
 *                             type: string
 *                             format: date-time
 *                           endTime:
 *                             type: string
 *                             format: date-time
 *                           status:
 *                             type: string
 *                           nets:
 *                             type: number
 *                           totalAmount:
 *                             type: number
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/booking/customer/{customerId}:
 *   get:
 *     summary: Get bookings for a specific customer
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the customer
 *     responses:
 *       200:
 *         description: Successfully retrieved bookings for the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       startTime:
 *                         type: string
 *                         format: date-time
 *                       endTime:
 *                         type: string
 *                         format: date-time
 *                       date:
 *                         type: string
 *                         format: date
 *                       totalAmount:
 *                         type: number
 *                       status:
 *                         type: string
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/booking/suggest-customer/{number}:
 *   get:
 *     summary: Suggest existing customers by partial or full mobile number
 *     description: Returns a list of users who are already customers, matched by the given mobile number (partial or full).
 *     tags:
 *       - Booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: number
 *         schema:
 *           type: string
 *         required: true
 *         description: Partial or full mobile number to search for existing customers
 *     responses:
 *       200:
 *         description: Matching customers found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Suggestions found
 *                 customers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: c1
 *                       userId:
 *                         type: string
 *                         example: u1
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: u1
 *                           name:
 *                             type: string
 *                             example: Jay
 *                           mobileNumber:
 *                             type: string
 *                             example: 9876543210
 *                           profile_pic:
 *                             type: string
 *                             example: https://example.com/image.jpg
 *       404:
 *         description: No matching customers found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No matching customers found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to suggest customers
 */
