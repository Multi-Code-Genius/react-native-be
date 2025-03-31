"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorHandler = function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
};
exports.default = errorHandler;
