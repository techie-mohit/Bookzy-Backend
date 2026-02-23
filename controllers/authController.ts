import { Request, Response } from "express";
import User from "../models/User";
import { response } from "../utils/responseHandler";
import crypto from "crypto";
import { sendResetPasswordLinkToEmail, sendVerificationToEmail } from "../config/emailConfig";
import { generateToken } from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, agreeToTerms, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response(res, 400, "User already exists with this email");
        }

        const verificationToken = crypto.randomBytes(20).toString("hex");

        const user = new User({ name, email, password, agreeToTerms, verificationToken, role: role || "user" });
        await user.save();

        const result = await sendVerificationToEmail(user.email, verificationToken);
        console.log("Email sent successfully:", result); // will log nodemailer info (e.g., messageId)

        return response(res, 200, "User Registration Successful, Please Check Your Email for Verification Link");
    } catch (error) {
        console.log("Error in register:", error);
        return response(res, 500, "Internal Server Error, Please Try Again Later");
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const token = req.params.token;
        console.log("Verification token:", token);
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return response(res, 400, "Invalid or Expired Verification Token");
        }

        user.isVerified = true;
        user.verificationToken = undefined; // Clear the token after verification

        const accessToken = generateToken(user);
        res.cookie("accessToken", accessToken, {
            httpOnly:true,
            sameSite: 'none',
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days    
        })

        await user.save();
        return response(res, 200, "Email Verified Successfully, You Can Now Log In");

    } catch (error) {
        console.log("Error in verifyEmail:", error);
        return response(res, 500, "Internal Server Error, Please Try Again Later");

    }

}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return response(res, 400, "Invalid email or password");
        }

        if(user.role !== "admin" && !user.isVerified){
            return response(res, 400, "Please verify your email before logging in");
        }

        const accessToken = generateToken(user);
        res.cookie("accessToken", accessToken, {
            httpOnly:true,
            sameSite: 'none',
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days    
        })

        return response(res, 200, "User Logged In Successfully", {user:{name: user.name, email: user.email, role: user.role}});

    } catch (error) {
        console.log("Error in verifyEmail:", error);
        return response(res, 500, "Internal Server Error, Please Try Again Later");

    }

}

export const forgotPassword = async(req:Request, res:Response)=>{
    try {

        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return response(res, 404, "User not found and No Account found with this email address");
        }

        const resetToken  = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        await sendResetPasswordLinkToEmail(user.email, resetToken);

        return response(res, 200, "Reset Password Link Sent to Your Email");
        
    } catch (error) {
        console.log("Error in forgotPassword:", error);
        return response(res, 500, "Internal Server Error, Please Try Again Later");
        
    }
}

export const resetPassword = async(req:Request, res:Response)=>{
    try {

        const token = req.params.token;
        const {newPassword} = req.body;

        const user = await User.findOne({ resetPasswordToken: token, 
            resetPasswordExpire: { $gt: new Date() } });

        if (!user) {
            return response(res, 400, "Invalid or Expired Reset Token");
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return response(res, 200, "Password Reset Successfully, You Can Now Log In");
        
    } catch (error) {
        console.log("Error in forgotPassword:", error);
        return response(res, 500, "Internal Server Error, Please Try Again Later");
        
    }
    
}

export const logout = async(req: Request, res: Response) => {
    try{
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        return response(res, 200, "User Logged Out Successfully");
    }
    catch(error){
        console.log("Error in logout:", error);
        return response(res, 500, "Internal Server Error, Please Try Again Later");
    }
}


export const checkUserAuth = async(req: Request, res: Response) => {
   try{
     const userId = req.id;
     if(!userId){
        return response(res, 401, "Unauthenticated User");
     }

     const user = await User.findById(userId).select("-password -verificationToken -resetPasswordToken -resetPasswordExpire");
     if(!user){
        return response(res, 404, "User not found");
     }

     return response(res, 200, "User Authenticated Successfully", user);

   }
   catch(error){
        console.log("Error in checkUserAuth:", error);
        return response(res, 500, "Internal Server Error, Please Try Again Later");
   }


}