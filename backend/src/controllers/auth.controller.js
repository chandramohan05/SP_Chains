import db from '../config/db.js'
import { generateToken } from '../utils/jwt.js'

/* ================= SEND OTP (DEMO) ================= */
export const sendOTP = async (req, res) => {
  const { mobile } = req.body

  if (!mobile) {
    return res.status(400).json({ message: 'Mobile required' })
  }

  // 🔹 Demo OTP only
  return res.json({
    message: 'OTP sent successfully (demo)',
    otp: '123456'
  })
}

/* ================= VERIFY OTP ================= */
export const verifyOTP = async (req, res) => {
  const { mobile, otp } = req.body

  if (!mobile || !otp) {
    return res.status(400).json({ message: 'Mobile & OTP required' })
  }

  if (otp !== '123456') {
    return res.status(401).json({ message: 'Invalid OTP' })
  }

  // ✅ FIXED COLUMN NAME
  const [users] = await db.query(
    'SELECT id, role FROM users WHERE mobile_number = ?',
    [mobile]
  )

  if (users.length === 0) {
    return res.status(404).json({ message: 'User not found' })
  }

  const user = users[0]

  const token = generateToken({
    id: user.id,
    role: user.role
  })

  return res.json({
    token,
    user
  })
  
}
/* ================= GET LOGGED-IN USER ================= */
export const getMe = async (req, res) => {
  return res.json({
    user: {
      id: req.user.id,
      role: req.user.role
    }
  });
};
