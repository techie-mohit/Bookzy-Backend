"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = void 0;
const response = (res, statusCode, message, data) => {
    res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300,
        message: message,
        data: data || null // If no data is provided, default to null
    });
};
exports.response = response;
