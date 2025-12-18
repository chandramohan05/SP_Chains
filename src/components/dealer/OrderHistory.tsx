import { useState } from 'react';
import { Order, OrderItem, Product, Review } from '../../types';
import { Package, Clock, CheckCircle, XCircle, Star } from 'lucide-react';
import { ReviewForm } from './ReviewForm';

type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
};

const mockOrders: OrderWithItems[] = [
  {
    id: '1',
    order_number: 'ORD1703001',
    dealer_id: '1',
    status: 'completed',
    gross_weight: 25.5,
    pure_weight: 24.2,
    wastage: 1.3,
    making_charges: 450,
    subtotal: 2850.50,
    discount_amount: 0,
    final_amount: 2850.50,
    payment_mode: 'online',
    coupon_code: null,
    approved_by: null,
    approved_at: null,
    rejected_reason: null,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: '1',
        order_id: '1',
        product_id: '1',
        size: '24"',
        quantity: 2,
        unit_weight: 15.5,
        total_weight: 31.0,
        rate: 77.39,
        making_charges: 250,
        line_total: 2650.09,
        created_at: new Date().toISOString(),
        product: {
          id: '1',
          erp_product_id: 'ERP001',
          name: 'Silver Chain 24 inch',
          category: 'Chains',
          available_sizes: ['22"', '24"', '26"'],
          base_weight: 15.5,
          stock_quantity: 50,
          making_charges: 250,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    ]
  },
  {
    id: '2',
    order_number: 'ORD1703002',
    dealer_id: '1',
    status: 'placed',
    gross_weight: 15.3,
    pure_weight: 14.5,
    wastage: 0.8,
    making_charges: 320,
    subtotal: 1680.75,
    discount_amount: 168.08,
    final_amount: 1512.67,
    payment_mode: 'credit',
    coupon_code: 'SAVE10',
    approved_by: null,
    approved_at: null,
    rejected_reason: null,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: '2',
        order_id: '2',
        product_id: '3',
        size: '7',
        quantity: 3,
        unit_weight: 8.5,
        total_weight: 25.5,
        rate: 77.39,
        making_charges: 150,
        line_total: 2123.45,
        created_at: new Date().toISOString(),
        product: {
          id: '3',
          erp_product_id: 'ERP003',
          name: 'Silver Ring',
          category: 'Rings',
          available_sizes: ['6', '7', '8', '9'],
          base_weight: 8.5,
          stock_quantity: 100,
          making_charges: 150,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    ]
  }
];

export function OrderHistory() {
  const [orders] = useState<OrderWithItems[]>(mockOrders);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReviewItem, setSelectedReviewItem] = useState<{
    product: Product;
    orderId: string;
  } | null>(null);

  const handleSubmitReview = async (rating: number, reviewText: string) => {
    if (!selectedReviewItem) return;

    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      product_id: selectedReviewItem.product.id,
      dealer_id: '1',
      order_id: selectedReviewItem.orderId,
      rating,
      review_text: reviewText,
      is_synced_to_erp: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setReviews([...reviews, newReview]);
    setSelectedReviewItem(null);
  };

  const hasReview = (productId: string, orderId: string) => {
    return reviews.some(r => r.product_id === productId && r.order_id === orderId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-amber-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-700';
      case 'approved':
        return 'bg-amber-100 text-amber-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h2>
        <p className="text-slate-600">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Orders</h2>

      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <div className="flex justify-between items-start gap-3 mb-3">
              <div className="flex items-center gap-2 flex-1">
                {getStatusIcon(order.status)}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{order.order_number}</h3>
                  <p className="text-xs text-slate-500">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600 capitalize">{order.payment_mode}</span>
              <p className="text-xl font-bold text-amber-600">₹{order.final_amount.toFixed(2)}</p>
            </div>

            {order.rejected_reason && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700">
                  <span className="font-medium">Reason: </span>
                  {order.rejected_reason}
                </p>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="space-y-3 mb-4">
              {order.items.map((item) => (
                <div key={item.id} className="py-2 border-b border-slate-100 last:border-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{item.product.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.size} × {item.quantity} | {item.total_weight}g
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">₹{item.line_total.toFixed(2)}</p>
                  </div>
                  {order.status === 'completed' && !hasReview(item.product.id, order.id) && (
                    <button
                      onClick={() => setSelectedReviewItem({ product: item.product, orderId: order.id })}
                      className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg hover:bg-amber-100 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5" />
                      Write Review
                    </button>
                  )}
                  {hasReview(item.product.id, order.id) && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Review submitted
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount_amount > 0 && (
                <>
                  <div className="flex justify-between text-xs text-green-600">
                    <span>Discount {order.coupon_code && `(${order.coupon_code})`}:</span>
                    <span>-₹{order.discount_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Making Charges:</span>
                    <span className="font-medium">₹{order.making_charges.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Total:</span>
                <span className="text-amber-600">₹{order.final_amount.toFixed(2)}</span>
              </div>
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
  );
}
