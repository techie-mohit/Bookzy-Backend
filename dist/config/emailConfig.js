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
exports.sendResetPasswordLinkToEmail = exports.sendVerificationToEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transport = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});
transport.verify((error, success) => {
    if (error) {
        console.log("Gmail Service is not ready to send email , please check the email configuration");
    }
    else {
        console.log("Gmail Service is ready to send email");
    }
});
const sendEmail = (to, subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transport.sendMail({
        from: `"Your Bookzy" <${process.env.EMAIL_USER}>`, // Sender address
        to,
        subject,
        html: body, // HTML body content
    });
});
const sendVerificationToEmail = (to, verificationToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const subject = "Please Verify Your Email for Your Bookzy Account";
    const html = `
        <h1>Welcome to Your Bookzy! Verify Your Email</h1>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email </a>
        <p>If you did not create an account or did not request this email or already verified your email, please ignore this email.</p>
    `;
    const response = yield sendEmail(to, subject, html);
    // return what sendEmail gives OR a custom message
    return response || { success: true, message: "Verification email sent successfully" };
});
exports.sendVerificationToEmail = sendVerificationToEmail;
const sendResetPasswordLinkToEmail = (to, resetToken) => __awaiter(void 0, void 0, void 0, function* () {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const subject = "Please Reset Your Password for Your Bookzy Account";
    const html = `
        <h1>Reset Your Password</h1>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
    `;
    const response = yield sendEmail(to, subject, html);
    return response || { success: true, message: "Reset password email sent successfully" };
});
exports.sendResetPasswordLinkToEmail = sendResetPasswordLinkToEmail;
