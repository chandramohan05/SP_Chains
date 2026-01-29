import db from '../config/db.js'
import { v4 as uuid } from 'uuid'

// GET ALL TICKETS
export const getTickets = async (req, res) => {
  const { status } = req.query

  let query = `
    SELECT st.*, u.mobile_number
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
}

// GET RESPONSES
export const getTicketResponses = async (req, res) => {
  const [rows] = await db.query(
    `SELECT * FROM ticket_responses WHERE ticket_id = ? ORDER BY created_at`,
    [req.params.id]
  )
  res.json(rows)
}

// UPDATE STATUS
export const updateTicketStatus = async (req, res) => {
  const { status } = req.body

  await db.query(
    `UPDATE support_tickets SET status = ? WHERE id = ?`,
    [status, req.params.id]
  )

  res.json({ message: 'Status updated' })
}

// ADD RESPONSE
export const addTicketResponse = async (req, res) => {
  const { message } = req.body

  await db.query(
    `INSERT INTO ticket_responses (id, ticket_id, message, is_staff_response)
     VALUES (?, ?, ?, 1)`,
    [uuid(), req.params.id, message]
  )

  res.json({ message: 'Response sent' })
}
