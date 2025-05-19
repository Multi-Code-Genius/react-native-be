import express, { RequestHandler } from "express";
import {
  exportReport,
  getDashboardData,
} from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const dashboardRouter = express.Router();

dashboardRouter.get(
  "/game/:gameId",
  authMiddleware,
  getDashboardData as unknown as RequestHandler
);

dashboardRouter.get(
  "/export-report/:gameId",
  // authMiddleware,
  exportReport as unknown as RequestHandler
);

/**
 * @swagger
 * /api/dashboard/export-report/{gameId}:
 *   get:
 *     summary: Export monthly booking report as PDF
 *     description: Generates and returns a PDF report of bookings for a specific game ID.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the game for which the report is generated
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: string
 *           example: "2025-05"
 *         description: Month (YYYY-MM format) to filter bookings. Defaults to current month if not provided.
 *     responses:
 *       200:
 *         description: PDF file returned as a stream
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized – Invalid or missing token
 *       404:
 *         description: Game not found or no bookings
 *       500:
 *         description: Internal server error
 */

export default dashboardRouter;

/**
 * @swagger
 * /api/dashboard/game/{gameId}:
 *   get:
 *     summary: Get dashboard statistics for a specific game
 *     description: Returns today's, weekly, and monthly booking totals, status-wise counts (for upcoming bookings), and weekly day-wise booking counts.
 *     tags:
 *       - Dashboard
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the game
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dashboard data fetched successfully
 *                 todaysBookingsCount:
 *                   type: integer
 *                   example: 5
 *                 todaysBookingsAmount:
 *                   type: number
 *                   example: 2500
 *                 thisWeekBookingsTotalAmount:
 *                   type: number
 *                   example: 10200
 *                 thisMonthBookingsTotalAmount:
 *                   type: number
 *                   example: 42000
 *                 statusCounts:
 *                   type: object
 *                   properties:
 *                     PENDING:
 *                       type: integer
 *                       example: 2
 *                     CONFIRMED:
 *                       type: integer
 *                       example: 6
 *                     CANCELLED:
 *                       type: integer
 *                       example: 1
 *                 weeklyBookingsCountByDay:
 *                   type: object
 *                   properties:
 *                     Sunday:
 *                       type: integer
 *                       example: 3
 *                     Monday:
 *                       type: integer
 *                       example: 1
 *                     Tuesday:
 *                       type: integer
 *                       example: 4
 *                     Wednesday:
 *                       type: integer
 *                       example: 2
 *                     Thursday:
 *                       type: integer
 *                       example: 0
 *                     Friday:
 *                       type: integer
 *                       example: 5
 *                     Saturday:
 *                       type: integer
 *                       example: 6
 *       500:
 *         description: Failed to fetch dashboard data
 */
