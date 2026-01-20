import express from 'express'
import { sendOTP, verifyOTP } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/send-otp', sendOTP)
router.post('/verify-otp', verifyOTP)
router.get('/health', (req, res) => res.json({ message: 'auth working' }))

export default router
