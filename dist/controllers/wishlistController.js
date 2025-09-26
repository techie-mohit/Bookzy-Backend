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
exports.getWishlistByUser = exports.removeFromWishlist = exports.addToWishlist = void 0;
const Products_1 = __importDefault(require("../models/Products"));
const responseHandler_1 = require("../utils/responseHandler");
const Wishlist_1 = __importDefault(require("../models/Wishlist"));
const addToWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { productId } = req.body;
        const product = yield Products_1.default.findById(productId);
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, "Product not found");
        }
        let wishlist = yield Wishlist_1.default.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist_1.default({ user: userId, products: [] });
        }
        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
            yield wishlist.save();
        }
        return (0, responseHandler_1.response)(res, 200, "Product added to wishlist successfully", wishlist);
    }
    catch (error) {
        console.log("Error in adding to wishlist", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
});
exports.addToWishlist = addToWishlist;
const removeFromWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { productId } = req.params;
        let wishlist = yield Wishlist_1.default.findOne({ user: userId });
        if (!wishlist) {
            return (0, responseHandler_1.response)(res, 404, "Wishlist not found");
        }
        wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
        yield wishlist.save();
        return (0, responseHandler_1.response)(res, 200, "Product removed from wishlist successfully");
    }
    catch (error) {
        console.log("Error in removing from wishlist", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
});
exports.removeFromWishlist = removeFromWishlist;
const getWishlistByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req === null || req === void 0 ? void 0 : req.id;
        let wishlist = yield Wishlist_1.default.findOne({ user: userId }).populate('products');
        if (!wishlist) {
            return (0, responseHandler_1.response)(res, 404, "Wishlist is Empty", { Products: [] });
        }
        return (0, responseHandler_1.response)(res, 200, "Wishlist retrieved successfully", wishlist);
    }
    catch (error) {
        console.log("Error in getting wishlist", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
});
exports.getWishlistByUser = getWishlistByUser;
