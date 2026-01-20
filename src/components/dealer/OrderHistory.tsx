import { useState, useEffect } from 'react'
import { Order, OrderItem, Product, Review } from '../../types'
import { Package, Clock, CheckCircle, XCircle, Star } from 'lucide-react'
import { ReviewForm } from './ReviewForm'
import { useAuth } from '../../context/AuthContext'

type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[]
}

export function OrderHistory() {
  const { user } = useAuth()

  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReviewItem, setSelectedReviewItem] = useState<{
    product: Product
    orderId: string
  } | null>(null)

  useEffect(() => {
    if (!user?.id) return
    fetchOrders()
  }, [user?.id])

  // 🔁 TEMP MOCK FETCH (replace with API later)
  const fetchOrders = async () => {
    setLoading(true)

    // simulate API delay
    setTimeout(() => {
      setOrders([
        {
  id: '1',
  order_number: 'ORD1703001',
  dealer_id: user!.id,
  status: 'completed',
  gross_weight: 25.5,
  pure_weight: 24.2,
  wastage: 1.3,
  making_charges: 450,
  subtotal: 2850.5,
  discount_amount: 0,
  final_amount: 2850.5,
  pure_payable: 24.2,
  payment_mode: 'online',
  coupon_code: undefined,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  items: [
    {
      id: '1',
      order_id: '1',
      product_id: '1',
      size: '24"',
      quantity: 2,
      unit_weight: 15.5,
      total_weight: 31,
      rate: 77.39,
      making_charges: 250,
      line_total: 2650.09,
      created_at: new Date().toISOString(),
      product: {
        id: '1',
        name: 'Silver Chain 24 inch',
        category: 'Chains',
        base_weight: 15.5,
        available_sizes: ['22"', '24"', '26"'],
        stock_quantity: 50,
        making_charges: 250,
        is_active: true,
        weight_per_inch: 0.6,
        wastage_percent: 5,
        purity_percent: 92.5,
        size_range_start: 22,
        size_range_end: 26,
        size_increment: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
  ]
}

      ])
      setLoading(false)
    }, 500)
  }

  const handleSubmitReview = (rating: number, reviewText: string) => {
    if (!selectedReviewItem || !user) return

    const newReview: Review = {
      id: crypto.randomUUID(),
      product_id: selectedReviewItem.product.id,
      dealer_id: user.id,
      order_id: selectedReviewItem.orderId,
      rating,
      review_text: reviewText,
      is_synced_to_erp: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setReviews(prev => [...prev, newReview])
    setSelectedReviewItem(null)
  }

  const hasReview = (productId: string, orderId: string) =>
    reviews.some(r => r.product_id === productId && r.order_id === orderId)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-amber-600" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Package className="w-5 h-5 text-slate-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-700'
      case 'approved':
        return 'bg-amber-100 text-amber-700'
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading orders...</div>
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center">
        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold">No orders yet</h2>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Orders</h2>

      {orders.map(order => (
        <div key={order.id} className="bg-white rounded-xl border">
          <div className="p-4 border-b bg-slate-50 flex justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              <span className="font-semibold">{order.order_number}</span>
            </div>
            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(order.status)}`}>
              {order.status.toUpperCase()}
            </span>
          </div>

          <div className="p-4 space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="border-b pb-2">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-xs text-slate-500">
                  {item.size} × {item.quantity}
                </p>

                {order.status === 'completed' && !hasReview(item.product.id, order.id) && (
                  <button
                    onClick={() =>
                      setSelectedReviewItem({
                        product: item.product,
                        orderId: order.id
                      })
                    }
                    className="mt-2 text-xs text-amber-700 bg-amber-50 px-3 py-1 rounded"
                  >
                    <Star className="inline w-3 h-3 mr-1" />
                    Write Review
                  </button>
                )}
              </div>
            ))}

            <div className="text-right font-bold text-amber-600">
              ₹{order.final_amount.toFixed(2)}
            </div>
          </div>
        </div>
      ))}

      {selectedReviewItem && (
        <ReviewForm
          product={selectedReviewItem.product}
          orderId={selectedReviewItem.orderId}
          onSubmit={handleSubmitReview}
          onClose={() => setSelectedReviewItem(null)}
        />
      )}
    </div>
  )
}
