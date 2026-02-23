import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


const transport = nodemailer.createTransport({
    service:"gmail",
    
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS

    },
});




transport.verify((error, success)=>{
    if(error){
        console.log("Gmail Service is not ready to send email , please check the email configuration");
    }else{
        console.log("Gmail Service is ready to send email");
    }
})

const sendEmail = async(to:string, subject:string, body:string)=>{
    return await transport.sendMail({
        from: `"Your Bookzy" <${process.env.EMAIL_USER}>`, // Sender address
        to,
        subject,
        html: body, // HTML body content
    })
}


export const sendVerificationToEmail = async(to:string, verificationToken:string)=>{
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const subject = "Please Verify Your Email for Your Bookzy Account";
    const html = `
        <h1>Welcome to Your Bookzy! Verify Your Email</h1>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email </a>
        <p>If you did not create an account or did not request this email or already verified your email, please ignore this email.</p>
    `;

     const response = await sendEmail(to, subject, html);

    // return what sendEmail gives OR a custom message
    return response || { success: true, message: "Verification email sent successfully" };
}

export const sendResetPasswordLinkToEmail = async(to:string, resetToken:string)=>{
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const subject = "Please Reset Your Password for Your Bookzy Account";
    const html = `
        <h1>Reset Your Password</h1>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
    `;

    const response = await sendEmail(to, subject, html);
    return response || { success: true, message: "Reset password email sent successfully" };
}