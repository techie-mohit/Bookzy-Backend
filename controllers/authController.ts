import { Request, Response } from "express";
import User from "../models/User";
import { response } from "../utils/responseHandler";
import crypto from "crypto";
import { sendVerificationToEmail } from "../config/emailConfig";

export const register = async(req:Request, res:Response)=>{
    try {
        const {name, email, password, agreeToTerms} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return response(res, 400, "User already exists with this email");
        }

        const verificationToken = crypto.randomBytes(20).toString('hex');
        console.log("Verification Token:", verificationToken);

        const user = new User({name, email, password, agreeToTerms, verificationToken});
        await user.save();

        const result = await sendVerificationToEmail(user.email, verificationToken);
        console.log("Email sent successfully:", result);

        return response(res, 200, "User Registration Successful, Please Check Your Email for Verification Link");
        
    } catch (error) {
        console.log("Error in register:", error);
        return response(res, 500, "Internal Server Error, Please Try Again Later");
        
    }

}