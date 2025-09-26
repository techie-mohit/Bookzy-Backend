import {NextFunction, Request, Response, Router} from 'express';
import * as authController from '../controllers/authController';
import authenticateMidddleware from '../middleware/authMiddleware';
import passport from 'passport';
import { IUSER } from '../models/User';
import { generateToken } from '../utils/generateToken';



const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.get("/logout", authController.logout);

router.get("/verify-auth", authenticateMidddleware, authController.checkUserAuth);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// google callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}`,
    session:false 
}),
    async(req:Request, res:Response, next:NextFunction) => {
        try {
            const user = req.user as IUSER;
            const access_Token = await generateToken(user);
           res.cookie("accessToken", access_Token, {
            httpOnly:true,
            sameSite: 'none',
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days    
        })
            res.redirect(`${process.env.FRONTEND_URL}`);
        } catch (error) {
            next(error);
        }

    });

export default router;