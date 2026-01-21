import express from 'express';
import { sendOTP, verifyOTP, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middelware/auth.middelware.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// ✅ REQUIRED FOR FRONTEND
router.get('/me', protect, getMe);

export default router;
