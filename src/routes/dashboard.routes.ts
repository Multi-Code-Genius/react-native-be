import express, { RequestHandler } from "express";
import { getDashboardData } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const dashboardRouter = express.Router();

dashboardRouter.get(
  "/game/:gameId",
  authMiddleware,
  getDashboardData as unknown as RequestHandler
);

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
