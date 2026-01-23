import db from "../config/db.js"
import { v4 as uuidv4 } from "uuid"

/**
 * GET latest pricing
 * GET /api/admin/pricing
 */
export const getPricing = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM pricing_config
       ORDER BY created_at DESC
       LIMIT 1`
    )

    if (rows.length === 0) {
      return res.json({
        mcx_rate: 0,
        premium_percentage: 0,
        net_rate: 0,
        retail_rate: 0
      })
    }

    const pricing = rows[0]

    const net_rate =
      Number(pricing.mcx_rate) +
      (Number(pricing.mcx_rate) * Number(pricing.premium_percentage)) / 100

    res.json({
      id: pricing.id,
      mcx_rate: pricing.mcx_rate,
      premium_percentage: pricing.premium_percentage,
      net_rate,
      retail_rate: net_rate,
      created_at: pricing.created_at,
      updated_at: pricing.updated_at
    })
  } catch (err) {
    console.error("Get pricing error:", err)
    res.status(500).json({ message: "Failed to fetch pricing" })
  }
}

/**
 * UPDATE pricing (ADMIN only)
 * POST /api/admin/pricing
 */
export const updatePricing = async (req, res) => {
  try {
    const { mcx_rate, premium_percentage } = req.body

    if (!mcx_rate) {
      return res.status(400).json({ message: "MCX rate is required" })
    }

    await db.query(
      `INSERT INTO pricing_config
      (id, mcx_rate, premium_percentage, updated_by)
      VALUES (?, ?, ?, ?)`,
      [
        uuidv4(),
        mcx_rate,
        premium_percentage ?? 0,
        req.user.id // comes from protect middleware
      ]
    )

    res.json({ message: "Pricing updated successfully" })
  } catch (err) {
    console.error("Update pricing error:", err)
    res.status(500).json({ message: "Failed to update pricing" })
  }
}
