"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var env_1 = require("./config/env");
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var morgan_1 = __importDefault(require("morgan"));
var body_parser_1 = __importDefault(require("body-parser"));
var auth_routes_1 = __importDefault(require("./routes/auth.routes"));
var user_routes_1 = __importDefault(require("./routes/user.routes"));
var video_route_1 = __importDefault(require("./routes/video.route"));
var errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
var swagger_1 = require("./utils/swagger");
require("./types/express");
var post_routes_1 = __importDefault(require("./routes/post.routes"));
var room_route_1 = __importDefault(require("./routes/room.route"));
var request_routes_1 = __importDefault(require("./routes/request.routes"));
var http_1 = __importDefault(require("http"));
var socket_1 = require("./socket");
dotenv_1.default.config();
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
(0, swagger_1.setupSwagger)(app);
app.use(body_parser_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/user", user_routes_1.default);
app.use("/api/video", video_route_1.default);
app.use("/api/post", post_routes_1.default);
app.use("/api/room", room_route_1.default);
app.use("/api/request", request_routes_1.default);
app.get("/reset-redirect", function (req, res) {
    var token = req.query.token;
    var deepLink = "initialproject://reset-password/".concat(token);
    res.redirect(deepLink);
});
app.get("/", function (req, res) {
    try {
        res.status(200).json("Hello, This is React Native Backend Apis");
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
(0, socket_1.initSocket)(server);
app.use(errorHandler_1.default);
server
    .listen(env_1.PORT, function () {
    console.log("\uD83D\uDE80 Server running on http://localhost:".concat(env_1.PORT));
})
    .on("error", function (err) {
    if (err.code === "EADDRINUSE") {
        console.error("\u274C Port ".concat(env_1.PORT, " is already in use."));
        process.exit(1);
    }
    else {
        throw err;
    }
});
