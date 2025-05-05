import express, { RequestHandler, Router } from "express";
import {
  allGames,
  createGame,
  gameByAdmin,
  getGameByid,
  getGameByidWithDate,
  locationBaseGames,
} from "../controllers/game.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { handleUploadGame, uploadGame } from "../helper/upload";

const gameRoutes: Router = express.Router();

gameRoutes.post(
  "/create",
  uploadGame.array("game"),
  handleUploadGame,
  authMiddleware,
  createGame
);

gameRoutes.get("/", authMiddleware, allGames);
gameRoutes.get("/location/:city", authMiddleware, locationBaseGames);
gameRoutes.get(
  "/id/:gameId",
  authMiddleware,
  getGameByid as unknown as RequestHandler
);

gameRoutes.get(
  "/gameid/:id/:date",
  authMiddleware,
  getGameByidWithDate as unknown as RequestHandler
);

gameRoutes.get(
  "/all",
  authMiddleware,
  gameByAdmin as unknown as RequestHandler
);

export default gameRoutes;

/**
 * @swagger
 * /api/game/create:
 *   post:
 *     summary: Create a new game/turf
 *     description: Creates a new game with name, category, description, pricing, location, game info, and image uploads.
 *     tags:
 *       - Game
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: postman cricket
 *               category:
 *                 type: string
 *                 example: football
 *               description:
 *                 type: string
 *                 example: football Cricket description this is test description
 *               hourlyPrice:
 *                 type: string
 *                 example: "45000"
 *               capacity:
 *                 type: string
 *                 example: "45"
 *               location[city]:
 *                 type: string
 *                 example: Surat
 *               location[area]:
 *                 type: string
 *                 example: vesu
 *               address:
 *                 type: string
 *                 example: samarth bunglows, someshwara enclave
 *               gameInfo[surface]:
 *                 type: string
 *                 example: natural Grass
 *               gameInfo[indoor]:
 *                 type: string
 *                 example: false
 *               gameInfo[equipment provided]:
 *                 type: string
 *                 example: true
 *               net:
 *                 type: string
 *                 example: "1"
 *               game:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Multiple image files
 *     responses:
 *       200:
 *         description: Game created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Created game object
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/game:
 *   get:
 *     summary: Get all games
 *     description: Retrieves a list of all available games/turfs.
 *     tags:
 *       - Game
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of games
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 games:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Game'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/game/id/{id}:
 *   get:
 *     summary: Get game by ID
 *     description: Fetches details of a single game using its unique ID.
 *     tags:
 *       - Game
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the game
 *     responses:
 *       200:
 *         description: Game details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 category:
 *                   type: string
 *                 description:
 *                   type: string
 *                 hourlyPrice:
 *                   type: number
 *                 capacity:
 *                   type: number
 *                 location:
 *                   type: object
 *                   properties:
 *                     city:
 *                       type: string
 *                     area:
 *                       type: string
 *                 address:
 *                   type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                 gameInfo:
 *                   type: object
 *                   properties:
 *                     surface:
 *                       type: string
 *                     indoor:
 *                       type: boolean
 *                 net:
 *                   type: number
 *       404:
 *         description: Game not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/game/all:
 *   get:
 *     summary: Get all games
 *     description: Returns a list of all games in the database. Requires Bearer token authentication.
 *     tags:
 *       - Game
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       500:
 *         description: Internal server error
 */
