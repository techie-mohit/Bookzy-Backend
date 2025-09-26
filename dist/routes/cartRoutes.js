"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const cartController_1 = require("../controllers/cartController");
const router = express_1.default.Router();
router.post('/add-to-cart', authMiddleware_1.default, cartController_1.addToCart);
router.delete('/remove-from-cart/:productId', authMiddleware_1.default, cartController_1.removeFromCart);
router.get('/:userId', authMiddleware_1.default, cartController_1.getCartByUser);
exports.default = router;
