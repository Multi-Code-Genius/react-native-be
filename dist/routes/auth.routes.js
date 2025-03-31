"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_controller_1 = require("../controllers/auth.controller");
var router = express_1.default.Router();
router.post("/signup", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
exports.default = router;
