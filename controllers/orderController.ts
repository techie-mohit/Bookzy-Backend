import { Request, Response } from "express";
import CardItems from "../models/CartItems";
import { response } from "../utils/responseHandler";
import Order from "../models/Order";
import Razorpay from "razorpay";
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const razorpay  = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})



export const  createOrUpadateOrder = async(req:Request, res:Response)=>{

    try {
        const userId = req.id;

    const {orderId, shippingAddress, paymentMethod, paymentDetails, totalAmount} = req.body;

    const cart = await CardItems.findOne({user:userId}).populate("items.product");
    if(!cart || cart.items.length == 0){
        return response(res, 400, 'Cart is Empty');

    }

    let order = await Order.findOne({_id : orderId});
    if(order){
        order.shippingAddress = shippingAddress || order.shippingAddress,
        order.paymentMethod = paymentMethod || order.paymentMethod,
        order.totalAmount = totalAmount || order.totalAmount;
        if(paymentDetails){
            order.paymentDetails = paymentDetails;
            order.paymentStatus = 'complete';
            order.status = 'processing';
        } 
    }

    else{
        order = new Order({
            user: userId,
            items: cart.items,
            shippingAddress,
            paymentMethod,
            paymentDetails,
            totalAmount,
            paymentStatus: paymentDetails ? 'complete' : 'pending',
        });
    }

    await order.save();
    if(paymentDetails){
        await CardItems.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } }
        )
    }
    return response(res, 200, 'Order created/updated successfully', order);
        
    } catch (error) {
        console.log(error);
        return response(res, 500, 'Internal Server Error');
    }

}


export const getOrderByUserId = async(req:Request, res:Response)=>{
    try {
        const userId = req.id;
        const orders = await Order.find({ user: userId })
        .sort({createdAt: -1})
         .populate("user", "name email").populate("shippingAddress").populate({
               path: "items.product",
               model: "Products"
           });


        if(!orders || orders.length === 0){
            return response(res, 404, "No orders found for this user");
        }   
        return response(res, 200, "Orders fetched successfully", orders);
    } catch (error) {
        console.log("Error in fetching orders", error);
        return response(res, 500, "Internal Server Error");
    }
}


export const getOrderById = async(req:Request, res:Response)=>{
    try {
        const orderId = req.params.id;

        if(!orderId){
            return response(res, 400, "Order ID is required");
        }

        const order = await Order.findById(orderId)
           .populate("user", "name email").populate("shippingAddress").populate({
               path: "items.product",
               model: "Products"
           });

        if(!order){
            return response(res, 404, "Order not found");
        }

        return response(res, 200, "Order fetched By Id Successfully", order);

    } catch (error) {
        console.log("Error in fetching order by ID", error);
        return response(res, 500, "Internal Server Error");
    }
}


export const createPaymentWithRazorpay = async(req:Request, res: Response)=>{
    try {
        const {orderId} = req.body;
        const order = await Order.findById(orderId);

        if(!order){
            return response(res, 404, "Order not found");
        }

        const razorpayOrder = await razorpay.orders.create({
            amount:Math.round(order.totalAmount * 100),
            currency: "INR",
            receipt: order?._id.toString()
        })

        return response(res, 200, "Razorpay order created successfully", {order:razorpayOrder});
    } catch (error) {
        console.log("Error in creating Razorpay order", error);
        return response(res, 500, "Internal Server Error");
    }
}


export const handleRazorpayWebhook = async(req:Request, res:Response)=>{

    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

    const shasum = crypto.createHmac('sha256', secret)
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if(digest === req.headers['x-razorpay-signature']){
        const paymentId = req.body.payload.payment.entity.id;
        const orderId = req.body.payload.payment.entity.order.id;

        await Order.findOneAndUpdate(
            {'paymentDetails.razorpay_order_id' : orderId},
            {
                paymentStatus: 'complete',
                status: 'processing',
                'paymentDetails.razorpay_payment_id': paymentId,
            }
        )

        return response(res, 200, "Razorpay webhook handled successfully");


    }
    else{
        return response(res, 400, "Invalid Razorpay webhook signature");
    }
    } catch (error) {
        console.log("Error in handling Razorpay webhook", error);
        return response(res, 500, "Internal Server Error");
    }
} 