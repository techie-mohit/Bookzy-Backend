import { Request, Response } from "express";
import SellerPayment from "../models/SellerPayment";
import Order from "../models/Order";
import { response } from "../utils/responseHandler";
import path from "path";
import User from "../models/User";
import Products from "../models/Products";
import { MongoBatchReExecutionError } from "mongodb";


export const getAllOrders = async(req:Request, res:Response) =>{
    try {
        const {status, paymentStatus, startDate, endDate} = req.query;

        const query: any = {};

        if(status){
            query.status = status;
        }
        if(paymentStatus){
            query.paymentStatus = paymentStatus;
        }

        if(startDate && endDate){
            query.createdAt = {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string)
            }
        }

        const orders = await Order.find(query)
        .populate({
            path:"items.product",
            populate:{
                path:"seller",
                select:"name email phoneNumber paymentMode paymentDetails"
            }
        })
        .populate("user", "name email")
        .populate("shippingAddress")
        .sort({ createdAt: -1 });

        return response(res, 200, "Orders fetched successfully", {orders});

    } catch (error) {
        console.log("Error in getAllOrders controller:", error);
        return response(res, 500, "Internal Server Error, Please Try Again Later");
        
    }
}

export const updateOrder = async(req:Request, res:Response) =>{
    try {
        const {id} = req.params;
        const {status, paymentStatus, notes} = req.body;

        const order = await Order.findById(id);
        if(!order){
            return response(res, 404, "Order not found");
        }

        if(status){
            order.status = status;
        }
        if(paymentStatus){
            order.paymentStatus = paymentStatus;
        }

        if(notes){
            order.notes = notes;
        }
        await order.save();
        return response(res, 200, "Order updated successfully", order);
    } catch (error) {
        console.log("Error in updateOrder controller:", error);
        return response(res, 500, "Internal Server Error, Please Try Again Later");
    }
}

export const processSellerPayment = async(req:Request, res:Response) =>{
    try {
        const {orderId} = req.params;
        const {productId, amount, notes,  paymentMethod} = req.body;
        const user =req.id;

        if( !productId || !amount || !paymentMethod){
            return response(res, 400, "All fields are required to process payment");
        }

        const order = await Order.findById(orderId).populate({
            path : "items.product",
            populate:{
                path:"seller",
            }
        })

        if(!order){
            return response(res, 404, "Order not found");
        }

        // find the specific product in the order items
        const orderItem = order.items.find(item => item.product._id.toString() === productId);

        if(!orderItem){
            return response(res, 404, "Product not found in the order");
        }

        const seller = (orderItem.product as any).seller;
        if(!seller || !seller._id){
            return response(res, 404, "Seller not found for this product");
        }

        const sellerPayment = new SellerPayment({
            seller : seller._id,
            order : orderId,
            product : productId,
            amount,
            paymentMethod,
            paymentStatus : "complete",
            processedBy: user,
            notes
        })
        await sellerPayment.save();
        return response(res, 200, "Seller payment processed successfully", sellerPayment);

    } catch (error:any) {
        console.log("Error in processSellerPayment controller:", error?.message || error);
        console.log("Full error:", JSON.stringify(error, null, 2));
        return response(res, 500, error?.message || "Internal Server Error, Please Try Again Later");
        
    }
}


export const getDashboardStats = async(req:Request, res:Response) =>{
    try {
        const [totalOrders, totalUsers, totalProducts, statusCounts, recentOrders, revenue, monthlySales] = await Promise.all([
                Order.countDocuments(),
                User.countDocuments(),
                Products.countDocuments(),
                // get order by status in single query
                Order.aggregate([
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 }
                        }
                    }
                ]),
                Order.find().select("user totalAmount status createdAt").populate("user", "name").sort({createdAt: -1}).limit(5).lean(),

                // calculate total revenue from completed orders
                Order.aggregate([
                    {
                        $match: { paymentStatus: "complete" }
                    },
                    {
                        $group:{
                            _id: null,
                            total: { $sum: "$totalAmount" }
                        }
                    }
                ]),

                // calculate monthly sales for chart
                Order.aggregate([
                    {
                        $match: { paymentStatus: "complete" }
                    },
                    {
                        $group: {
                            _id:{
                                month: { $month: "$createdAt" },
                                year: { $year: "$createdAt" }
                            },
                            total: { $sum: "$totalAmount" },
                            count: { $sum: 1 },
                        }
                    },
                    {$sort: {"_id.year": 1, "_id.month": 1}}
                ])
        ])

        // process status counts into an object
        const orderByStatus = {
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        }

        statusCounts.forEach((item: any) => {
            const status = item._id as keyof typeof orderByStatus;
            if(orderByStatus.hasOwnProperty(status)){
                orderByStatus[status] = item.count;
            }
        });

        return response(res, 200, "Dashboard stats fetched successfully", {
            counts : {
                orders: totalOrders,
                users: totalUsers,
                products: totalProducts,
                revenue: revenue.length > 0 ? revenue[0].total : 0,
            },
            orderByStatus,
            recentOrders,
            monthlySales
        });

    } catch (error) {
        console.log("Error in getDashboardStats controller:", error);
        return response(res, 500, "Internal Server Error, Please Try Again Later");

        
    }
}


export const getSellerPayment = async(req:Request, res:Response) =>{
    try {
        const {sellerId, status, paymentMethod, startDate, endDate} = req.query;
        const query: any = {};

        if(sellerId && sellerId !== "all"){
            query.seller = sellerId;
        }

        if(status && status !== "all"){
            query.paymentStatus = status;
        }

        if(paymentMethod && paymentMethod !== "all"){
            query.paymentMethod = paymentMethod;
        }

        if(startDate && endDate){
            query.createdAt = {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string)
            }
        }

        const payments = await SellerPayment.find(query)
        .populate("seller", "name email phoneNumber paymentMode paymentDetails")
        .populate("order")
        .populate("product", "subject finalPrice images")
        .populate("processedBy", "name")
        .sort({ createdAt: -1 });

        const users = await User.find();

        return response(res, 200, "Seller payments fetched successfully", {payments, users});
    } catch (error) {
        console.log("Error in getSellerPayment controller:", error);
        return response(res, 500, "Internal Server Error, Please Try Again Later");
        
    }
}