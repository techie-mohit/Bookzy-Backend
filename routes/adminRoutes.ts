import express from 'express';
import * as adminController from '../controllers/adminController';
import authenticateMidddleware from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/adminMiddleware';


const router = express.Router();

router.get('/dashboard-stats', adminController.getDashboardStats);

// apply both middleware to all admin route
router.use(authenticateMidddleware, isAdmin);
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrder);


// seller payment management routes
router.post('/process-seller-payment/:orderId', adminController.processSellerPayment);
router.get('/seller-payments', adminController.getSellerPayment);




export default router;
