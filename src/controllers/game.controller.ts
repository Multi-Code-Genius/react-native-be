import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

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
      //   where: {
      //     location: {
      //       path: ["city"],
      //       equals: city,
      //     },
      //   },
    });

    res.json({ success: true, games });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch games by location" });
  }
};
