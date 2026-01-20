import { useState, useEffect } from 'react'
import { Truck, Package, CheckCircle, Clock } from 'lucide-react'
import { DeliveryTracking, Order } from '../../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL // e.g. http://localhost:8080

export default function DeliveryTrackingManager() {
  const [deliveries, setDeliveries] = useState<(DeliveryTracking & { order?: Order })[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryTracking | null>(null)
  const [statusUpdate, setStatusUpdate] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchDeliveries()
  }, [])

  /* ================= FETCH DELIVERIES ================= */
  const fetchDeliveries = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/admin/deliveries`)
      const data = await res.json()
      setDeliveries(data || [])
    } catch (err) {
      console.error('Error fetching deliveries', err)
    } finally {
      setLoading(false)
    }
  }

  /* ================= UPDATE STATUS ================= */
  const handleStatusUpdate = async (deliveryId: string) => {
    if (!statusUpdate) {
      alert('Please select a status')
      return
    }

    try {
      await fetch(`${API_BASE}/api/admin/deliveries/${deliveryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusUpdate,
          notes
        })
      })

      alert('Delivery updated')
      setSelectedDelivery(null)
      fetchDeliveries()
    } catch (err) {
      console.error(err)
      alert('Update failed')
    }
  }

  /* ================= CREATE DELIVERY ================= */
  const createDeliveryTracking = async (orderId: string, deliveryMethod: string) => {
    try {
      await fetch(`${API_BASE}/api/admin/deliveries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          delivery_method: deliveryMethod
        })
      })

      alert('Delivery tracking created')
      fetchDeliveries()
    } catch (err) {
      console.error(err)
      alert('Creation failed')
    }
  }

  /* ================= STATUS ICON ================= */
  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes('delivered')) return <CheckCircle className="w-5 h-5 text-green-500" />
    if (s.includes('transit') || s.includes('out')) return <Truck className="w-5 h-5 text-blue-500" />
    if (s.includes('confirmed') || s.includes('preparing')) return <Package className="w-5 h-5 text-yellow-500" />
    return <Clock className="w-5 h-5 text-slate-500" />
  }

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center h-64 items-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-slate-800 rounded-full" />
      </div>
    )
  }

  /* ================= UPDATE VIEW ================= */
  if (selectedDelivery) {
    return (
      <div className="max-w-4xl mx-auto">
        <button onClick={() => setSelectedDelivery(null)} className="mb-4 text-slate-600">
          ← Back
        </button>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Update Delivery</h2>

          <select
            value={statusUpdate}
            onChange={(e) => setStatusUpdate(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          >
            <option value="">Select Status</option>
            <option>Order Confirmed</option>
            <option>Preparing for Dispatch</option>
            <option>Out for Delivery</option>
            <option>In Transit</option>
            <option>Delivered</option>
            <option>Returned</option>
          </select>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            placeholder="Notes"
          />

          <button
            onClick={() => handleStatusUpdate(selectedDelivery.id)}
            className="bg-slate-800 text-white px-6 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>
    )
  }

  /* ================= LIST VIEW ================= */
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Delivery Tracking</h2>

      {deliveries.map((d) => (
        <div key={d.id} className="bg-white p-6 mb-4 rounded shadow">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">Order #{d.order?.order_number}</h3>
              <div className="flex gap-2 items-center mt-2">
                {getStatusIcon(d.status)}
                <span>{d.status}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedDelivery(d)
                setStatusUpdate(d.status)
                setNotes(d.notes || '')
              }}
              className="bg-slate-800 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>

          <div className="text-sm text-slate-500 mt-3">
            Updated: {new Date(d.updated_at).toLocaleString()}
          </div>
        </div>
      ))}

      {deliveries.length === 0 && (
        <div className="text-center text-slate-500">No deliveries found</div>
      )}
    </div>
  )
}
