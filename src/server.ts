import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import cron from "node-cron";
import { PORT } from "./config/env";
import { markInactiveUsersOffline } from "./cron/markOffline";
import { updateRoomStatus } from "./cron/updateRoomStatus";
import errorHandler from "./middlewares/errorHandler";
import authRoutes from "./routes/auth.routes";
import bookingRoutes from "./routes/booking.route";
import gameRoutes from "./routes/game.route";
import messageRoutes from "./routes/message.route";
import notificationRoutes from "./routes/notification.routes";
import postRouter from "./routes/post.routes";
import requestRouter from "./routes/request.routes";
import roomRouter from "./routes/room.route";
import userRoutes from "./routes/user.routes";
import videoRoutes from "./routes/video.route";
import { initSocket } from "./socket";
import "./types/express";
import { setupSwagger } from "./utils/swagger";
import dashboardRouter from "./routes/dashboard.routes";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));

setupSwagger(app);

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/post", postRouter);
app.use("/api/room", roomRouter);
app.use("/api/request", requestRouter);
app.use("/api/notification", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/dashboard", dashboardRouter);

cron.schedule("* * * * *", () => {
  markInactiveUsersOffline();
  updateRoomStatus();
});

app.get("/reset-redirect", (req, res) => {
  const { token } = req.query;
  const deepLink = `initialproject://reset-password/${token}`;
  res.redirect(deepLink);
});

app.get("/", (req, res) => {
  try {
    res.status(200).json("Hello, This is React Native Backend Apis");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

initSocket(server);

app.use(errorHandler);

server
  .listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} is already in use.`);
      process.exit(1);
    } else {
      throw err;
    }
  });
