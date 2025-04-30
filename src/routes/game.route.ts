import express, { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  allGames,
  createGame,
  locationBaseGames,
} from "../controllers/game.controller";

const gameRoutes: Router = express.Router();

gameRoutes.post("/create", authMiddleware, createGame);
gameRoutes.get("/", authMiddleware, allGames);
gameRoutes.get("/location/:city", authMiddleware, locationBaseGames);

export default gameRoutes;
