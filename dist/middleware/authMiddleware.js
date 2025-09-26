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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandler_1 = require("../utils/responseHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateMidddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return (0, responseHandler_1.response)(res, 401, "User not autheticated or token not available");
        }
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return (0, responseHandler_1.response)(res, 401, "Invalid token or user not authenticated");
        }
        req.id = decode.userId;
        next();
    }
    catch (error) {
        console.log("Error in authentication middleware:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error, Please Try Again Later");
    }
});
exports.default = authenticateMidddleware;
