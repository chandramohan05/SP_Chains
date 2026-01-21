import db from '../config/db.js'
import { v4 as uuid } from 'uuid'

/* ================= GET ALL BANNERS ================= */
export const getBanners = async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM banners ORDER BY display_order ASC'
  )
  res.json(rows)
}

/* ================= CREATE BANNER ================= */
export const createBanner = async (req, res) => {
  const {
    title,
    description,
    image_url,
    link_url,
    display_order,
    start_date,
    end_date
  } = req.body

  const id = uuid()

  await db.query(
    `INSERT INTO banners
     (id, title, description, image_url, link_url, display_order, start_date, end_date, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [
      id,
      title,
      description,
      image_url,
      link_url,
      display_order,
      start_date,
      end_date
    ]
  )

  res.status(201).json({ message: 'Banner created' })
}

/* ================= UPDATE BANNER ================= */
export const updateBanner = async (req, res) => {
  const { id } = req.params

  await db.query(
    `UPDATE banners SET ? WHERE id = ?`,
    [req.body, id]
  )

  res.json({ message: 'Banner updated' })
}

/* ================= TOGGLE ACTIVE ================= */
export const toggleBanner = async (req, res) => {
  const { id } = req.params

  await db.query(
    `UPDATE banners SET is_active = NOT is_active WHERE id = ?`,
    [id]
  )

  res.json({ message: 'Banner status updated' })
}

/* ================= DELETE BANNER ================= */
export const deleteBanner = async (req, res) => {
  const { id } = req.params

  await db.query(
    'DELETE FROM banners WHERE id = ?',
    [id]
  )

  res.json({ message: 'Banner deleted' })
}
