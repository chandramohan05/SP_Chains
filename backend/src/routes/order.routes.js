import express from 'express'
import { protect } from '../middelware/auth.middelware.js'
import { checkout, myOrders } from '../controllers/orders.controller.js'

const router = express.Router()

router.post('/checkout', protect, checkout)
router.get('/my', protect, myOrders)

export default router
