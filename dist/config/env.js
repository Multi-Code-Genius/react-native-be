"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE_CLIENT_ID = exports.BASE_URL = exports.EMAIL_PASS = exports.EMAIL_USER = exports.API_SECRET = exports.API_KEY = exports.CLOUD_NAME = exports.NODE_ENV = exports.SECRET_KEY = exports.PORT = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 5000;
exports.SECRET_KEY = process.env.JWT_SECRET;
exports.NODE_ENV = process.env.NODE_ENV;
exports.CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
exports.API_KEY = process.env.CLOUDINARY_API_KEY;
exports.API_SECRET = process.env.CLOUDINARY_API_SECRET;
exports.EMAIL_USER = process.env.EMAIL_USER;
exports.EMAIL_PASS = process.env.EMAIL_PASS;
exports.BASE_URL = process.env.BASE_URL;
exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
