import { Request, Response } from "express";
import Products from "../models/Products";
import { response } from "../utils/responseHandler";
import Cart, { ICartItem } from "../models/CartItems";

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

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const newItem = {
                product: productId,
                quantity: quantity,
            };
            cart.items.push(newItem as ICartItem);
        }
        await cart.save();
        const populatedCart = await cart.populate("items.product");
        return response(res, 200, "Product added to cart successfully", populatedCart);
    } catch (error) {

        console.log("Error in adding to cart", error);
        return response(res, 500, "Internal server error");
    }
}

export const removeFromCart = async (req: Request, res: Response) => {

    try {
        const userId = req.id;

        const { productId } = req.params;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return response(res, 404, "Cart not found");
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== productId);

        await cart.save();
        const populatedCart = await cart.populate("items.product");
        return response(res, 200, "Product removed from cart successfully", populatedCart);
    } catch (error) {

        console.log("Error in removing from cart", error);
        return response(res, 500, "Internal server error");
    }
}

export const getCartByUser = async (req: Request, res: Response) => {
    try {
        const userId = req.id;

        // Populate products inside cart items
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        // If cart doesn't exist or has no items, return empty cart
        if (!cart || cart.items.length === 0) {
            return response(res, 200, "Cart is empty", { items: [] });
        }

        // At this point, cart exists and has items
        // console.log("Cart Populated:", JSON.stringify(cart, null, 2));
        // console.log("Cart Populated:", cart);

        // Example: safely access first product
        // const firstItemProduct = cart.items[0].product as any; // you can type as IProduct if you want
        // console.log(firstItemProduct.title);
        // console.log(firstItemProduct.price);

        return response(res, 200, "Cart retrieved successfully", cart);
    } catch (error) {
        console.log("Error in getting cart", error);
        return response(res, 500, "Internal server error");
    }
};
