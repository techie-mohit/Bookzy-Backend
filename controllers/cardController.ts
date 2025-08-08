import { Request, Response } from "express";
import Products from "../models/Products";
import { response } from "../utils/responseHandler";
import CardItem, { ICardItem } from "../models/CardItems";

export const addToCart = async (req: Request, res: Response) => {

    try {
        const userId = req.id;

        const { productId, quantity } = req.body;

        const product = await Products.findById(productId);
        if (!product) {
            return response(res, 404, "Product not found");
        }

        if (product.seller.toString() === userId) {
            return response(res, 400, "You cannot add your own product to the cart");
        }

        let cart = await CardItem.findOne({ user: userId });
        if (!cart) {
            cart = new CardItem({ user: userId, items: [] });
        }

        const existingItem = cart.items.find((item) => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const newItem = {
                productId,
                quantity
            };
            cart.items.push(newItem as ICardItem);
        }

        await cart.save();
        return response(res, 200, "Product added to cart successfully", cart);
    } catch (error) {

        console.log("Error in adding to cart", error);
        return response(res, 500, "Internal server error");
    }
}

export const removeFromCart = async (req: Request, res: Response) => {

    try {
        const userId = req.id;

        const { productId } = req.params;

        let cart = await CardItem.findOne({ user: userId });
        if (!cart) {
            return response(res, 404, "Cart not found");
        }

        cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

        await cart.save();
        return response(res, 200, "Product removed from cart successfully");
    } catch (error) {

        console.log("Error in removing from cart", error);
        return response(res, 500, "Internal server error");
    }
}

export const getCartByUser = async (req: Request, res: Response) => {

    try {
        const userId = req.id;

        let cart = await CardItem.findOne({ user: userId });
        if (!cart) {
            return response(res, 404, "Cart is Empty", {items:[]});
        }

        return response(res, 200, "Cart retrieved successfully", cart);
    } catch (error) {

        console.log("Error in getting cart", error);
        return response(res, 500, "Internal server error");
    }

}