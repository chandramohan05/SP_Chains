import { useEffect, useState } from 'react'
import { Coupon } from '../../types'
import { Gift, Plus, Trash2 } from 'lucide-react'

const API_BASE = 'http://localhost:5000/api'

export function CouponManager() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minQuantity: '1',
    expiryDate: '',
    applicablePaymentModes: {
      online: true,
      credit: true
    }
  })

  /* ---------------- FETCH COUPONS ---------------- */
  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_BASE}/coupons`)
      const data = await res.json()
      setCoupons(data)
    } catch (err) {
      console.error('Failed to load coupons', err)
      alert('Failed to load coupons')
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  /* ---------------- CREATE COUPON ---------------- */
  const createCoupon = async () => {
    if (!formData.code || !formData.discountValue || !formData.expiryDate) {
      alert('Please fill all required fields')
      return
    }

    setLoading(true)

    const paymentModes: string[] = []
    if (formData.applicablePaymentModes.online) paymentModes.push('online')
    if (formData.applicablePaymentModes.credit) paymentModes.push('credit')

    try {
      const res = await fetch(`${API_BASE}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code.toUpperCase(),
          discount_type: formData.discountType,
          discount_value: Number(formData.discountValue),
          min_quantity: Number(formData.minQuantity),
          applicable_payment_modes: paymentModes,
          expiry_date: formData.expiryDate
        })
      })

      if (!res.ok) throw new Error('Create failed')

      await fetchCoupons()
      setShowForm(false)
      resetForm()
    } catch (err) {
      console.error(err)
      alert('Failed to create coupon')
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- TOGGLE STATUS ---------------- */
  const toggleCoupon = async (id: string) => {
    try {
      await fetch(`${API_BASE}/coupons/${id}/toggle`, {
        method: 'PATCH'
      })
      fetchCoupons()
    } catch {
      alert('Failed to update status')
    }
  }

  /* ---------------- DELETE ---------------- */
  const deleteCoupon = async (id: string) => {
    if (!confirm('Delete this coupon?')) return

    try {
      await fetch(`${API_BASE}/coupons/${id}`, { method: 'DELETE' })
      fetchCoupons()
    } catch {
      alert('Failed to delete coupon')
    }
  }

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minQuantity: '1',
      expiryDate: '',
      applicablePaymentModes: { online: true, credit: true }
    })
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Coupon Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Coupon
        </button>
      </div>

      {/* ---------------- FORM ---------------- */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg border">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Coupon Code"
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
              className="input"
            />

            <select
              value={formData.discountType}
              onChange={e =>
                setFormData({ ...formData, discountType: e.target.value as any })
              }
              className="input"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>

            <input
              type="number"
              placeholder="Discount Value"
              value={formData.discountValue}
              onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
              className="input"
            />

            <input
              type="number"
              min="1"
              placeholder="Min Quantity"
              value={formData.minQuantity}
              onChange={e => setFormData({ ...formData, minQuantity: e.target.value })}
              className="input"
            />

            <input
              type="datetime-local"
              value={formData.expiryDate}
              onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
              className="input"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={createCoupon}
              disabled={loading}
              className="bg-amber-600 text-white px-6 py-2 rounded"
            >
              {loading ? 'Saving...' : 'Create'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-slate-200 px-6 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ---------------- LIST ---------------- */}
      {coupons.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-lg">
          <Gift className="w-16 h-16 mx-auto text-slate-300" />
          <p>No coupons found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {coupons.map(c => (
            <div key={c.id} className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between mb-2">
                <h3 className="font-bold">{c.code}</h3>
                <button onClick={() => deleteCoupon(c.id)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

              <p className="text-sm">
                Discount:{' '}
                <strong>
                  {c.discount_type === 'percentage'
                    ? `${c.discount_value}%`
                    : `₹${c.discount_value}`}
                </strong>
              </p>

              <p className="text-sm">Min Qty: {c.min_quantity}</p>
              <p className="text-sm">
                Expires: {new Date(c.expiry_date).toLocaleDateString('en-IN')}
              </p>

              <button
                onClick={() => toggleCoupon(c.id)}
                className={`mt-3 text-xs px-3 py-1 rounded ${
                  c.is_active
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {c.is_active ? 'Disable' : 'Enable'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
