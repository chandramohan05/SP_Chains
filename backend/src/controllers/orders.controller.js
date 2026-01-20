import db from '../config/db.js'
import { v4 as uuid } from 'uuid'

export const checkout = async (req, res) => {
  const userId = req.user.id

  const [cartItems] = await db.query(
    `SELECT c.product_id, c.quantity,
            p.base_weight, p.making_charges
     FROM cart_items c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = ?`,
    [userId]
  )

  if (cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' })
  }

  let total = 0
  cartItems.forEach(item => {
    total += item.base_weight * item.quantity + item.making_charges
  })

  const orderId = uuid()

  await db.query(
    `INSERT INTO orders (id, user_id, total_amount, status)
     VALUES (?, ?, ?, 'pending')`,
    [orderId, userId, total]
  )

  for (const item of cartItems) {
    await db.query(
      `INSERT INTO order_items
       (id, order_id, product_id, quantity, price)
       VALUES (?, ?, ?, ?, ?)`,
      [
        uuid(),
        orderId,
        item.product_id,
        item.quantity,
        item.base_weight + item.making_charges
      ]
    )
  }

  // clear cart
  await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId])

  res.json({
    message: 'Order placed successfully',
    orderId,
    total
  })
}

export const myOrders = async (req, res) => {
  const userId = req.user.id

  const [orders] = await db.query(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  )

  res.json({ orders })
}
