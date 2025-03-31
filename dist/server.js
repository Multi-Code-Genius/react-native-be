"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var morgan_1 = __importDefault(require("morgan"));
var auth_routes_1 = __importDefault(require("./routes/auth.routes"));
var errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use("/api/auth", auth_routes_1.default);
app.use(errorHandler_1.default);
app.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
