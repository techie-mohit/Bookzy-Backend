import {Router} from 'express';
import * as authController from '../controllers/authController';


const router = Router();

router.post("/register", authController.register);
router.get("/login", authController.login);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.post("/logout", authController.logout);


export default router;