import express from 'express';
import authenticateMidddleware from '../middleware/authMiddleware';
import { multerMiddleware } from '../config/cloudinaryConfig';
import { createProduct, deleteProduct, getAllProducts, getProductById, getProductBySellerId } from '../controllers/productController';

const router = express.Router();

router.post('/', authenticateMidddleware, multerMiddleware, createProduct);
router.get('/',  getAllProducts);
router.get('/seller/:sellerId', authenticateMidddleware, getProductBySellerId);
router.get('/:id', authenticateMidddleware, getProductById);
router.delete('/delete/:productId', authenticateMidddleware, deleteProduct);


export default router;