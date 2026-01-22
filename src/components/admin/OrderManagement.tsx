import { useEffect, useState } from 'react'
import { Order, OrderItem, Product, DealerProfile } from '../../types'
import { CheckCircle, XCircle, Package } from 'lucide-react'

type OrderWithDetails = Order & {
  items: (OrderItem & { product: Product })[]
  dealer_profile: DealerProfile
}

const API_BASE = import.meta.env.VITE_API_BASE_URL

export function OrderManagement() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [filter, setFilter] =
    useState<'all' | 'placed' | 'approved' | 'rejected' | 'completed'>('placed')
  const [processingId, setProcessingId] = useState<string | null>(null)

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
  const token = localStorage.getItem('adminToken')

  if (!token) {
    console.error('Admin token missing')
    return
  }

  try {
    const res = await fetch(`${API_BASE}/api/admin/orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error('Unauthorized')
    }

    const data = await res.json()
    setOrders(data)
  } catch (err) {
    console.error('Fetch orders error:', err)
  }
}



  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders =
    filter === 'all' ? orders : orders.filter(o => o.status === filter)

  /* ================= APPROVE ================= */
  const approveOrder = async (orderId: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      setProcessingId(orderId)

      await fetch(`${API_BASE}/api/admin/orders/${orderId}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })

      fetchOrders()
    } finally {
      setProcessingId(null)
    }
  }

  /* ================= REJECT ================= */
  const rejectOrder = async (orderId: string, reason: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      setProcessingId(orderId)

      await fetch(`${API_BASE}/api/admin/orders/${orderId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      })

      fetchOrders()
    } finally {
      setProcessingId(null)
    }
  }

  /* ================= COMPLETE ================= */
  const completeOrder = async (orderId: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      setProcessingId(orderId)

      await fetch(`${API_BASE}/api/admin/orders/${orderId}/complete`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })

      fetchOrders()
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="flex gap-2">
          {(['all', 'placed', 'approved', 'completed', 'rejected'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded ${
                filter === s ? 'bg-amber-600 text-white' : 'border'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white p-10 rounded text-center">
          <Package className="mx-auto mb-3 text-slate-300" size={40} />
          No orders found
        </div>
      ) : (
        filteredOrders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            processing={processingId === order.id}
            onApprove={approveOrder}
            onReject={rejectOrder}
            onComplete={completeOrder}
          />
        ))
      )}
    </div>
  )
}

/* ================= ORDER CARD ================= */

function OrderCard({
  order,
  processing,
  onApprove,
  onReject,
  onComplete
}: any) {
  const [reason, setReason] = useState('')
  const [showReject, setShowReject] = useState(false)

  return (
    <div className="bg-white p-6 rounded border">
      <div className="flex justify-between mb-3">
        <div>
          <h3 className="font-bold">{order.order_number}</h3>
          <p className="text-sm text-slate-500">
            Dealer: {order.dealer_profile.business_name}
          </p>
        </div>
        <span className="uppercase text-xs">{order.status}</span>
      </div>

      {order.status === 'placed' && (
        <div className="flex gap-2">
          <button
            disabled={processing}
            onClick={() => onApprove(order.id)}
            className="bg-green-600 text-white flex-1 py-2 rounded"
          >
            <CheckCircle className="inline w-4 h-4 mr-1" />
            Approve
          </button>
          <button
            onClick={() => setShowReject(!showReject)}
            className="bg-red-600 text-white flex-1 py-2 rounded"
          >
            <XCircle className="inline w-4 h-4 mr-1" />
            Reject
          </button>
        </div>
      )}

      {showReject && (
        <div className="mt-3">
          <textarea
            className="border w-full p-2 mb-2"
            placeholder="Rejection reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
          <button
            onClick={() => onReject(order.id, reason)}
            className="bg-red-700 text-white w-full py-2 rounded"
          >
            Confirm Reject
          </button>
        </div>
      )}

      {order.status === 'approved' && (
        <button
          disabled={processing}
          onClick={() => onComplete(order.id)}
          className="mt-3 bg-green-700 text-white w-full py-2 rounded"
        >
          Mark Completed
        </button>
      )}
    </div>
  )
}
