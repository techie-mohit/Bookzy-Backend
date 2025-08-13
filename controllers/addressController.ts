import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Address from "../models/Address";
import User from "../models/User";

export const createOrUpdateAddressByUserId = async(req:Request, res:Response)=>{
    try {
        const userId = req.id;
        const {addressLine1, addressLine2, phoneNumber, city, state, pincode, addressId} = req.body;

        if(!userId){
            return response(res, 400, "User Not Found, Please a provide a valid id");
        }

        if(!addressLine1 || !phoneNumber || !city || !state || !pincode){
            return response(res, 400, "Please provide all required fields");
        }

        if(addressId){
            const existingAddress = await Address.findById(addressId);
            if(!existingAddress){
                return response(res, 404, "Address Not Found");
            }
            existingAddress.addressLine1 = addressLine1;
            existingAddress.addressLine2 = addressLine2;
            existingAddress.phoneNumber = phoneNumber;
            existingAddress.city = city;
            existingAddress.state = state;
            existingAddress.pincode = pincode;
            await existingAddress.save();
            return response(res, 200, "Address Updated Successfully");
        } else {
            const newAddress = new Address({
                user:userId,
                addressLine1,
                addressLine2,
                phoneNumber,
                city,
                state,
                pincode
            });
            await newAddress.save();

            await User.findByIdAndUpdate(
                userId, 
                { $push: { addresses: newAddress._id }},
                {new: true}
            )
            return response(res, 201, "Address Created Successfully", newAddress);
        }
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