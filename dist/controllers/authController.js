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
exports.checkUserAuth = exports.logout = exports.resetPassword = exports.forgotPassword = exports.login = exports.verifyEmail = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const responseHandler_1 = require("../utils/responseHandler");
const crypto_1 = __importDefault(require("crypto"));
const emailConfig_1 = require("../config/emailConfig");
const generateToken_1 = require("../utils/generateToken");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, agreeToTerms } = req.body;
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return (0, responseHandler_1.response)(res, 400, "User already exists with this email");
        }
        const verificationToken = crypto_1.default.randomBytes(20).toString("hex");
        const user = new User_1.default({ name, email, password, agreeToTerms, verificationToken });
        yield user.save();
        const result = yield (0, emailConfig_1.sendVerificationToEmail)(user.email, verificationToken);
        console.log("Email sent successfully:", result); // will log nodemailer info (e.g., messageId)
        return (0, responseHandler_1.response)(res, 200, "User Registration Successful, Please Check Your Email for Verification Link");
    }
    catch (error) {
        console.log("Error in register:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error, Please Try Again Later");
    }
});
exports.register = register;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        console.log("Verification token:", token);
        const user = yield User_1.default.findOne({ verificationToken: token });
        if (!user) {
            return (0, responseHandler_1.response)(res, 400, "Invalid or Expired Verification Token");
        }
        user.isVerified = true;
        user.verificationToken = undefined; // Clear the token after verification
        const accessToken = (0, generateToken_1.generateToken)(user);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days    
        });
        yield user.save();
        return (0, responseHandler_1.response)(res, 200, "Email Verified Successfully, You Can Now Log In");
    }
    catch (error) {
        console.log("Error in verifyEmail:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error, Please Try Again Later");
    }
});
exports.verifyEmail = verifyEmail;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user || !(yield user.comparePassword(password))) {
            return (0, responseHandler_1.response)(res, 400, "Invalid email or password");
        }
        if (!user.isVerified) {
            return (0, responseHandler_1.response)(res, 400, "Please verify your email before logging in");
        }
        const accessToken = (0, generateToken_1.generateToken)(user);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days    
        });
        return (0, responseHandler_1.response)(res, 200, "User Logged In Successfully", { user: { name: user.name, email: user.email } });
    }
    catch (error) {
        console.log("Error in verifyEmail:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error, Please Try Again Later");
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return (0, responseHandler_1.response)(res, 404, "User not found and No Account found with this email address");
        }
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 hour
        yield user.save();
        yield (0, emailConfig_1.sendResetPasswordLinkToEmail)(user.email, resetToken);
        return (0, responseHandler_1.response)(res, 200, "Reset Password Link Sent to Your Email");
    }
    catch (error) {
        console.log("Error in forgotPassword:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error, Please Try Again Later");
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        const { newPassword } = req.body;
        const user = yield User_1.default.findOne({ resetPasswordToken: token,
            resetPasswordExpire: { $gt: new Date() } });
        if (!user) {
            return (0, responseHandler_1.response)(res, 400, "Invalid or Expired Reset Token");
        }
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save();
        return (0, responseHandler_1.response)(res, 200, "Password Reset Successfully, You Can Now Log In");
    }
    catch (error) {
        console.log("Error in forgotPassword:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error, Please Try Again Later");
    }
});
exports.resetPassword = resetPassword;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        return (0, responseHandler_1.response)(res, 200, "User Logged Out Successfully");
    }
    catch (error) {
        console.log("Error in logout:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error, Please Try Again Later");
    }
});
exports.logout = logout;
const checkUserAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 401, "Unauthenticated User");
        }
        const user = yield User_1.default.findById(userId).select("-password -verificationToken -resetPasswordToken -resetPasswordExpire");
        if (!user) {
            return (0, responseHandler_1.response)(res, 404, "User not found");
        }
        return (0, responseHandler_1.response)(res, 200, "User Authenticated Successfully", user);
    }
    catch (error) {
        console.log("Error in checkUserAuth:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error, Please Try Again Later");
    }
});
exports.checkUserAuth = checkUserAuth;
