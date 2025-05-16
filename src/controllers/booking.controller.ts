import { Request, Response } from "express";
import { convertTo24Hour } from "../helper/helper";
import { createCustomer, createUser } from "../utils/createdCustomer";
import { prisma } from "../utils/prisma";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { startTime, endTime, nets, gameId, date, number, name } = req.body;

    const bookingDate = new Date(date);

    const adminId = req.user?.userId || "";

    const user = await createUser({
      name,
      mobile: number,
      role: "user",
    });

    const customer = await createCustomer({
      name,
      mobile: number,
      userId: user.id,
      createdById: adminId,
    });

    const now = new Date();
    const today = new Date();

    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const bookingDateOnly = new Date(
      bookingDate.getFullYear(),
      bookingDate.getMonth(),
      bookingDate.getDate()
    );

    if (bookingDateOnly < todayDateOnly) {
      return res
        .status(400)
        .json({ message: "Cannot update. Booking is for a past date." });
    }

    if (bookingDateOnly.getTime() === todayDateOnly.getTime()) {
      if (startTime) {
        const proposedStart = istToUTC(
          startTime,
          bookingDate.toISOString().split("T")[0]
        );
        if (proposedStart < now) {
          return res
            .status(400)
            .json({ message: "Start time is in the past." });
        }
      }
      if (endTime) {
        const proposedEnd = istToUTC(
          endTime,
          bookingDate.toISOString().split("T")[0]
        );
        if (proposedEnd < now) {
          return res.status(400).json({ message: "End time is in the past." });
        }
      }
    }

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
        isCancel: false,
        date: bookingDate,
        AND: [
          { startTime: { lt: requestedEnd } },
          { endTime: { gt: requestedStart } },
        ],
      },
    });

    if (conflictingBookings) {
      return res.status(409).json({
        message: "Time slot already booked.",
      });
    }

    // await prisma.customer.update({
    //   where: { id: customer.id },
    //   data: {
    //     totalSpent: {
    //       increment: totalAmount,
    //     },
    //   },
    // });

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        customerId: customer.id,
        gameId,
        date: bookingDate,
        startTime: requestedStart,
        endTime: requestedEnd,
        nets,
        totalAmount: totalAmount,
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

    // sendWhatsAppMessage(
    //   "8849321658",
    //   `📅 Hello ${user.name},\n\nYour booking for *${booking.game.name}* has been successfully confirmed!\n\n🗓️ Date: ${booking.date}\n⏰ Time: ${booking.startTime} to ${booking.endTime}\n\nThank you for choosing us. We look forward to seeing you soon!\n\n_— Multi Code Genius Team_`
    // );

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
    const { startTime, endTime, nets, date, totalAmount, userId } = req.body;

    const requestedStart = istToUTC(startTime, date);
    const requestedEnd = istToUTC(endTime, date);

    const dataToUpdate: any = {};

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const now = new Date();

    function convertTo24Hour(time12h: string): string {
      const [time, modifier] = time12h.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    }

    function istToUTC(time: string, dateStr: string): Date {
      const time24 = convertTo24Hour(time);
      return new Date(`${dateStr}T${time24}:00+05:30`);
    }

    const bookingDate = booking.date;

    const today = new Date();
    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const bookingDateOnly = new Date(
      bookingDate.getFullYear(),
      bookingDate.getMonth(),
      bookingDate.getDate()
    );

    if (bookingDateOnly < todayDateOnly) {
      return res
        .status(400)
        .json({ message: "Cannot update. Booking is for a past date." });
    }

    if (bookingDateOnly.getTime() === todayDateOnly.getTime()) {
      if (startTime) {
        const proposedStart = istToUTC(
          startTime,
          bookingDate.toISOString().split("T")[0]
        );
        if (proposedStart < now) {
          return res
            .status(400)
            .json({ message: "Start time is in the past." });
        }
      }
      if (endTime) {
        const proposedEnd = istToUTC(
          endTime,
          bookingDate.toISOString().split("T")[0]
        );
        if (proposedEnd < now) {
          return res.status(400).json({ message: "End time is in the past." });
        }
      }
    }

    const conflictingBookings = await prisma.booking.findFirst({
      where: {
        gameId: booking.gameId,
        isCancel: false,
        date: bookingDate,
        AND: [
          { startTime: { lt: requestedEnd } },
          { endTime: { gt: requestedStart } },
        ],
      },
    });

    if (conflictingBookings && conflictingBookings.id !== booking.id) {
      return res.status(409).json({
        message: "Time slot already booked.",
      });
    }

    if (date) {
      dataToUpdate.date = new Date(date);
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

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: dataToUpdate,
      include: {
        game: { select: { name: true } },
        user: { select: { name: true, profile_pic: true, mobileNumber: true } },
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
      where: { id: bookingId, isCancel: false },
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
        isCancel: false,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            mobile: true,
            userId: true,
            createdById: true,
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

    await prisma.booking.update({
      where: { id: bookingId },
      data: { isCancel: true },
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
        isCancel: false,
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

export const allUserBooking = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.userId || "";

    const customers = await prisma.customer.findMany({
      where: {
        ownerId: adminId,
      },
      include: {
        bookings: {
          include: {
            game: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({ message: "All User Booking", customers });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Failed to get bookings" });
  }
};

export const customer = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    const adminId = req.user?.userId || "";

    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
        ownerId: adminId,
      },
      include: {
        bookings: {
          include: {
            game: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.status(200).json({ message: "Customer Data", customer });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Failed to get bookings" });
  }
};

export const suggestExistingCustomer = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.userId || "";

    const { number } = req.params;

    const customer = await prisma.customer.findUnique({
      where: {
        userId_createdById: {
          userId: number,
          createdById: adminId,
        },
      },
    });

    if (customer) {
      return res
        .status(200)
        .json({ message: "Customer already exists", customer });
    }

    res.status(200).json({ message: "Customer does not exist" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Failed to check customer" });
  }
};
