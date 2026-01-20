import express from 'express'
import { protect, requireRole } from '../middelware/auth.middelware.js'
import { getDealerProfile } from '../controllers/delear.controller.js'

const router = express.Router()

router.get(
  '/profile',
  protect,
  requireRole('dealer'),
  getDealerProfile
)

export default router
