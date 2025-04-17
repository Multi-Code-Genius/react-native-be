"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPost = exports.uploadProfile = exports.uploadVideo = void 0;
var multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
var multer_1 = __importDefault(require("multer"));
var cloudinary_1 = __importDefault(require("./cloudinary"));
var path_1 = __importDefault(require("path"));
var profileStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: {
        resource_type: "auto",
        folder: "profile-pics",
        allowed_formats: ["jpg", "png"],
        transformation: [{ width: 300, height: 300, crop: "limit" }]
    }
});
var postStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: {
        resource_type: "auto",
        folder: "post",
        allowed_formats: ["jpg", "png"],
        transformation: [{ width: 1080, height: 1080, crop: "limit" }]
    }
});
var videoStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: {
        resource_type: "video",
        folder: "reels-videos",
        allowed_formats: ["mp4", "mov", "webm"],
        public_id: function (req, file) {
            var nameWithoutExt = path_1.default.parse(file.originalname).name;
            return "video-".concat(Date.now(), "-").concat(nameWithoutExt);
        }
    }
});
exports.uploadVideo = (0, multer_1.default)({ storage: videoStorage });
exports.uploadProfile = (0, multer_1.default)({ storage: profileStorage });
exports.uploadPost = (0, multer_1.default)({ storage: postStorage });
