import db from '../config/db.js'
import { randomUUID } from 'crypto'

/* ================= GET ================= */
export const getNotifications = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM notifications ORDER BY created_at DESC'
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Unable to load notifications' })
  }
}

/* ================= CREATE ================= */
export const createNotification = async (req, res) => {
  const { title, message, type, target_audience } = req.body
  const adminId = req.user.id   // from auth middleware

  if (!title || !message || !type) {
    return res.status(400).json({ message: 'Missing fields' })
  }

  try {
    await db.query(
      `INSERT INTO notifications 
      (id, title, message, type, target_audience, created_by, published_at, is_active)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), 1)`,
      [
        randomUUID(),
        title,
        message,
        type,
        target_audience || 'all',
        adminId
      ]
    )

    res.status(201).json({ message: 'Notification published' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Notification publish failed' })
  }
}

/* ================= TOGGLE ================= */
export const toggleNotification = async (req, res) => {
  try {
    await db.query(
      `UPDATE notifications SET is_active = NOT is_active WHERE id = ?`,
      [req.params.id]
    )
    res.json({ message: 'Status updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Toggle failed' })
  }
}

/* ================= DELETE ================= */
export const deleteNotification = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM notifications WHERE id = ?',
      [req.params.id]
    )
    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Delete failed' })
  }
}
