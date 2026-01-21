import express from 'express'
import {
  getBanners,
  createBanner,
  updateBanner,
  toggleBanner,
  deleteBanner
} from '../controllers/banner.controller.js'

import { protect, requireRole } from '../middelware/auth.middelware.js'

const router = express.Router()

/* ================= BANNERS ================= */
router.get('/banners', protect, requireRole('admin'), getBanners)
router.post('/banners', protect, requireRole('admin'), createBanner)
router.put('/banners/:id', protect, requireRole('admin'), updateBanner)
router.patch('/banners/:id/toggle', protect, requireRole('admin'), toggleBanner)
router.delete('/banners/:id', protect, requireRole('admin'), deleteBanner)

export default router
