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
  const [filter, setFilter] = useState<'all' | 'placed' | 'approved' | 'rejected' | 'completed'>('placed')
  const [processingId, setProcessingId] = useState<string | null>(null)

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    const res = await fetch(`${API_BASE}/api/admin/orders`)
    const data = await res.json()
    setOrders(data || [])
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  /* ================= APPROVE ================= */
  const approveOrder = async (orderId: string) => {
    setProcessingId(orderId)
    await fetch(`${API_BASE}/api/admin/orders/${orderId}/approve`, { method: 'PATCH' })
    setProcessingId(null)
    fetchOrders()
  }

  /* ================= REJECT ================= */
  const rejectOrder = async (orderId: string, reason: string) => {
    setProcessingId(orderId)
    await fetch(`${API_BASE}/api/admin/orders/${orderId}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    })
    setProcessingId(null)
    fetchOrders()
  }

  /* ================= COMPLETE ================= */
  const completeOrder = async (orderId: string) => {
    setProcessingId(orderId)
    await fetch(`${API_BASE}/api/admin/orders/${orderId}/complete`, { method: 'PATCH' })
    setProcessingId(null)
    fetchOrders()
  }

  return (
    <div className="space-y-6">
      {/* HEADER & FILTER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Order Management</h2>
        <div className="flex space-x-2">
          {(['all', 'placed', 'approved', 'completed', 'rejected'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === status
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* NO ORDERS */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onApprove={approveOrder}
              onReject={rejectOrder}
              onComplete={completeOrder}
              processing={processingId === order.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface OrderCardProps {
  order: OrderWithDetails
  onApprove: (orderId: string) => void
  onReject: (orderId: string, reason: string) => void
  onComplete: (orderId: string) => void
  processing: boolean
}

function OrderCard({ order, onApprove, onReject, onComplete, processing }: OrderCardProps) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleReject = () => {
    if (!rejectionReason.trim()) return
    onReject(order.id, rejectionReason)
    setShowRejectForm(false)
    setRejectionReason('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'bg-blue-100 text-blue-700'
      case 'approved': return 'bg-amber-100 text-amber-700'
      case 'completed': return 'bg-green-100 text-green-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-slate-900">{order.order_number}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-slate-500">Dealer: {order.dealer_profile.business_name}</p>
            <p className="text-sm text-slate-500">
              Placed on {new Date(order.created_at).toLocaleString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-amber-600">₹{order.final_amount.toFixed(2)}</p>
            <p className="text-sm text-slate-500 capitalize">{order.payment_mode} payment</p>
          </div>
        </div>

        {order.rejected_reason && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <span className="font-medium">Rejection Reason: </span>
              {order.rejected_reason}
            </p>
          </div>
        )}
      </div>

      <div className="p-6">
        <h4 className="font-medium text-slate-900 mb-3">Order Items</h4>
        <div className="space-y-2 mb-4">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-100">
              <div>
                <p className="font-medium text-slate-900">{item.product.name}</p>
                <p className="text-sm text-slate-500">Size: {item.size} | Qty: {item.quantity} | {item.total_weight}g</p>
              </div>
              <p className="font-medium text-slate-900">₹{item.line_total.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2 mb-4 p-4 bg-slate-50 rounded-lg">
          <div className="flex justify-between text-sm"><span>Subtotal:</span><span>₹{order.subtotal.toFixed(2)}</span></div>
          {order.discount_amount > 0 && <div className="flex justify-between text-sm text-green-600">
            <span>Discount {order.coupon_code && `(${order.coupon_code})`}:</span>
            <span>-₹{order.discount_amount.toFixed(2)}</span>
          </div>}
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total:</span>
            <span className="text-amber-600">₹{order.final_amount.toFixed(2)}</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        {order.status === 'placed' && !showRejectForm && (
          <div className="flex space-x-2">
            <button onClick={() => onApprove(order.id)} disabled={processing}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
              <CheckCircle className="w-4 h-4 inline mr-2" /> Approve Order
            </button>
            <button onClick={() => setShowRejectForm(true)} disabled={processing}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50">
              <XCircle className="w-4 h-4 inline mr-2" /> Reject Order
            </button>
          </div>
        )}

        {showRejectForm && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
            <textarea
              rows={3}
              placeholder="Rejection reason..."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2">
              <button onClick={handleReject} disabled={processing || !rejectionReason.trim()}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50">
                Confirm Rejection
              </button>
              <button onClick={() => { setShowRejectForm(false); setRejectionReason('') }}
                className="px-4 py-2 bg-slate-200 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        )}

        {order.status === 'approved' && (
          <button onClick={() => onComplete(order.id)} disabled={processing}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 mt-2">
            <CheckCircle className="w-4 h-4 inline mr-2" /> Mark as Completed
          </button>
        )}
      </div>
    </div>
  )
}
