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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = exports.resetPassword = exports.requestPasswordReset = exports.login = exports.register = void 0;
var prisma_1 = require("../utils/prisma");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var crypto_1 = __importDefault(require("crypto"));
var sendEmail_1 = require("../utils/sendEmail");
var env_1 = require("../config/env");
var google_auth_library_1 = require("google-auth-library");
var client = new google_auth_library_1.OAuth2Client(env_1.GOOGLE_CLIENT_ID);
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, password, existingUser, hashedPassword, user, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, name_1 = _a.name, email = _a.email, password = _a.password;
                return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                        where: { email: email }
                    })];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    res.status(400).json({ message: "Email already registered" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, prisma_1.prisma.user.create({
                        data: __assign({ email: email, password: hashedPassword !== null && hashedPassword !== void 0 ? hashedPassword : "" }, (name_1 && { name: name_1 }))
                    })];
            case 3:
                user = _b.sent();
                if (!env_1.SECRET_KEY) {
                    console.error("JWT_SECRET is not set in the environment variables");
                    res.status(500).json({ message: "Internal server error" });
                    return [2 /*return*/];
                }
                token = jsonwebtoken_1.default.sign({ userId: user.id, name: user.name, email: user.email }, env_1.SECRET_KEY, {
                    expiresIn: "7d"
                });
                res.status(200).json({ message: "User successfully registered", token: token });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.error(error_1);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, _b, token, error_2;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    res.status(400).json({ message: "Email and password are required" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, prisma_1.prisma.user.findUnique({ where: { email: email } })];
            case 1:
                user = _d.sent();
                _b = !user;
                if (_b) return [3 /*break*/, 3];
                return [4 /*yield*/, bcryptjs_1.default.compare(password, (_c = user.password) !== null && _c !== void 0 ? _c : "")];
            case 2:
                _b = !(_d.sent());
                _d.label = 3;
            case 3:
                if (_b) {
                    res.status(401).json({ message: "Invalid credentials" });
                    return [2 /*return*/];
                }
                if (!env_1.SECRET_KEY) {
                    console.error("JWT_SECRET is not set in the environment variables");
                    res.status(500).json({ message: "Internal server error" });
                    return [2 /*return*/];
                }
                token = jsonwebtoken_1.default.sign({ userId: user.id, name: user.name, email: user.email }, env_1.SECRET_KEY, {
                    expiresIn: "7d"
                });
                res.status(200).json({ message: "Login successful", token: token });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _d.sent();
                console.error("Login Error:", error_2);
                res.status(500).json({
                    message: error_2 instanceof Error ? error_2.message : "Error logging in"
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var requestPasswordReset = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, token, expiry, resetLink, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                email = req.body.email;
                if (!email)
                    return [2 /*return*/, res.status(400).json({ message: "Email is required" })];
                return [4 /*yield*/, prisma_1.prisma.user.findUnique({ where: { email: email } })];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                token = crypto_1.default.randomBytes(32).toString("hex");
                expiry = new Date(Date.now() + 1000 * 60 * 15);
                return [4 /*yield*/, prisma_1.prisma.user.update({
                        where: { email: email },
                        data: {
                            resetToken: token,
                            resetTokenExpiry: expiry
                        }
                    })];
            case 2:
                _a.sent();
                resetLink = "".concat(env_1.BASE_URL, "/reset-redirect?token=").concat(token);
                return [4 /*yield*/, sendEmail_1.transporter.sendMail({
                        from: "\"Jay\" <".concat(env_1.EMAIL_USER, ">"),
                        to: email,
                        subject: "Password Reset Link",
                        html: "\n        <h2>Password Reset</h2>\n        <p>Click the link below to reset your password:</p>\n        <a href=\"".concat(resetLink, "\">").concat(resetLink, "</a>\n        <p>This link will expire in 15 minutes.</p>\n      ")
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "Reset link sent to your email" })];
            case 4:
                error_3 = _a.sent();
                console.error("Reset Error:", error_3.message);
                return [2 /*return*/, res.status(500).json({ message: "Something went wrong" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.requestPasswordReset = requestPasswordReset;
var resetPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, token, newPassword, user, hashedPassword, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, token = _a.token, newPassword = _a.newPassword;
                if (!token || !newPassword) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Token and new password are required" })];
                }
                return [4 /*yield*/, prisma_1.prisma.user.findFirst({
                        where: {
                            resetToken: token,
                            resetTokenExpiry: {
                                gte: new Date()
                            }
                        }
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Invalid or expired reset token" })];
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(newPassword, 10)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, prisma_1.prisma.user.update({
                        where: { id: user.id },
                        data: {
                            password: hashedPassword,
                            resetToken: null,
                            resetTokenExpiry: null
                        }
                    })];
            case 3:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: "Password reset successful" })];
            case 4:
                error_4 = _b.sent();
                console.error("Reset password error:", error_4);
                return [2 /*return*/, res.status(500).json({ message: "Something went wrong" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
var googleLogin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var idToken, ticket, payload, email, name_2, picture, existingUser, newUser, token, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                idToken = req.body.idToken;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, client.verifyIdToken({
                        idToken: idToken,
                        audience: env_1.GOOGLE_CLIENT_ID
                    })];
            case 2:
                ticket = _a.sent();
                payload = ticket.getPayload();
                if (!payload)
                    return [2 /*return*/, res.status(401).send("Invalid token")];
                email = payload.email, name_2 = payload.name, picture = payload.picture;
                return [4 /*yield*/, prisma_1.prisma.user.findUnique({ where: { email: email } })];
            case 3:
                existingUser = _a.sent();
                if (existingUser) {
                    res.status(400).json({ message: "Email already registered" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, prisma_1.prisma.user.create({
                        data: __assign({ email: email !== null && email !== void 0 ? email : "", profile_pic: picture !== null && picture !== void 0 ? picture : "" }, (name_2 && { name: name_2 }))
                    })];
            case 4:
                newUser = _a.sent();
                token = jsonwebtoken_1.default.sign({ userId: newUser.id, name: newUser.name, email: newUser.email }, env_1.SECRET_KEY, {
                    expiresIn: "7d"
                });
                res.status(200).json({ message: "User successfully Signup", token: token });
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                console.error(err_1);
                return [2 /*return*/, res.status(500).send("Login failed")];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.googleLogin = googleLogin;
