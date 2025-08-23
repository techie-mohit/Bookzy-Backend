import express from 'express';
import authenticateMidddleware from '../middleware/authMiddleware';
import { createOrUpadateOrder, getOrderById, getOrderByUserId, createPaymentWithRazorpay , handleRazorpayWebhook} from '../controllers/orderController';
const router = express.Router();

router.post('/', authenticateMidddleware, createOrUpadateOrder);
router.get('/', authenticateMidddleware, getOrderByUserId);
router.get('/:id', authenticateMidddleware, getOrderById);
router.post('/payment-razorpay', authenticateMidddleware, createPaymentWithRazorpay);
router.post('/razorpay-webhook', authenticateMidddleware, handleRazorpayWebhook);


export default router;