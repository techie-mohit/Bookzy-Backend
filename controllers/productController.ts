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

    let parsedPaymentDetails = typeof paymentDetails === "string" ? JSON.parse(paymentDetails) : paymentDetails;

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


export const getAllProducts = async(req:Request, res:Response)=>{
    try {
        const products = await Products.find()
        .sort({createdAt: -1})
        .populate('seller', 'name email');

        return response(res, 200, "Products fetched successfully", products);
    } catch (error) {
        console.log("Error in fetching products", error);
        return response(res, 500, "Internal Server Error");
    }
}


export const getProductById = async(req:Request, res:Response)=>{
    try {
        const productId = req.params.id;

        if(!productId){
            return response(res, 400, "Product ID is required");
        }

        const product = await Products.findById(productId)
            .populate({
                path:"seller",
                select:"name email profilePicture phoneNumber addresses",
                populate:{
                    path:"addresses",
                    select:"Address"

                }
            });

        if(!product){
            return response(res, 404, "Product not found");
        }

        return response(res, 200, "Product fetched By Id Successfully", product);
        
    } catch (error) {
        console.log("Error in fetching product by ID", error);
        return response(res, 500, "Internal Server Error");
    }
}


export const deleteProduct = async(req:Request, res:Response)=>{
    try {
        const productId = req.params.productId;

        if(!productId){
            return response(res, 400, "Product ID is required");
        }

        const product = await Products.findByIdAndDelete(productId);

        if(!product){
            return response(res, 404, "Product not found");
        }

        return response(res, 200, "Product deleted successfully");
        
    } catch (error) {
        console.log("Error in deleting product", error);
        return response(res, 500, "Internal Server Error");
    }
}


export const getProductBySellerId = async(req:Request, res:Response)=>{
    try {
        const sellerId = req.params.sellerId;

        if(!sellerId){
            return response(res, 400, "Seller ID is required");
        }

        const products = await Products.find({ seller: sellerId })
            .sort({ createdAt: -1 })
            .populate('seller', 'name email profilePicture phoneNumber addresses');

        if(products.length === 0){
            return response(res, 404, "No products found for this seller");
        }

        return response(res, 200, "Products fetched by seller Id successfully", products);

    } catch (error) {
        console.log("Error in fetching products by seller ID", error);
        return response(res, 500, "Internal Server Error");
    }
}