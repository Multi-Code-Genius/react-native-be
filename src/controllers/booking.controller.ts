import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId ?? "";
    const { startTime, endTime, nets, gameId, totalAmount, date } = req.body;

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) throw new Error("Game not found");

    const bookingDate = new Date(date);

    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        gameId,
        date: bookingDate,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        nets,
        totalAmount,
        status: "PENDING",
      },
    });
    res.status(200).json({ message: "Booking Created", booking });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || "Failed to create booking" });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });
    res.json({ success: true, booking: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: "Failed to update status" });
  }
};

export const getBookigById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // const bookings = await prisma.booking.findMany({
    //   where: { userId },
    //   include: { game: true, timeSlot: true },
    // });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to get bookings" });
  }
};
