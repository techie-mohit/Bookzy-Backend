"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.default, orderController_1.createOrUpadateOrder);
router.get('/', authMiddleware_1.default, orderController_1.getOrderByUserId);
router.get('/:id', authMiddleware_1.default, orderController_1.getOrderById);
router.post('/payment-razorpay', authMiddleware_1.default, orderController_1.createPaymentWithRazorpay);
router.post('/razorpay-webhook', authMiddleware_1.default, orderController_1.handleRazorpayWebhook);
exports.default = router;
