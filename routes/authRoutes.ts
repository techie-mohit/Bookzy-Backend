import {Router} from 'express';
import * as authController from '../controllers/authController';
import authenticateMidddleware from '../middleware/authMiddleware';



const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.get("/logout", authController.logout);

router.get("/verify-auth", authenticateMidddleware, authController.checkUserAuth);


export default router;