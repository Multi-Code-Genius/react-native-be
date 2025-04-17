"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostById = exports.commentsPost = exports.likePost = exports.getPost = exports.uploadPost = void 0;
var prisma_1 = require("../utils/prisma");
var uploadPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, post, newPost, error_1;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 2, , 3]);
                _a = req.body, title = _a.title, description = _a.description;
                post = (_c = (_b = req.file) === null || _b === void 0 ? void 0 : _b.path) !== null && _c !== void 0 ? _c : "";
                return [4 /*yield*/, prisma_1.prisma.post.create({
                        data: {
                            title: title,
                            description: description,
                            post: post,
                            userId: (_e = (_d = req.user) === null || _d === void 0 ? void 0 : _d.userId) !== null && _e !== void 0 ? _e : ""
                        }
                    })];
            case 1:
                newPost = _f.sent();
                res.status(200).json({ message: "Post uploaded", Post: newPost });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _f.sent();
                console.error("Post upload error:", error_1);
                res.status(500).json({ error: error_1.message || "Upload failed" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.uploadPost = uploadPost;
var getPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videos, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma_1.prisma.post.findMany({
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    profile_pic: true
                                }
                            },
                            comments: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            profile_pic: true
                                        }
                                    }
                                }
                            },
                            likes: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            profile_pic: true
                                        }
                                    }
                                }
                            }
                        }
                    })];
            case 1:
                videos = _a.sent();
                res.status(200).json({ message: " Post retrieved", videos: videos });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Post Fetched error:", error_2);
                res.status(500).json({ error: error_2.message || "Get failed" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPost = getPost;
var likePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var existingLike, error_3;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 6, , 7]);
                return [4 /*yield*/, prisma_1.prisma.like.findUnique({
                        where: {
                            userId_postId: {
                                userId: (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) !== null && _b !== void 0 ? _b : "",
                                postId: req.params.id
                            }
                        }
                    })];
            case 1:
                existingLike = _g.sent();
                if (!existingLike) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma_1.prisma.like.delete({
                        where: {
                            userId_postId: {
                                userId: (_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId) !== null && _d !== void 0 ? _d : "",
                                postId: req.params.id
                            }
                        }
                    })];
            case 2:
                _g.sent();
                res.status(200).json({ message: "Post disLiked" });
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, prisma_1.prisma.like.create({
                    data: {
                        userId: (_f = (_e = req.user) === null || _e === void 0 ? void 0 : _e.userId) !== null && _f !== void 0 ? _f : "",
                        postId: req.params.id
                    }
                })];
            case 4:
                _g.sent();
                res.status(200).json({ message: "Post liked" });
                _g.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_3 = _g.sent();
                console.error("Post like error:", error_3);
                res.status(500).json({ error: error_3.message || "Like failed" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.likePost = likePost;
var commentsPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_4;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma_1.prisma.comment.create({
                        data: {
                            text: req.body.text,
                            userId: (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) !== null && _b !== void 0 ? _b : "",
                            postId: req.params.id
                        }
                    })];
            case 1:
                _c.sent();
                res.status(200).json({ message: "Comment added" });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _c.sent();
                console.error("Post Comment error:", error_4);
                res.status(500).json({ error: error_4.message || "Comment failed" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.commentsPost = commentsPost;
var getPostById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var video, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma_1.prisma.post.findUnique({
                        where: { id: req.params.id },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    profile_pic: true
                                }
                            },
                            likes: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            profile_pic: true
                                        }
                                    }
                                }
                            },
                            comments: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            profile_pic: true
                                        }
                                    }
                                }
                            }
                        }
                    })];
            case 1:
                video = _a.sent();
                res.status(200).json({ message: "Post Fetched", video: video });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error("Post Fetched error:", error_5);
                res.status(500).json({ error: error_5.message || "Post failed" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPostById = getPostById;
