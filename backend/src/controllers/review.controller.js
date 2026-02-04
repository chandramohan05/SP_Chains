import db from '../config/db.js';

/* ================= GET ALL REVIEWS (ADMIN) ================= */
export const getAllAdminReviews = async (req, res) => {
  try {
    const [reviews] = await db.query(`
      SELECT
        r.id,
        r.rating,
        r.review_text,
        r.is_synced_to_erp,
        r.created_at,

        p.name AS product_name,
        d.business_name AS dealer_name,
        r.dealer_id

      FROM reviews r
      LEFT JOIN products p
        ON p.id = r.product_id

      LEFT JOIN dealer_profiles d
        ON d.user_id = r.dealer_id

      ORDER BY r.created_at DESC
    `);

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to load reviews' });
  }
};

/* ================= DELETE REVIEW ================= */
export const deleteReviewById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'DELETE FROM reviews WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
};
