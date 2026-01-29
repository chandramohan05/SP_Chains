import express from 'express'
import { protect, requireRole } from '../middelware/auth.middelware.js'
import {
  getPricing,
  updatePricing
} from '../controllers/pricing.controller.js'

const router = express.Router()

// Admin-only pricing routes
router.get('/', protect, requireRole('admin'), getPricing)
router.post('/', protect, requireRole('admin'), updatePricing)

export default router
