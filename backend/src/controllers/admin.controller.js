import db from '../config/db.js'

/**
 * GET /api/admin/dealers?status=pending
 */
export const getDealers = async (req, res) => {
  try {
    const { status } = req.query

    let sql = `
      SELECT 
        dp.id,
        dp.user_id,
        u.mobile_number,
        dp.business_name,
        dp.gst_number,
        dp.pan_number,
        dp.approval_status,
        dp.credit_limit,
        dp.credit_used,
        dp.created_at
      FROM dealer_profiles dp
      JOIN users u ON u.id = dp.user_id
    `

    const params = []

    if (status) {
      sql += ` WHERE dp.approval_status = ?`
      params.push(status)
    }

    const [dealers] = await db.query(sql, params)

    res.json({
      message: 'Dealers fetched',
      dealers
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * PATCH /api/admin/dealers/:id/approve
 */
export const approveDealer = async (req, res) => {
  try {
    const dealerId = req.params.id

    await db.query(
      `UPDATE dealer_profiles 
       SET approval_status = 'approved'
       WHERE id = ?`,
      [dealerId]
    )

    res.json({ message: 'Dealer approved' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * PATCH /api/admin/dealers/:id/reject
 */
export const rejectDealer = async (req, res) => {
  try {
    const dealerId = req.params.id

    await db.query(
      `UPDATE dealer_profiles 
       SET approval_status = 'rejected'
       WHERE id = ?`,
      [dealerId]
    )

    res.json({ message: 'Dealer rejected' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
export const getBanners = async (req, res) => {
  const [rows] = await db.query(`
    SELECT *
    FROM banners
    ORDER BY display_order ASC
  `)

  res.json({
    banners: rows
  })
}
