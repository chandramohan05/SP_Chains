import { useEffect, useState } from 'react'
import { PricingConfig } from '../../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL

export function PricingManager() {
  const [pricing, setPricing] = useState<PricingConfig | null>(null)
  const [mcxRate, setMcxRate] = useState('')
  const [premiumPercentage, setPremiumPercentage] = useState('')
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const getAdminToken = () => localStorage.getItem('adminToken')

  useEffect(() => {
    fetchPricing()
  }, [])

  const fetchPricing = async () => {
    const token = getAdminToken()
    if (!token) {
      setError('Admin session expired. Please login again.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/pricing`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Unauthorized')

      const data: PricingConfig = await res.json()
      setPricing(data)
      setMcxRate(String(data.mcx_rate))
      setPremiumPercentage(String(data.premium_percentage))
    } catch {
      setError('Failed to load pricing')
    } finally {
      setLoading(false)
    }
  }

  const calculateNetRate = () => {
    const mcx = Number(mcxRate) || 0
    const premium = Number(premiumPercentage) || 0
    return mcx * (1 + premium / 100)
  }

  const calculateRetailRate = () => calculateNetRate() * 1.01

  const updatePricing = async () => {
    const token = getAdminToken()
    if (!token) return setError('Admin session expired')

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch(`${API_BASE}/api/admin/pricing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          mcx_rate: Number(mcxRate),
          premium_percentage: Number(premiumPercentage)
        })
      })

      if (!res.ok) throw new Error()
      await fetchPricing()
      setSuccess(true)
    } catch {
      setError('Failed to update pricing')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">
        Pricing Configuration
      </h2>

      {loading && (
        <p className="text-center text-slate-500">Loading pricing...</p>
      )}

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {pricing && (
        <>
          {/* RATE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-blue-600 text-white rounded">
              MCX Rate<br />₹{pricing.mcx_rate}
            </div>
            <div className="p-5 bg-amber-600 text-white rounded">
              Net Rate<br />₹{calculateNetRate().toFixed(2)}
            </div>
            <div className="p-5 bg-green-600 text-white rounded">
              Retail Rate<br />₹{calculateRetailRate().toFixed(2)}
            </div>
          </div>

          {/* UPDATE FORM */}
          <div className="bg-white p-6 rounded border space-y-4">
            <h3 className="text-lg font-semibold">Update Pricing</h3>

            <input
              type="number"
              value={mcxRate}
              onChange={e => setMcxRate(e.target.value)}
              placeholder="MCX Rate"
              className="w-full border p-3 rounded"
            />

            <input
              type="number"
              value={premiumPercentage}
              onChange={e => setPremiumPercentage(e.target.value)}
              placeholder="Premium %"
              className="w-full border p-3 rounded"
            />

            <button
              onClick={updatePricing}
              disabled={loading}
              className="w-full bg-amber-600 text-white py-3 rounded"
            >
              {loading ? 'Updating...' : 'Update Pricing'}
            </button>

            {success && (
              <p className="text-green-600 text-sm">
                Pricing updated successfully
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
