import express from 'express'
import { protect, requireRole } from '../middelware/auth.middelware.js'
import {
  getNotifications,
  createNotification,
  toggleNotification,
  deleteNotification
} from '../controllers/notification.controller.js'

const router = express.Router()

// Admin protected routes
router.use(protect)
router.use(requireRole('admin'))

router.get('/', getNotifications)
router.post('/', createNotification)
router.patch('/:id/toggle', toggleNotification)
router.delete('/:id', deleteNotification)

export default router
