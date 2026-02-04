import db from '../config/db.js'

/* ================= GET ALL DELIVERIES ================= */
export const getAllDeliveries = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        dt.*,
        o.order_number
      FROM delivery_tracking dt
      LEFT JOIN orders o ON o.id = dt.order_id
      ORDER BY dt.updated_at DESC
    `)

    const formatted = rows.map(row => ({
      id: row.id,
      order_id: row.order_id,
      status: row.status,
      delivery_method: row.delivery_method,
      delivered_by: row.delivered_by,
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at,
      order: {
        order_number: row.order_number
      }
    }))

    res.json(formatted)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch deliveries' })
  }
}

/* ================= UPDATE DELIVERY ================= */
export const updateDelivery = async (req, res) => {
  const { status, notes } = req.body
  const { id } = req.params

  try {
    await db.query(
      `UPDATE delivery_tracking SET status=?, notes=?, updated_at=NOW() WHERE id=?`,
      [status, notes, id]
    )

    res.json({ message: 'Delivery updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Update failed' })
  }
}

/* ================= CREATE DELIVERY ================= */
export const createDelivery = async (req, res) => {
  const { order_id, delivery_method } = req.body

  try {
    await db.query(
      `INSERT INTO delivery_tracking (id, order_id, status, delivery_method, created_at, updated_at)
       VALUES (UUID(), ?, 'Order Confirmed', ?, NOW(), NOW())`,
      [order_id, delivery_method]
    )

    res.json({ message: 'Delivery created' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Creation failed' })
  }
}
