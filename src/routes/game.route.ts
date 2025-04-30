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
