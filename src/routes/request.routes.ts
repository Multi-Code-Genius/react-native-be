import express, { RequestHandler } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  requestAccept,
  requestDecline,
  requestUser
} from "../controllers/request.controller";

const router = express.Router();

router.post("/friend-request", authMiddleware, requestUser as RequestHandler);
router.post(
  "/friend-request/:id/accept",
  authMiddleware,
  requestAccept as RequestHandler
);
router.post(
  "/friend-request/:id/decline",
  authMiddleware,
  requestDecline as RequestHandler
);

export default router;
