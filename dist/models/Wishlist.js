"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const wishlistSchema = new mongoose_2.Schema({
    user: { type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Product', required: true }]
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Wishlist', wishlistSchema);
