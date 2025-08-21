import express from 'express';
import authenticateMidddleware from '../middleware/authMiddleware';
import { createOrUpadateOrder, getOrderById, getOrderByUserId } from '../controllers/orderController';


const router = express.Router();

router.post('/', authenticateMidddleware, createOrUpadateOrder);
router.get('/', authenticateMidddleware, getOrderByUserId);
router.get('/:id', authenticateMidddleware, getOrderById);



export default router;