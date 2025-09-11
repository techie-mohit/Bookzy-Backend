import express from 'express';
import authenticateMidddleware from '../middleware/authMiddleware';
import { addToCart, getCartByUser, removeFromCart } from '../controllers/cartController';

const router = express.Router();

router.post('/add-to-cart', authenticateMidddleware, addToCart);
router.delete('/remove-from-cart/:productId', authenticateMidddleware, removeFromCart);
router.get('/:userId', authenticateMidddleware, getCartByUser);


export default router;
