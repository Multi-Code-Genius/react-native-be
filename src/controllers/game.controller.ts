import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { startOfDay, endOfDay } from "date-fns";

export const createGame = async (req: Request, res: Response) => {
  const {
    name,
    location,
    description,
    category,
    hourlyPrice,
    capacity,
    address,
    gameInfo,
    net,
  } = req.body;

  try {
    const game = await prisma.game.create({
      data: {
        name,
        location,
        hourlyPrice,
        capacity,
        description,
        category,
        address,
        gameInfo,
        net,
      },
    });

    res.status(200).json({ message: "Game Created", game });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to Create games" });
  }
};

export const allGames = async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany({
      include: {
        bookings: {
          where: {
            status: { not: "CANCELLED" },
          },
          select: {
            date: true,
            startTime: true,
            endTime: true,
          },
        },
      },
    });
    res.status(200).json({ message: "Fetched All Games", games });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to fetch games" });
  }
};

export const locationBaseGames = async (req: Request, res: Response) => {
  const { city } = req.params;

  try {
    const games = await prisma.game.findMany({
      where: {
        location: {
          path: ["city"],
          equals: city,
        },
      },
    });

    res.status(200).json({ success: true, games });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch games by location" });
  }
};

export const getGameByid = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;

    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      },
      include: {
        bookings: {
          select: {
            date: true,
            endTime: true,
            startTime: true,
            nets: true,
            status: true,
          },
        },
      },
    });

    if (!game) {
      return res.status(404).json({ message: "Game is Not available" });
    }

    res.status(200).json({ message: "Games Fetched", game });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch game by Id" });
  }
};

export const getGameByidWithDate = async (req: Request, res: Response) => {
  try {
    const { id: gameId, date } = req.params;

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      },
      include: {
        bookings: {
          where: {
            date: {
              gte: startOfDay(parsedDate),
              lte: endOfDay(parsedDate),
            },
          },
          select: {
            date: true,
            startTime: true,
            endTime: true,
            nets: true,
            status: true,
          },
        },
      },
    });

    if (!game) {
      return res.status(404).json({ message: "Game is Not available" });
    }

    res.status(200).json({ message: "Games Fetched", game });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch game by Id" });
  }
};
