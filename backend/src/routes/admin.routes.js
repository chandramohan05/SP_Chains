import express from 'express'

// Controllers
import {
  getAllOrders,
  approveOrder,
  rejectOrder,
  completeOrder
} from '../controllers/order.admin.controller.js'

import {
  getPricing,
  updatePricing
} from '../controllers/pricing.controller.js'

// Middleware (ONLY ONE SOURCE)
import { protect } from '../middelware/auth.middelware.js'
import { requireRole } from '../middelware/role.middelware.js'

const router = express.Router()

/* ================= ORDERS ================= */

// GET /api/admin/orders
router.get(
  '/orders',
  protect,
  requireRole('admin'),
  getAllOrders
)

// PATCH /api/admin/orders/:id/approve
router.patch(
  '/orders/:id/approve',
  protect,
  requireRole('admin'),
  approveOrder
)

// PATCH /api/admin/orders/:id/reject
router.patch(
  '/orders/:id/reject',
  protect,
  requireRole('admin'),
  rejectOrder
)

// PATCH /api/admin/orders/:id/complete
router.patch(
  '/orders/:id/complete',
  protect,
  requireRole('admin'),
  completeOrder
)

/* ================= PRICING ================= */

// GET /api/admin/pricing
router.get(
  '/pricing',
  protect,
  requireRole('admin'),
  getPricing
)

// POST /api/admin/pricing
router.post(
  '/pricing',
  protect,
  requireRole('admin'),
  updatePricing
)

export default router
