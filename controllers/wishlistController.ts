import { Request, Response } from "express";
import Products from "../models/Products";
import { response } from "../utils/responseHandler";
import Wishlist from "../models/Wishlist";

export const addToWishlist = async (req: Request, res: Response) => {

    try {
        const userId = req.id;

        const { productId } = req.body;

        const product = await Products.findById(productId);
        if (!product) {
            return response(res, 404, "Product not found");
        }

        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [] });
        }


        if(!wishlist.products.includes(productId)){
            wishlist.products.push(productId);
            await wishlist.save();
        }


        
        return response(res, 200, "Product added to wishlist successfully", wishlist);
    } catch (error) {

        console.log("Error in adding to wishlist", error);
        return response(res, 500, "Internal server error");
    }
}

export const removeFromWishlist = async (req: Request, res: Response) => {

    try {
        const userId = req.id;

        const { productId } = req.params;

        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            return response(res, 404, "Wishlist not found");
        }

        wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);

        await wishlist.save();
        return response(res, 200, "Product removed from wishlist successfully");
    } catch (error) {

        console.log("Error in removing from wishlist", error);
        return response(res, 500, "Internal server error");
    }
}

export const getWishlistByUser = async (req: Request, res: Response) => {

    try {
        const userId = req?.id;

        let wishlist = await Wishlist.findOne({ user: userId }).populate('products');
        if (!wishlist) {
            return response(res, 404, "Wishlist is Empty", {Products:[]});
        }

        return response(res, 200, "Wishlist retrieved successfully", wishlist);
    } catch (error) {

        console.log("Error in getting wishlist", error);
        return response(res, 500, "Internal server error");
    }

}