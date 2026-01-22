import { useState } from 'react'
import { LogIn } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL

interface LoginProps {
  onLoginSuccess: (user: { id: string; role: 'admin' | 'dealer' }) => void
  onSwitchToRegister: () => void
}

export function Login({ onLoginSuccess, onSwitchToRegister }: LoginProps) {
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ================= SEND OTP =================
  const sendOTP = async () => {
    if (mobile.length !== 10) {
      setError('Enter valid 10-digit mobile number')  
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setOtpSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // ================= VERIFY OTP =================
 const verifyOTP = async () => {
  if (otp.length !== 6) {
    setError('Enter valid OTP')
    return
  }

  setLoading(true)
  setError('')

  try {
    const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp })
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message)

    // ✅ SAVE TOKEN CORRECTLY
    if (data.user.role === 'admin') {
      localStorage.setItem('adminToken', data.token)
      localStorage.removeItem('dealerToken')
    } else {
      localStorage.setItem('dealerToken', data.token)
      localStorage.removeItem('adminToken')
    }

    console.log('Saved token:', data.user.role, data.token)

    onLoginSuccess(data.user)
  } catch (err: any) {
    setError(err.message || 'OTP verification failed')
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-8 rounded-xl w-full max-w-md">
        <div className="text-center mb-6">
          <LogIn className="w-10 h-10 mx-auto text-amber-600" />
          <h2 className="text-2xl font-bold mt-2">SP Chains Login</h2>
        </div>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}

        {!otpSent ? (
          <>
            <input
              value={mobile}
              onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
              maxLength={10}
              placeholder="Mobile Number"
              className="w-full border p-3 rounded mb-4"
            />
            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full bg-amber-600 text-white py-3 rounded"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
            <button onClick={onSwitchToRegister} className="mt-3 text-sm text-amber-600">
              New dealer? Register
            </button>
          </>
        ) : (
          <>
            <input
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              maxLength={6}
              placeholder="Enter OTP"
              className="w-full border p-3 rounded mb-4 text-center text-xl"
            />
            <button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full bg-amber-600 text-white py-3 rounded"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
