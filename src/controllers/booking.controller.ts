import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { convertTo24Hour } from "../helper/helper";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { startTime, endTime, nets, gameId, date, number, name } = req.body;

    const bookingDate = new Date(date);

    function istToUTC(time: string, date: string) {
      const istDateTime = new Date(`${date}T${convertTo24Hour(time)}+05:30`);
      return new Date(istDateTime.toISOString());
    }

    const requestedStart = istToUTC(startTime, date);
    const requestedEnd = istToUTC(endTime, date);

    const totalAmount = parseFloat(req.body.totalAmount);
    if (isNaN(totalAmount)) {
      throw new Error("Invalid totalAmount");
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) throw new Error("Game not found");

    const conflictingBookings = await prisma.booking.findFirst({
      where: {
        gameId,
        date: bookingDate,
        AND: [
          { startTime: { lt: requestedEnd } },
          { endTime: { gt: requestedStart } },
        ],
      },
    });

    if (conflictingBookings) {
      return res.status(409).json({
        message: "Time slot already booked for this game on the selected date.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        mobileNumber: number,
      },
    });

    if (!user) {
      await prisma.user.create({
        data: {
          mobileNumber: number,
          name,
        },
      });
    }

    const booking = await prisma.booking.create({
      data: {
        userMobile: number,
        gameId,
        date: bookingDate,
        startTime: requestedStart,
        endTime: requestedEnd,
        nets,
        totalAmount,
        status: "PENDING",
      },
      include: {
        game: {
          select: {
            name: true,
          },
        },
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

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });
    res.json({
      message: "Booking status updated Successfully",
      booking: updated,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: "Failed to update status" });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, nets, date, totalAmount } = req.body;

    const dataToUpdate: any = {};

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (date) {
      dataToUpdate.date = new Date(date);
    }

    function istToUTC(time: string, date: string) {
      const istDateTime = new Date(`${date}T${convertTo24Hour(time)}+05:30`);
      return new Date(istDateTime.toISOString());
    }

    if (startTime && date) {
      dataToUpdate.startTime = istToUTC(startTime, date);
    }
    if (endTime && date) {
      dataToUpdate.endTime = istToUTC(endTime, date);
    }

    if (nets !== undefined) {
      dataToUpdate.nets = nets;
    }

    if (totalAmount !== undefined) {
      const parsedAmount = parseFloat(totalAmount);
      if (isNaN(parsedAmount)) {
        throw new Error("Invalid totalAmount");
      }
      dataToUpdate.totalAmount = parsedAmount;
    }

    const newStartTime = dataToUpdate.startTime || booking.startTime;
    const newEndTime = dataToUpdate.endTime || booking.endTime;
    const bookingDate = dataToUpdate.date || booking.date;

    const isExpanding =
      newStartTime < booking.startTime || newEndTime > booking.endTime;

    if (isExpanding) {
      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          id: { not: id },
          gameId: booking.gameId,
          date: bookingDate,
          startTime: { lt: newEndTime },
          endTime: { gt: newStartTime },
        },
      });

      if (conflictingBooking) {
        return res.status(409).json({
          message: `Time slot already booked from ${conflictingBooking.startTime.toLocaleTimeString()} to ${conflictingBooking.endTime.toLocaleTimeString()}.`,
        });
      }
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: dataToUpdate,
      include: {
        game: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            profile_pic: true,
            mobileNumber: true,
          },
        },
      },
    });

    res.json({ message: "Booking Updated Successfully", booking: updated });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to update booking" });
  }
};

export const getBookigById = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        game: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            profile_pic: true,
            mobileNumber: true,
          },
        },
      },
    });
    res.json({ message: "Booking Data", booking });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to get bookings" });
  }
};

export const getBookingByGameId = async (req: Request, res: Response) => {
  try {
    const { id, date } = req.params;

    const [day, month, year] = date.split("-");
    const isoDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

    if (isNaN(isoDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const booking = await prisma.booking.findMany({
      where: {
        gameId: id,
        date: isoDate,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile_pic: true,
          },
        },
      },
    });

    return res.status(200).json({ message: "Fetch Booking Data", booking });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to get bookings" });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!existingBooking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    res.status(200).json({ message: "User Booking Cancel successfully." });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err.message || "Failed to Cancel bookings" });
  }
};

export const getBookingByWeek = async (req: Request, res: Response) => {
  try {
    const { gameId, start, end } = req.params;

    if (!start || !end) {
      return res.status(400).json({ message: "Invalid date range." });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        gameId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile_pic: true,
          },
        },
      },
    });

    return res.status(200).json({ message: "Fetch Booking Data", bookings });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: err.message || "Failed to get bookings" });
  }
};
