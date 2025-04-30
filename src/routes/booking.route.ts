import express, { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createBooking,
  getBookigById,
  updateBooking,
} from "../controllers/booking.controller";

const bookingRoutes: Router = express.Router();

bookingRoutes.post("/create", authMiddleware, createBooking);

bookingRoutes.put("/status/:id", authMiddleware, updateBooking);

bookingRoutes.post("/user/:userId", authMiddleware, getBookigById);
export default bookingRoutes;
