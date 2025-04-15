import express, { RequestHandler } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { deleteRoom, findOrCreateRoom } from "../controllers/room.controller";

const route = express.Router();

route.post(
  "/find-or-create",
  authMiddleware,
  findOrCreateRoom as unknown as RequestHandler
);
route.delete("/delete/:roomId", authMiddleware, deleteRoom as RequestHandler);

export default route;
