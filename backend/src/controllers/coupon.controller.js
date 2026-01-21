import db from '../config/db.js'

export const getCoupons = async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM coupons ORDER BY created_at DESC'
  )
  res.json(rows)
}

export const createCoupon = async (req, res) => {
  const {
    code,
    discount_type,
    discount_value,
    min_quantity,
    applicable_payment_modes,
    expiry_date
  } = req.body

  await db.query(
    `INSERT INTO coupons
     (code, discount_type, discount_value, min_quantity,
      applicable_payment_modes, expiry_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      code,
      discount_type,
      discount_value,
      min_quantity,
      JSON.stringify(applicable_payment_modes),
      expiry_date
    ]
  )

  res.status(201).json({ message: 'Coupon created' })
}

export const toggleCoupon = async (req, res) => {
  const { id } = req.params

  await db.query(
    `UPDATE coupons
     SET is_active = NOT is_active
     WHERE id = ?`,
    [id]
  )

  res.json({ message: 'Status updated' })
}

export const deleteCoupon = async (req, res) => {
  const { id } = req.params
  await db.query('DELETE FROM coupons WHERE id = ?', [id])
  res.json({ message: 'Deleted' })
}
