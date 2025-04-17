"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authMiddleware_1 = require("../middlewares/authMiddleware");
var request_controller_1 = require("../controllers/request.controller");
var router = express_1.default.Router();
router.post("/friend-request", authMiddleware_1.authMiddleware, request_controller_1.requestUser);
router.post("/friend-request/:id/accept", authMiddleware_1.authMiddleware, request_controller_1.requestAccept);
router.post("/friend-request/:id/decline", authMiddleware_1.authMiddleware, request_controller_1.requestDecline);
exports.default = router;
