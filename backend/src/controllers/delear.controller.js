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
