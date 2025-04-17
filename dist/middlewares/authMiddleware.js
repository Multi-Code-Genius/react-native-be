"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var env_1 = require("../config/env");
if (!env_1.SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
var JWT_SECRET = env_1.SECRET_KEY;
var authMiddleware = function (req, res, next) {
    var authHeader = req.header("Authorization");
    if (!authHeader) {
        res.status(401).json({ message: "Access Denied: No token provided" });
        return;
    }
    var token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Access Denied: Invalid token format" });
        return;
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};
exports.authMiddleware = authMiddleware;
