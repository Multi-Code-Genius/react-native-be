"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.deleteRoom = exports.findOrCreateRoom = void 0;
var prisma_1 = require("../utils/prisma");
var findOrCreateRoom = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, latitude, longitude, platform, userId, nearbyRooms, roomWithUsers, availableRoom, isAlreadyJoined, userCount, totalUsers, room, newRoom, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, latitude = _a.latitude, longitude = _a.longitude, platform = _a.platform;
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                if (!latitude || !longitude || !platform) {
                    return [2 /*return*/, res.status(400).json({ message: "Missing required fields." })];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 13, , 14]);
                return [4 /*yield*/, prisma_1.prisma.room.findMany({
                        where: {
                            status: "open",
                            location: {
                                path: ["lat"],
                                gte: latitude - 0.1,
                                lte: latitude + 0.1
                            },
                            AND: {
                                location: {
                                    path: ["lng"],
                                    gte: longitude - 0.1,
                                    lte: longitude + 0.1
                                }
                            }
                        },
                        include: {
                            RoomUser: {
                                include: {
                                    User: true
                                }
                            }
                        }
                    })];
            case 2:
                nearbyRooms = _c.sent();
                roomWithUsers = nearbyRooms.map(function (room) { return (__assign(__assign({}, room), { users: room.RoomUser.map(function (ru) { return ru.User; }) })); });
                availableRoom = roomWithUsers.find(function (room) { return room.users.length < room.capacity; });
                if (!availableRoom) return [3 /*break*/, 11];
                return [4 /*yield*/, prisma_1.prisma.roomUser.findFirst({
                        where: {
                            userId: userId,
                            roomId: availableRoom.id
                        }
                    })];
            case 3:
                isAlreadyJoined = _c.sent();
                if (!!isAlreadyJoined) return [3 /*break*/, 6];
                return [4 /*yield*/, prisma_1.prisma.roomUser.create({
                        data: {
                            userId: userId,
                            roomId: availableRoom.id
                        }
                    })];
            case 4:
                _c.sent();
                userCount = availableRoom.users.length + 1;
                if (!(userCount >= availableRoom.capacity)) return [3 /*break*/, 6];
                return [4 /*yield*/, prisma_1.prisma.room.update({
                        where: { id: availableRoom.id },
                        data: { status: "full" }
                    })];
            case 5:
                _c.sent();
                _c.label = 6;
            case 6: return [4 /*yield*/, prisma_1.prisma.roomUser.count({
                    where: { roomId: availableRoom.id }
                })];
            case 7:
                totalUsers = _c.sent();
                if (!(totalUsers >= availableRoom.capacity)) return [3 /*break*/, 9];
                return [4 /*yield*/, prisma_1.prisma.room.update({
                        where: { id: availableRoom.id },
                        data: { status: "full" }
                    })];
            case 8:
                _c.sent();
                _c.label = 9;
            case 9: return [4 /*yield*/, prisma_1.prisma.room.findUnique({
                    where: { id: availableRoom.id },
                    include: {
                        RoomUser: {
                            include: {
                                User: true
                            }
                        }
                    }
                })];
            case 10:
                room = _c.sent();
                return [2 /*return*/, res.status(200).json({
                        room: room,
                        joined: true,
                        message: "Joined existing room"
                    })];
            case 11: return [4 /*yield*/, prisma_1.prisma.room.create({
                    data: {
                        platform: platform,
                        location: {
                            lat: latitude,
                            lng: longitude
                        },
                        capacity: 3,
                        status: "open",
                        RoomUser: {
                            create: {
                                userId: userId
                            }
                        }
                    },
                    include: {
                        RoomUser: {
                            include: {
                                User: true
                            }
                        }
                    }
                })];
            case 12:
                newRoom = _c.sent();
                return [2 /*return*/, res.status(200).json({
                        room: newRoom,
                        created: true,
                        message: "New Room created and joined"
                    })];
            case 13:
                error_1 = _c.sent();
                console.error("Error finding or creating room:", error_1);
                return [2 /*return*/, res.status(500).json({ message: error_1.message || "Server error" })];
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.findOrCreateRoom = findOrCreateRoom;
var deleteRoom = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var roomId, room, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                roomId = req.params.roomId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma_1.prisma.room.delete({
                        where: { id: roomId }
                    })];
            case 2:
                room = _a.sent();
                if (!room) {
                    res.status(500).json({ message: "Room Does not Exit" });
                }
                res.status(200).json({ message: "Room deleted successfully" });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error("Error deleting room:", error_2);
                res
                    .status(500)
                    .json({ message: error_2.message || "Server error while deleting room" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteRoom = deleteRoom;
