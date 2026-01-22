

import db from '../config/db.js'

export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT
        o.*,
        dp.business_name
      FROM orders o
      JOIN dealer_profiles dp ON dp.user_id = o.dealer_id
      ORDER BY o.created_at DESC
    `)

    if (!orders.length) {
      return res.json([])
    }

    const orderIds = orders.map(o => o.id)

    const [items] = await db.query(`
      SELECT
        oi.*,
        p.name AS product_name
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id IN (?)
    `, [orderIds])

    const ordersWithDetails = orders.map(order => ({
      ...order,
      dealer_profile: {
        business_name: order.business_name
      },
      items: items
        .filter(i => i.order_id === order.id)
        .map(i => ({
          ...i,
          product: {
            name: i.product_name
          }
        }))
    }))

    res.json(ordersWithDetails)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch orders' })
  }
}


export const approveOrder = async (req, res) => {
  const { id } = req.params

  await db.query(
    `
    UPDATE orders
    SET status = 'approved',
        approved_at = NOW()
    WHERE id = ? AND status = 'placed'
    `,
    [id]
  )

  res.json({ message: 'Order approved' })
}
export const rejectOrder = async (req, res) => {
  const { id } = req.params
  const { reason } = req.body

  await db.query(
    `
    UPDATE orders
    SET status = 'rejected',
        rejected_reason = ?
    WHERE id = ? AND status = 'placed'
    `,
    [reason, id]
  )

  res.json({ message: 'Order rejected' })
}
export const completeOrder = async (req, res) => {
  const { id } = req.params

  await db.query(
    `
    UPDATE orders
    SET status = 'completed'
    WHERE id = ? AND status = 'approved'
    `,
    [id]
  )

  res.json({ message: 'Order completed' })
}
