import { useState } from 'react'
import { UserPlus } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL

interface RegisterProps {
  onSwitchToLogin: () => void
}

export function Register({ onSwitchToLogin }: RegisterProps) {
  const [form, setForm] = useState({
    mobile: '',
    businessName: '',
    gst: '',
    pan: ''
  })
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // ================= VALIDATION =================
  const validate = () => {
    if (form.mobile.length !== 10) return 'Invalid mobile number'
    if (!form.businessName) return 'Business name required'
    if (form.gst.length !== 15) return 'Invalid GST number'
    if (form.pan.length !== 10) return 'Invalid PAN number'
    return null
  }

  // ================= SEND OTP =================
  const sendOTP = async () => {
    const err = validate()
    if (err) {
      setError(err)
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE}/auth/register/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setOtpSent(true)
    } catch (e: any) {
      setError(e.message || 'OTP send failed')
    } finally {
      setLoading(false)
    }
  }

  // ================= VERIFY + REGISTER =================
  const verifyAndRegister = async () => {
    if (otp.length !== 6) {
      setError('Invalid OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE}/auth/register/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, otp })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setSuccess(true)
    } catch (e: any) {
      setError(e.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  // ================= SUCCESS SCREEN =================
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="bg-white p-8 rounded-xl max-w-md text-center">
          <UserPlus className="w-10 h-10 mx-auto text-green-600" />
          <h2 className="text-2xl font-bold mt-3">Registration Successful</h2>
          <p className="text-slate-600 mt-2">
            Your account is pending admin approval.
          </p>
          <button
            onClick={onSwitchToLogin}
            className="mt-6 w-full bg-amber-600 text-white py-3 rounded"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  // ================= FORM =================
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-8 rounded-xl max-w-md w-full">
        <div className="text-center mb-6">
          <UserPlus className="w-10 h-10 mx-auto text-amber-600" />
          <h2 className="text-2xl font-bold mt-2">Dealer Registration</h2>
        </div>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}

        {!otpSent ? (
          <>
            <input
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
              className="input"
            />
            <input
              placeholder="Business Name"
              value={form.businessName}
              onChange={e => setForm({ ...form, businessName: e.target.value })}
              className="input"
            />
            <input
              placeholder="GST Number"
              value={form.gst}
              onChange={e => setForm({ ...form, gst: e.target.value.toUpperCase() })}
              className="input"
            />
            <input
              placeholder="PAN Number"
              value={form.pan}
              onChange={e => setForm({ ...form, pan: e.target.value.toUpperCase() })}
              className="input"
            />

            <button onClick={sendOTP} className="btn-primary">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <button onClick={onSwitchToLogin} className="text-sm mt-3 text-amber-600">
              Already registered? Login
            </button>
          </>
        ) : (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              className="input text-center text-xl"
            />
            <button onClick={verifyAndRegister} className="btn-primary">
              {loading ? 'Verifying...' : 'Verify & Register'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
