import db from '../config/db.js'
import { v4 as uuid } from 'uuid'

export const getCart = async (req, res) => {
  const userId = req.user.id

  const [items] = await db.query(
    `SELECT c.id, c.quantity, p.name, p.base_weight, p.making_charges
     FROM cart_items c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = ?`,
    [userId]
  )

  res.json({ message: 'Cart fetched', items })
}

export const addToCart = async (req, res) => {
  const userId = req.user.id
  const { product_id, quantity } = req.body

  if (!product_id || !quantity) {
    return res.status(400).json({ message: 'Product & quantity required' })
  }

  await db.query(
    `INSERT INTO cart_items (id, user_id, product_id, quantity)
     VALUES (?, ?, ?, ?)`,
    [uuid(), userId, product_id, quantity]
  )

  res.json({ message: 'Added to cart' })
}

export const removeFromCart = async (req, res) => {
  const userId = req.user.id
  const { id } = req.params

  await db.query(
    'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
    [id, userId]
  )

  res.json({ message: 'Removed from cart' })
}
