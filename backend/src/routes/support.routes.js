import express from 'express'
import db from '../config/db.js'

const router = express.Router()

// ================= GET ALL SUPPORT TICKETS (ADMIN) =================
router.get('/admin/support-tickets', async (req, res) => {
  try {
    const { status } = req.query

    let query = `
      SELECT 
        st.*,
        u.mobile_number
      FROM support_tickets st
      LEFT JOIN users u ON u.id = st.user_id
    `
    const params = []

    if (status && status !== 'all') {
      query += ' WHERE st.status = ?'
      params.push(status)
    }

    query += ' ORDER BY st.created_at DESC'

    const [rows] = await db.query(query, params)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch tickets' })
  }
})

// ================= GET RESPONSES FOR A TICKET =================
router.get('/admin/support-tickets/:id/responses', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM ticket_responses WHERE ticket_id = ? ORDER BY created_at ASC`,
      [req.params.id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch responses' })
  }
})

// ================= UPDATE TICKET STATUS =================
router.put('/admin/support-tickets/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    await db.query(
      `UPDATE support_tickets SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, req.params.id]
    )
    res.json({ message: 'Status updated' })
  } catch (err) {
    res.status(500).json({ message: 'Status update failed' })
  }
})

// ================= ADD STAFF RESPONSE =================
router.post('/admin/support-tickets/:id/response', async (req, res) => {
  try {
    const { message } = req.body

    await db.query(
      `INSERT INTO ticket_responses (id, ticket_id, user_id, message, is_staff_response)
       VALUES (UUID(), ?, NULL, ?, 1)`,
      [req.params.id, message]
    )

    res.json({ message: 'Response sent' })
  } catch (err) {
    res.status(500).json({ message: 'Response failed' })
  }
})

export default router
