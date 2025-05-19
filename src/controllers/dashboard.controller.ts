import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import moment from "moment";
import PDFDocument from "pdfkit";

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

export const exportReport = async (req: Request, res: Response) => {
  const month = moment().format("YYYY-MM");
  const gameId = req.params.gameId;

  const bookings = await prisma.booking.findMany({
    where: {
      gameId: {
        in: [gameId],
      },
      createdAt: {
        gte: new Date(month as string),
      },
    },
    include: {
      game: { select: { name: true } },
      customer: { select: { name: true, totalSpent: true } },
    },
  });

  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=monthly_report.pdf"
  );

  doc.pipe(res);

  // Title
  doc
    .fontSize(22)
    .fillColor("#333")
    .text("Monthly Booking Report", { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(14)
    .fillColor("gray")
    .text(moment(month as string).format("MMMM YYYY"), { align: "center" })
    .fillColor("black")
    .moveDown(1.5);

  // Table header setup
  const tableTop = 160;
  const rowHeight = 28;

  const colX = {
    customer: 40,
    game: 130,
    date: 270,
    start: 350,
    end: 420,
    amount: 490,
  };

  // Draw table header
  doc.rect(40, tableTop, 520, rowHeight).fill("#003049");

  doc
    .fillColor("#fff")
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Customer", colX.customer, tableTop + 8)
    .text("Game", colX.game, tableTop + 8)
    .text("Date", colX.date, tableTop + 8)
    .text("Start", colX.start, tableTop + 8)
    .text("End", colX.end, tableTop + 8)
    .text("Amount", colX.amount, tableTop + 8, { width: 60, align: "right" });

  let y = tableTop + rowHeight;

  // Draw each row with alternate row coloring
  bookings.forEach((b, i) => {
    const isEven = i % 2 === 0;
    const rowColor = isEven ? "#f8f9fa" : "#ffffff";
    const textColor = "#000";

    doc.rect(40, y, 520, rowHeight).fill(rowColor);

    doc
      .fillColor(textColor)
      .font("Helvetica")
      .fontSize(11)
      .text(b.customer?.name || "N/A", colX.customer, y + 8)
      .text(b.game.name, colX.game, y + 8)
      .text(moment(b.startTime).format("YYYY-MM-DD"), colX.date, y + 8)
      .text(moment(b.startTime).format("HH:mm"), colX.start, y + 8)
      .text(moment(b.endTime).format("HH:mm"), colX.end, y + 8)
      .text(`₹${b.totalAmount}`, colX.amount, y + 8, {
        width: 60,
        align: "right",
      });

    y += rowHeight;
  });

  // Footer
  doc
    .moveDown(2)
    .fontSize(10)
    .fillColor("gray")
    .text("Generated by Booking App", { align: "center" });

  doc.end();
};
