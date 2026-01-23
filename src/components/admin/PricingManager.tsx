import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp } from 'lucide-react'
import { PricingConfig } from '../../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL

export function PricingManager() {
  const [pricing, setPricing] = useState<PricingConfig | null>(null)
  const [mcxRate, setMcxRate] = useState('')
  const [premiumPercentage, setPremiumPercentage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPricing()
  }, [])

 const getAdminToken = () => {
  return localStorage.getItem('adminToken')
}



  /* ================= AUTH HEADER ================= */
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
  }

  /* ================= FETCH PRICING ================= */
  const fetchPricing = async () => {
  const token = getAdminToken()

  if (!token) {
    setError('Admin session expired. Please login again.')
    return
  }

  try {
    const res = await fetch(`${API_BASE}/api/admin/pricing`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Pricing API error:', text)
      throw new Error('Unauthorized')
    }

    const data: PricingConfig = await res.json()
    setPricing(data)
    setMcxRate(data.mcx_rate.toString())
    setPremiumPercentage(data.premium_percentage.toString())
  } catch (err) {
    setError('Failed to fetch pricing')
  }
}

  /* ================= CALCULATIONS ================= */
  const calculateNetRate = () => {
    const mcx = parseFloat(mcxRate) || 0
    const premium = parseFloat(premiumPercentage) || 0
    return mcx * (1 + premium / 100)
  }

  const calculateRetailRate = () => calculateNetRate() * 1.01

  /* ================= UPDATE PRICING ================= */
  const updatePricing = async () => {
  const token = getAdminToken()

  if (!token) {
    setError('Admin session expired. Please login again.')
    return
  }

  if (!mcxRate || !premiumPercentage) {
    setError('Please fill all fields')
    return
  }

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
  } finally {
    setLoading(false)
  }
}



 if (!pricing) {
  return <p className="text-center mt-12 text-slate-500">{error || 'Loading pricing...'}</p>
}


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Pricing Configuration</h2>

      {/* RATE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-75" />
          </div>
          <p className="text-sm opacity-90 mb-1">MCX Silver Rate</p>
          <p className="text-3xl font-bold">₹{pricing.mcx_rate.toFixed(2)}/g</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-75" />
          </div>
          <p className="text-sm opacity-90 mb-1">Net Rate (Wholesale)</p>
          <p className="text-3xl font-bold">
            ₹{calculateNetRate().toFixed(2)}/g
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-75" />
          </div>
          <p className="text-sm opacity-90 mb-1">Retail Rate (+1%)</p>
          <p className="text-3xl font-bold">
            ₹{calculateRetailRate().toFixed(2)}/g
          </p>
        </div>
      </div>

      {/* UPDATE FORM */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Update Pricing
        </h3>

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Pricing updated successfully!
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              MCX Silver Rate (₹/gram)
            </label>
            <input
              type="number"
              step="0.01"
              value={mcxRate}
              onChange={(e) => setMcxRate(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Premium Percentage (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={premiumPercentage}
              onChange={(e) => setPremiumPercentage(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <button
          onClick={updatePricing}
          disabled={loading}
          className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Pricing'}
        </button>
      </div>

      {/* LAST UPDATED */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Pricing History
        </h3>
        <p className="text-sm text-slate-600">
          Last updated:{' '}
          {new Date(pricing.updated_at).toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  )
}
