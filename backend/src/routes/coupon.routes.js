import express from 'express'
import {
  getCoupons,
  createCoupon,
  toggleCoupon,
  deleteCoupon
} from '../controllers/coupon.controller.js'

const router = express.Router()

router.get('/', getCoupons)
router.post('/', createCoupon)
router.patch('/:id/toggle', toggleCoupon)
router.delete('/:id', deleteCoupon)

export default router
