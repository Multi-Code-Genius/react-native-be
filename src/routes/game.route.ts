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

const gameRoutes: Router = express.Router();

gameRoutes.post("/create", authMiddleware, createGame);
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
 *     summary: Create a new game
 *     description: Creates a new game/turf with location, pricing, and other details.
 *     tags:
 *       - Game
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: City Turf
 *               category:
 *                 type: string
 *                 example: Football
 *               description:
 *                 type: string
 *                 example: this is a test dummy description for testing purpose xyz
 *               hourlyPrice:
 *                 type: number
 *                 format: float
 *                 example: 1200
 *               capacity:
 *                 type: integer
 *                 example: 10
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     example: Mumbai
 *                   area:
 *                     type: string
 *                     example: Andheri
 *               address:
 *                 type: string
 *                 example: XYZ Lane, Andheri West
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - https://example.com/image1.jpg
 *                   - https://example.com/image2.jpg
 *               gameInfo:
 *                 type: object
 *                 properties:
 *                   surface:
 *                     type: string
 *                     example: Artificial Grass
 *                   indoor:
 *                     type: boolean
 *                     example: false
 *               net:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Game created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game Created
 *                 game:
 *                   $ref: '#/components/schemas/Game'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
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
