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
exports.searchUser = exports.getUserByid = exports.getAllUser = exports.uploadProfilePicture = exports.deleteUser = exports.UpdateUser = exports.getProfile = void 0;
var prisma_1 = require("../utils/prisma");
var getProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.user) {
                    res.status(401).json({ message: "Unauthorized" });
                    return [2 /*return*/];
                }
                id = req.user.userId;
                return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                        where: {
                            id: id
                        },
                        include: {
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
                            },
                            videos: true,
                            posts: true
                        }
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    res.status(404).json({ message: "User not found" });
                    return [2 /*return*/];
                }
                res.status(200).json({ message: "User Data Fetched successfully.", user: user });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("user error:", error_1);
                res.status(500).json({
                    message: error_1 instanceof Error ? error_1.message : "Internal server error"
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProfile = getProfile;
var UpdateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, location_1, mobileNumber, status_1, dob, id, existingUser, updateData, parsedDob, updatedUser, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, name_1 = _a.name, email = _a.email, location_1 = _a.location, mobileNumber = _a.mobileNumber, status_1 = _a.status, dob = _a.dob;
                if (!req.user || !req.user.userId) {
                    res.status(401).json({ message: "Unauthorized" });
                    return [2 /*return*/];
                }
                id = req.user.userId;
                return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                        where: { id: id }
                    })];
            case 1:
                existingUser = _b.sent();
                if (!existingUser) {
                    res.status(404).json({ message: "User not found" });
                    return [2 /*return*/];
                }
                updateData = {};
                if (name_1)
                    updateData.name = name_1;
                if (email)
                    updateData.email = email;
                if (location_1)
                    updateData.location = location_1;
                if (mobileNumber)
                    updateData.mobileNumber = mobileNumber;
                if (status_1)
                    updateData.status = status_1;
                if (dob) {
                    parsedDob = new Date(dob);
                    if (isNaN(parsedDob.getTime())) {
                        return [2 /*return*/, res.status(400).json({ error: "Invalid date format for dob" })];
                    }
                    updateData.dob = parsedDob;
                }
                return [4 /*yield*/, prisma_1.prisma.user.update({
                        where: { id: id },
                        data: updateData
                    })];
            case 2:
                updatedUser = _b.sent();
                res
                    .status(200)
                    .json({ message: "User updated successfully", user: updatedUser });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error(error_2);
                console.log("error", error_2);
                if (error_2.code === "P2002") {
                    res.status(400).json({ message: "Email already in use" });
                    return [2 /*return*/];
                }
                res.status(500).json({ message: error_2.message || "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.UpdateUser = UpdateUser;
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, existingUser, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                        where: { id: userId }
                    })];
            case 1:
                existingUser = _b.sent();
                if (!existingUser) {
                    return [2 /*return*/, res.status(404).json({ message: "User not found." })];
                }
                return [4 /*yield*/, prisma_1.prisma.user.delete({
                        where: { id: userId }
                    })];
            case 2:
                _b.sent();
                res.status(200).json({ message: "User deleted successfully." });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                console.error("DeleteUser error:", error_3);
                res.status(500).json({
                    message: error_3 instanceof Error ? error_3.message : "Internal server error."
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
var uploadProfilePicture = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var imageUrl, userId, user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.file) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ success: false, message: "No file uploaded" })];
                }
                imageUrl = req.file.path;
                userId = req.params.userId;
                return [4 /*yield*/, prisma_1.prisma.user.update({
                        where: { id: userId },
                        data: { profile_pic: imageUrl }
                    })];
            case 1:
                user = _a.sent();
                res
                    .status(200)
                    .json({ message: "Profile Picture uploaded successfully", user: user });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500).json({
                    success: false,
                    message: error_4 instanceof Error ? error_4.message : "Unknown error"
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.uploadProfilePicture = uploadProfilePicture;
var getAllUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_5, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma_1.prisma.user.findMany()];
            case 1:
                users = _a.sent();
                res.status(200).json({
                    message: "User data fetched successfully.",
                    users: users
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error("Error fetching users:", error_5);
                message = error_5 instanceof Error ? error_5.message : "Internal server error";
                res.status(500).json({ message: message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllUser = getAllUser;
var getUserByid = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_6, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                        where: { id: req.params.id },
                        include: {
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
                            videos: true
                        }
                    })];
            case 1:
                user = _a.sent();
                res.status(200).json({
                    message: "User data fetched successfully.",
                    user: user
                });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error("Error fetching users:", error_6);
                message = error_6 instanceof Error ? error_6.message : "Internal server error";
                res.status(500).json({ message: message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserByid = getUserByid;
var searchUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, users, error_7, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = req.query.q;
                if (!query || query.trim() === "") {
                    return [2 /*return*/, res.status(400).json({ message: "Search query is required" })];
                }
                return [4 /*yield*/, prisma_1.prisma.user.findMany({
                        where: {
                            OR: [
                                {
                                    name: {
                                        contains: query,
                                        mode: "insensitive"
                                    }
                                },
                                {
                                    email: {
                                        contains: query,
                                        mode: "insensitive"
                                    }
                                }
                            ]
                        },
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profile_pic: true
                        }
                    })];
            case 1:
                users = _a.sent();
                res.status(200).json({ message: "Search results", users: users });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error("Error fetching users:", error_7);
                message = error_7 instanceof Error ? error_7.message : "Internal server error";
                res.status(500).json({ message: message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.searchUser = searchUser;
