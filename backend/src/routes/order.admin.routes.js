import express from 'express'
import {
  getAllOrders,
  approveOrder,
  rejectOrder,
  completeOrder
} from '../controllers/order.admin.controller.js'

import { protect, requireRole } from '../middelware/auth.middelware.js'

const router = express.Router()

/* ================= ORDERS ================= */
router.get('/orders', protect, requireRole('admin'), getAllOrders)
router.patch('/orders/:id/approve', protect, requireRole('admin'), approveOrder)
router.patch('/orders/:id/reject', protect, requireRole('admin'), rejectOrder)
router.patch('/orders/:id/complete', protect, requireRole('admin'), completeOrder)

export default router
