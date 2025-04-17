import express, { RequestHandler } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  getFriendRequests,
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
router.get(
  "/friend-request/my-request",
  authMiddleware,
  getFriendRequests as RequestHandler
);

router.get(
  "/friend-request/sent-request",
  authMiddleware,
  getFriendRequests as RequestHandler
);

export default router;
