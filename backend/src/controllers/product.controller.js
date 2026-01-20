import db from '../config/db.js'

/**
 * GET /api/products
 * Public / Dealer / Admin
 */
export const getProducts = async (req, res) => {
  try {
    const [products] = await db.query(
      `
      SELECT 
        id,
        name,
        category,
        variant,
        base_weight,
        purity_percent,
        making_charges,
        wastage_percent,
        stock_quantity,
        is_active
      FROM products
      WHERE is_active = 1
      ORDER BY created_at DESC
      `
    )

    res.json({
      message: 'Products fetched successfully',
      products
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch products' })
  }
}

/**
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  const { id } = req.params

  try {
    const [rows] = await db.query(
      `SELECT * FROM products WHERE id = ?`,
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({
      message: 'Product fetched',
      product: rows[0]
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch product' })
  }
}
