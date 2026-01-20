import express from 'express'
import { protect } from '../middelware/auth.middelware.js'
import {
  getCart,
  addToCart,
  removeFromCart
} from '../controllers/cart.controller.js'

const router = express.Router()

router.get('/', protect, getCart)
router.post('/', protect, addToCart)
router.delete('/:id', protect, removeFromCart)

export default router
