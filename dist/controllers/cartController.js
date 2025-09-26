"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartByUser = exports.removeFromCart = exports.addToCart = void 0;
const Products_1 = __importDefault(require("../models/Products"));
const responseHandler_1 = require("../utils/responseHandler");
const CartItems_1 = __importDefault(require("../models/CartItems"));
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { productId, quantity } = req.body;
        const product = yield Products_1.default.findById(productId);
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, "Product not found");
        }
        // if (product.seller.toString() === userId) {
        //     return response(res, 400, "You cannot add your own product to the cart");
        // }
        let cart = yield CartItems_1.default.findOne({ user: userId });
        if (!cart) {
            cart = new CartItems_1.default({ user: userId, items: [] });
        }
        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            const newItem = {
                product: productId,
                quantity: quantity,
            };
            cart.items.push(newItem);
        }
        yield cart.save();
        const populatedCart = yield cart.populate("items.product");
        return (0, responseHandler_1.response)(res, 200, "Product added to cart successfully", populatedCart);
    }
    catch (error) {
        console.log("Error in adding to cart", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { productId } = req.params;
        let cart = yield CartItems_1.default.findOne({ user: userId });
        if (!cart) {
            return (0, responseHandler_1.response)(res, 404, "Cart not found");
        }
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        yield cart.save();
        const populatedCart = yield cart.populate("items.product");
        return (0, responseHandler_1.response)(res, 200, "Product removed from cart successfully", populatedCart);
    }
    catch (error) {
        console.log("Error in removing from cart", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
});
exports.removeFromCart = removeFromCart;
const getCartByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        // Populate products inside cart items
        const cart = yield CartItems_1.default.findOne({ user: userId }).populate("items.product");
        // If cart doesn't exist or has no items, return empty cart
        if (!cart || cart.items.length === 0) {
            return (0, responseHandler_1.response)(res, 200, "Cart is empty", { items: [] });
        }
        // At this point, cart exists and has items
        // console.log("Cart Populated:", JSON.stringify(cart, null, 2));
        // console.log("Cart Populated:", cart);
        // Example: safely access first product
        // const firstItemProduct = cart.items[0].product as any; // you can type as IProduct if you want
        // console.log(firstItemProduct.title);
        // console.log(firstItemProduct.price);
        return (0, responseHandler_1.response)(res, 200, "Cart retrieved successfully", cart);
    }
    catch (error) {
        console.log("Error in getting cart", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
});
exports.getCartByUser = getCartByUser;
