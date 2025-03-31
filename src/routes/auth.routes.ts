import express, { RequestHandler } from "express";
import { register, login } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", register as RequestHandler);
router.post("/login", login as RequestHandler);

export default router;
