import express from 'express';
import authenticateMidddleware from '../middleware/authMiddleware';
import { addToWishlist, getWishlistByUser, removeFromWishlist } from '../controllers/wishlistController';

const router = express.Router();

router.post('/add-to-wishlist', authenticateMidddleware, addToWishlist);
router.delete('/remove-from-wishlist/:productId', authenticateMidddleware, removeFromWishlist);
router.get('/:userId', authenticateMidddleware, getWishlistByUser);


export default router;
