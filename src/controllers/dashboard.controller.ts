import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const gameId = req.params.gameId;

    const dashboardData = await prisma.booking.findMany({
      where: {
        gameId,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const todaysBookings = dashboardData.filter((booking) => {
      const bookingDate = new Date(booking.date);
      return bookingDate.toDateString() === today.toDateString();
    });
    const todaysBookingsCount = todaysBookings.length;
    const todaysBookingsAmount = todaysBookings.reduce(
      (acc, booking) => acc + booking.totalAmount,
      0
    );

    const thisWeekBookings = dashboardData.filter((booking) => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
    });

    const thisWeekBookingsTotalAmount = thisWeekBookings.reduce(
      (acc, booking) => acc + booking.totalAmount,
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

    thisWeekBookings.forEach((booking) => {
      const day = new Date(booking.date).toLocaleDateString("en-US", {
        weekday: "long",
      });
      weeklyBookingsCountByDay[day] = (weeklyBookingsCountByDay[day] || 0) + 1;
    });

    const thisMonthBookings = dashboardData.filter((booking) => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= startOfMonth && bookingDate <= endOfMonth;
    });
    const thisMonthBookingsTotalAmount = thisMonthBookings.reduce(
      (acc, booking) => acc + booking.totalAmount,
      0
    );

    const upcomingBookings = dashboardData.filter((booking) => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= today;
    });

    const statusCounts = {
      PENDING: 0,
      CONFIRMED: 0,
      CANCELLED: 0,
      COMPLETED: 0,
    };

    upcomingBookings.forEach((booking) => {
      if (statusCounts[booking.status] !== undefined) {
        statusCounts[booking.status]++;
      }
    });

    res.status(200).json({
      message: "Dashboard data fetched successfully",
      todaysBookingsCount,
      todaysBookingsAmount,
      thisWeekBookingsTotalAmount,
      thisMonthBookingsTotalAmount,
      statusCounts,
      weeklyBookingsCountByDay,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
