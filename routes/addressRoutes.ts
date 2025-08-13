import express from 'express';
import { createOrUpdateAddressByUserId, getAddressByUserId } from '../controllers/addressController';
import authenticateMidddleware from '../middleware/authMiddleware';

const router = express.Router();


router.post("/create-or-update", authenticateMidddleware, createOrUpdateAddressByUserId);
router.get("/", authenticateMidddleware, getAddressByUserId);


export default router;