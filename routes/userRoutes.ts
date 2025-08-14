import express from 'express';
import authenticateMidddleware from '../middleware/authMiddleware';
import { updateUserProfile } from '../controllers/userController';

const router = express.Router();


router.put("/profile/update/:userId", authenticateMidddleware, updateUserProfile);



export default router;