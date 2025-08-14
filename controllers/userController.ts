import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import User from "../models/User";

export const updateUserProfile = async(req:Request, res:Response)=>{
    try {
        const {userId} = req.params;
        // const userId = req.params.userId;

        if(!userId){
            return response(res, 400, "User Id is required");
        }

        const {name, email, phoneNumber} = req.body;


        const updateUser = await User.findByIdAndUpdate(userId, {
            name, email, phoneNumber},
            {new:true, runValidators: true}
        ).select("-password -verificationToken -resetPasswordToken -resetPasswordExpire");

        if(!updateUser){
            return response(res, 404, "User Not Found");
        }

        return response(res, 200, "User Profile  Updated Successfully", updateUser);
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error");
    }
}


export const getAddressByUserId = async(req:Request, res:Response)=>{
    try {
        const userId = req.id;
        if(!userId){
            return response(res, 400, "User Not Found, Please a provide a valid id");
        }

        const address = await User.findById(userId).populate('address');
        if(!address){
            return response(res, 400, 'User Address Not found');
        }

        return response(res, 200, "User Address Get  Successfully", address);
    } catch (error) {
         console.log(error);
        return response(res, 500, "Internal Server Error");   
    }
}