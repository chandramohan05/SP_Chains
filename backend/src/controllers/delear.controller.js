import db from '../config/db.js'

export const getDealerProfile = async (req, res) => {
  try {
    const userId = req.user.id

    const [rows] = await db.query(
      `SELECT 
        id,
        user_id,
        business_name,
        gst_number,
        pan_number,
        approval_status,
        credit_limit,
        credit_used,
        created_at,
        updated_at
       FROM dealer_profiles
       WHERE user_id = ?`,
      [userId]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Dealer profile not found' })
    }

    res.json({
      message: 'Dealer profile fetched',
      profile: rows[0]
    })
  } catch (err) {
    console.error('Dealer Profile Error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
export const getDealers = async (req, res) => {
  try {
    const { status } = req.query

    let query = `
      SELECT 
        d.id            AS dealer_id,
        d.user_id,
        u.mobile_number,
        d.business_name,
        d.gst_number,
        d.pan_number,
        d.approval_status,
        d.credit_limit,
        d.created_at
      FROM dealer_profiles d
      JOIN users u ON u.id = d.user_id
    `

    const params = []

    if (status && status !== 'all') {
      query += ' WHERE d.approval_status = ?'
      params.push(status)
    }

    const [rows] = await db.query(query, params)
    res.json(rows)
  } catch (err) {
    console.error('getDealers error:', err)
    res.status(500).json({ message: 'Failed to fetch dealers' })
  }
}


/* ================= APPROVE DEALER ================= */
export const approveDealer = async (req, res) => {
  const { id } = req.params
  const { credit_limit } = req.body

  const [result] = await db.query(
    `
    UPDATE dealer_profiles
    SET approval_status = 'approved',
        credit_limit = ?,
        approved_at = NOW()
    WHERE id = ?
    `,
    [credit_limit, id]
  )

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Dealer not found' })
  }

  res.json({ message: 'Dealer approved successfully' })
}




/* ================= REJECT DEALER ================= */
export const rejectDealer = async (req, res) => {
  const { id } = req.params
  const { reason } = req.body

  const [result] = await db.query(
    `
    UPDATE dealer_profiles
    SET approval_status = 'rejected',
        rejected_reason = ?
    WHERE id = ?
    `,
    [reason, id]
  )

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Dealer not found' })
  }

  res.json({ message: 'Dealer rejected successfully' })
}


/* ================= UPDATE CREDIT ================= */
export const updateCreditLimit = async (req, res) => {
  const { id } = req.params
  const { credit_limit } = req.body

  const [result] = await db.query(
    `
    UPDATE dealer_profiles
    SET credit_limit = ?
    WHERE id = ?
    `,
    [credit_limit, id]
  )

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Dealer not found' })
  }

  res.json({ message: 'Credit limit updated' })
}
