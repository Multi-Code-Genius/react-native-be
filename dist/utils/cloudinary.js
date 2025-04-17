"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cloudinary_1 = require("cloudinary");
var dotenv_1 = __importDefault(require("dotenv"));
var env_1 = require("../config/env");
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: env_1.CLOUD_NAME,
    api_key: env_1.API_KEY,
    api_secret: env_1.API_SECRET
});
exports.default = cloudinary_1.v2;
