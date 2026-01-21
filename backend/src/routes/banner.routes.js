import express from 'express'
import {
  getBanners,
  createBanner,
  updateBanner,
  toggleBanner,
  deleteBanner
} from '../controllers/banner.controller.js'

const router = express.Router()

router.get('/', getBanners)
router.post('/', createBanner)
router.put('/:id', updateBanner)
router.patch('/:id/toggle', toggleBanner)
router.delete('/:id', deleteBanner)

export default router
