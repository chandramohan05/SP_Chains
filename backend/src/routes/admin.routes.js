import express from 'express'
import {
  getDealers,
  approveDealer,
  rejectDealer
} from '../controllers/admin.controller.js'

import { protect, requireRole } from '../middelware/auth.middelware.js'

const router = express.Router()

router.get('/dealers', protect, requireRole('admin'), getDealers)
router.patch('/dealers/:id/approve', protect, requireRole('admin'), approveDealer)
router.patch('/dealers/:id/reject', protect, requireRole('admin'), rejectDealer)

export default router
