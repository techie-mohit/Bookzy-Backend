import express from 'express';
import authenticateMidddleware from '../middleware/authMiddleware';
import { multerMiddleware } from '../config/cloudinaryConfig';
import { createProduct } from '../controllers/productController';

const router = express.Router();

router.post('/', authenticateMidddleware, multerMiddleware, createProduct);

export default router;