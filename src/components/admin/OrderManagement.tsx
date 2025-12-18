import { useState } from 'react';
import { Order, OrderItem, Product, DealerProfile } from '../../types';
import { CheckCircle, XCircle, Package } from 'lucide-react';

type OrderWithDetails = Order & {
  items: (OrderItem & { product: Product })[];
  dealer_profile: DealerProfile;
};

const mockOrders: OrderWithDetails[] = [
  {
    id: '1',
    order_number: 'ORD1703001',
    dealer_id: '1',
    status: 'placed',
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
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    dealer_profile: {
      id: '1',
      user_id: '1',
      business_name: 'Silver Star Jewellers',
      gst_number: '27AABCU9603R1ZX',
      pan_number: 'AABCU9603R',
      approval_status: 'approved',
      credit_limit: 100000,
      credit_used: 15000,
      approved_by: null,
      approved_at: new Date().toISOString(),
      rejected_reason: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
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
        making_charges: 500,
        line_total: 2900.09,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product: {
          id: '1',
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
    dealer_id: '2',
    status: 'approved',
    gross_weight: 15.3,
    pure_weight: 14.5,
    wastage: 0.8,
    making_charges: 320,
    subtotal: 1680.75,
    discount_amount: 168.08,
    final_amount: 1512.67,
    payment_mode: 'credit',
    coupon_code: 'SAVE10',
    approved_by: 'admin1',
    approved_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    rejected_reason: null,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    dealer_profile: {
      id: '2',
      user_id: '2',
      business_name: 'Gold House Jewellery',
      gst_number: '29AABCU9604R2ZY',
      pan_number: 'AABCU9604S',
      approval_status: 'approved',
      credit_limit: 150000,
      credit_used: 25000,
      approved_by: 'admin1',
      approved_at: new Date().toISOString(),
      rejected_reason: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    items: [
      {
        id: '2',
        order_id: '2',
        product_id: '3',
        size: '7',
        quantity: 5,
        unit_weight: 8.5,
        total_weight: 42.5,
        rate: 77.39,
        making_charges: 750,
        line_total: 4039.08,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product: {
          id: '3',
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

export function OrderManagement() {
  const [orders, setOrders] = useState<OrderWithDetails[]>(mockOrders);
  const [filter, setFilter] = useState<'all' | 'placed' | 'approved' | 'rejected' | 'completed'>('placed');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const approveOrder = (orderId: string) => {
    setProcessingId(orderId);
    setTimeout(() => {
      setOrders(orders.map(o =>
        o.id === orderId ? { ...o, status: 'approved' as const, approved_at: new Date().toISOString() } : o
      ));
      setProcessingId(null);
    }, 500);
  };

  const rejectOrder = (orderId: string, reason: string) => {
    setProcessingId(orderId);
    setTimeout(() => {
      setOrders(orders.map(o =>
        o.id === orderId ? { ...o, status: 'rejected' as const, rejected_reason: reason } : o
      ));
      setProcessingId(null);
    }, 500);
  };

  const completeOrder = (orderId: string) => {
    setProcessingId(orderId);
    setTimeout(() => {
      setOrders(orders.map(o =>
        o.id === orderId ? { ...o, status: 'completed' as const } : o
      ));
      setProcessingId(null);
    }, 500);
  };

  return (
    <div className="space-y-6">
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
  );
}

interface OrderCardProps {
  order: OrderWithDetails;
  onApprove: (orderId: string) => void;
  onReject: (orderId: string, reason: string) => void;
  onComplete: (orderId: string) => void;
  processing: boolean;
}

function OrderCard({ order, onApprove, onReject, onComplete, processing }: OrderCardProps) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(order.id, rejectionReason);
      setShowRejectForm(false);
      setRejectionReason('');
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
            <p className="text-sm text-slate-500">
              Dealer: {order.dealer_profile.business_name}
            </p>
            <p className="text-sm text-slate-500">
              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
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
                <p className="text-sm text-slate-500">
                  Size: {item.size} | Qty: {item.quantity} | {item.total_weight}g
                </p>
              </div>
              <p className="font-medium text-slate-900">₹{item.line_total.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2 mb-4 p-4 bg-slate-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Subtotal:</span>
            <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount {order.coupon_code && `(${order.coupon_code})`}:</span>
              <span>-₹{order.discount_amount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total:</span>
            <span className="text-amber-600">₹{order.final_amount.toFixed(2)}</span>
          </div>
        </div>

        {order.status === 'placed' && (
          <div className="space-y-3">
            {showRejectForm ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Rejection Reason
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    rows={3}
                    placeholder="Provide a reason for rejection..."
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleReject}
                    disabled={processing || !rejectionReason.trim()}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Confirm Rejection
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectionReason('');
                    }}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => onApprove(order.id)}
                  disabled={processing}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Approve Order
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={processing}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4 inline mr-2" />
                  Reject Order
                </button>
              </div>
            )}
          </div>
        )}

        {order.status === 'approved' && (
          <button
            onClick={() => onComplete(order.id)}
            disabled={processing}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Mark as Completed
          </button>
        )}
      </div>
    </div>
  );
}
