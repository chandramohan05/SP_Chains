import express from 'express'
import {
  getAllDeliveries,
  updateDelivery,
  createDelivery
} from '../controllers/delivery.controller.js'

const router = express.Router()

router.get('/', getAllDeliveries)
router.put('/:id', updateDelivery)
router.post('/', createDelivery)

export default router
