"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const wishlistController_1 = require("../controllers/wishlistController");
const router = express_1.default.Router();
router.post('/add-to-wishlist', authMiddleware_1.default, wishlistController_1.addToWishlist);
router.delete('/remove-from-wishlist/:productId', authMiddleware_1.default, wishlistController_1.removeFromWishlist);
router.get('/:userId', authMiddleware_1.default, wishlistController_1.getWishlistByUser);
exports.default = router;
