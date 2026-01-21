import express from 'express'
import {
  getDealers,
  approveDealer,
  rejectDealer,
  updateCreditLimit
} from '../controllers/delear.controller.js'

const router = express.Router()

router.get('/', getDealers)
router.post('/:id/approve', approveDealer)
router.post('/:id/reject', rejectDealer)
router.patch('/:id/credit-limit', updateCreditLimit)

export default router
