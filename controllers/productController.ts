import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import { uploadToCloudinary } from "../config/cloudinaryConfig";
import Products from "../models/Products";

export const createProduct = async(req:Request, res:Response) =>{

    try {
        const { title, subject, category, condition, classType, price, author, edition, description, finalPrice, shippingCharge, paymentMode, paymentDetails } = req.body;
    const sellerId = req.id;

    const images = req.files as Express.Multer.File[];

    if(!images || images.length === 0){
        return response(res, 400, "No images uploaded , Images are required");
    }

    let parsedPaymentDetails = JSON.parse(paymentDetails);

    if(paymentMode === "UPI" && (!parsedPaymentDetails || !parsedPaymentDetails.upiId)){
        return response(res, 400, "UPI payment mode requires UPI ID in payment details");
    }

    if(paymentMode === "Bank Account" && (!parsedPaymentDetails || !parsedPaymentDetails.bankDetails ||
          !parsedPaymentDetails.bankDetails.accountNumber ||
          !parsedPaymentDetails.bankDetails.ifscCode || 
          !parsedPaymentDetails.bankDetails.bankName
        )){
        return response(res, 400, "Bank Account payment mode requires complete bank details in payment details");
    }

    const uploadPromise = images.map(file => uploadToCloudinary(file as any));
    const uploadImages = await Promise.all(uploadPromise);
    const imageUrl = uploadImages.map(image => image.secure_url);

    const product = new Products({
        title,
        images: imageUrl,
        subject,
        category,
        condition,
        classType,
        price,
        author,
        edition,
        description,
        finalPrice,
        shippingCharge,
        seller : sellerId,
        paymentMode,
        paymentDetails: parsedPaymentDetails
    })

    await product.save();
    return response(res, 200, "Product Created Successfully", product)

        
    } catch (error) {
        console.log("Error in Product", error);
        return response(res, 500, "Internal Server Error");
        
    }

}