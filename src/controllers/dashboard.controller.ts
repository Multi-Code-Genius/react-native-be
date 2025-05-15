import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import moment from "moment";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const userId = req.user?.userId;

    const today = moment().startOf("day").toDate();
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();
    const startOfWeek = moment().startOf("week").toDate();
    const endOfWeek = moment().endOf("week").toDate();

    let allBookings = [];

    if (gameId === "all") {
      const userCreatedGames = await prisma.game.findMany({
        where: { createdById: userId },
        select: { id: true },
      });

      const gameIds = userCreatedGames.map((g) => g.id);

      allBookings = await prisma.booking.findMany({
        where: {
          gameId: { in: gameIds },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              mobileNumber: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      allBookings = await prisma.booking.findMany({
        where: { gameId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              mobileNumber: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    const newUsersThisMonth = allBookings.filter((booking) => {
      const userCreatedAt = booking.user?.createdAt;
      return (
        userCreatedAt &&
        userCreatedAt >= startOfMonth &&
        userCreatedAt <= endOfMonth
      );
    });

    const newUserIds = new Set(newUsersThisMonth.map((b) => b.user?.id));
    const newUsersCount = newUserIds.size;

    const bookingsThisMonth = allBookings.filter(
      (b) => b.createdAt >= startOfMonth && b.createdAt <= endOfMonth
    );
    const thisMonthBookingsCount = bookingsThisMonth.length;

    const todaysBookings = allBookings.filter((b) =>
      moment(b.date).isSame(today, "day")
    );
    const todaysBookingsCount = todaysBookings.length;
    const todaysTotalAmount = todaysBookings.reduce(
      (sum, b) => sum + b.totalAmount,
      0
    );

    const thisWeekBookings = allBookings.filter(
      (b) => b.date >= startOfWeek && b.date <= endOfWeek
    );
    const thisWeekTotalAmount = thisWeekBookings.reduce(
      (sum, b) => sum + b.totalAmount,
      0
    );

    const weeklyBookingsCountByDay: Record<string, number> = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
    };

    thisWeekBookings.forEach((b) => {
      const day = moment(b.date).format("dddd");
      weeklyBookingsCountByDay[day] += 1;
    });

    const thisMonthTotalAmount = bookingsThisMonth.reduce(
      (sum, b) => sum + b.totalAmount,
      0
    );

    const upcomingBookings = allBookings.filter((b) => b.date >= today);

    const statusCounts = {
      PENDING: 0,
      CONFIRMED: 0,
      CANCELLED: 0,
      COMPLETED: 0,
    };

    upcomingBookings.forEach((b) => {
      if (statusCounts[b.status] !== undefined) {
        statusCounts[b.status]++;
      }
    });

    return res.status(200).json({
      message: "Dashboard data fetched successfully",
      newBookings: allBookings,
      bookingsThisMonth,
      thisMonthBookingsCount,
      todaysBookingsCount,
      todaysTotalAmount,
      newUsersCount,
      thisWeekTotalAmount,
      thisMonthTotalAmount,
      statusCounts,
      weeklyBookingsCountByDay,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({ error: "Failed to load dashboard data" });
  }
};
