import express from "express";
import dotenv from "dotenv";
import { PORT } from "./config/env";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import videoRoutes from "./routes/video.route";
import errorHandler from "./middlewares/errorHandler";
import { setupSwagger } from "./utils/swagger";
import "./types/express";
import postRouter from "./routes/post.routes";
import roomRouter from "./routes/room.route";
import requestRouter from "./routes/request.routes";
import notificationRoutes from "./routes/notification.routes";
import messageRoutes from "./routes/message.route";
import http from "http";
import { initSocket } from "./socket";
import cron from "node-cron";
import { markInactiveUsersOffline } from "./cron/markOffline";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

setupSwagger(app);
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/post", postRouter);
app.use("/api/room", roomRouter);
app.use("/api/request", requestRouter);
app.use("/api/notification", notificationRoutes);
app.use("/api/messages", messageRoutes);

cron.schedule("* * * * *", () => {
  markInactiveUsersOffline();
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
      message: error instanceof Error ? error.message : "Unknown error"
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
