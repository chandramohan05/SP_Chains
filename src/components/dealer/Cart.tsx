import { useState, useEffect } from 'react';
import { CartItem, PricingConfig, DealerProfile } from '../../types';
import { Trash2, ShoppingBag } from 'lucide-react';

const mockPricing: PricingConfig = {
  id: '1',
  mcx_rate: 75.50,
  premium_percentage: 2.5,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockDealerProfile: DealerProfile = {
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
};

interface CartProps {
  onCartUpdate: (count: number) => void;
}

export function Cart({ onCartUpdate }: CartProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pricing] = useState<PricingConfig | null>(mockPricing);
  const [dealerProfile] = useState<DealerProfile | null>(mockDealerProfile);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount_type: string; discount_value: number } | null>(null);
  const [paymentMode, setPaymentMode] = useState<'online' | 'credit' | 'rtgs' | 'silver_settlement'>('online');
  const [deliveryMethod, setDeliveryMethod] = useState<'in_person' | 'dealer_delivery'>('in_person');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      setCart(cartData);
      onCartUpdate(cartData.length);
    }
  }, [onCartUpdate]);

  const calculateNetRate = () => {
    if (!pricing) return 0;
    return pricing.mcx_rate * (1 + pricing.premium_percentage / 100);
  };

  const calculateRetailRate = () => {
    return calculateNetRate() * 1.01;
  };

  const calculateItemTotal = (item: CartItem) => {
    const rate = calculateRetailRate();
    const weight = item.product.base_weight * item.quantity;
    return (weight * rate) + (item.product.making_charges * item.quantity);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const getTotalQuantity = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const applyCoupon = () => {
    setError('');
    if (!couponCode.trim()) return;

    if (couponCode.toUpperCase() === 'SAVE10') {
      setAppliedCoupon({
        code: 'SAVE10',
        discount_type: 'percentage',
        discount_value: 10
      });
    } else {
      setError('Invalid or expired coupon code');
    }
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = calculateSubtotal();

    if (appliedCoupon.discount_type === 'percentage') {
      return (subtotal * appliedCoupon.discount_value) / 100;
    } else {
      return appliedCoupon.discount_value;
    }
  };

  const calculateFinalAmount = () => {
    return Math.max(0, calculateSubtotal() - calculateDiscount());
  };

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    onCartUpdate(newCart.length);
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const placeOrder = () => {
    if (cart.length === 0) return;

    if (paymentMode === 'credit' && dealerProfile) {
      const availableCredit = dealerProfile.credit_limit - dealerProfile.credit_used;
      if (calculateFinalAmount() > availableCredit) {
        setError('Insufficient credit limit');
        return;
      }
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setCart([]);
      localStorage.removeItem('cart');
      onCartUpdate(0);
      setSuccess(true);
      setLoading(false);
    }, 1000);
  };

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Placed Successfully!</h2>
        <p className="text-slate-600 mb-6">Your order has been submitted and is awaiting admin approval.</p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-600">Add some products to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Cart</h2>

      {cart.map((item, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
          <div className="flex gap-3">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-slate-900">{item.product.name}</h3>
              <p className="text-xs text-slate-500 mb-2">{item.product.category}</p>
              <div className="space-y-1 text-xs">
                <p className="text-slate-600">Size: <span className="font-medium">{item.size}</span></p>
                <p className="text-slate-600">Weight: <span className="font-medium">{item.product.base_weight}g</span></p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end justify-between">
              <p className="text-lg font-bold text-amber-600">₹{calculateItemTotal(item).toFixed(2)}</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1.5 border border-slate-300 rounded-lg text-center text-sm"
                />
                <button
                  onClick={() => removeFromCart(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200 sticky bottom-20 md:static">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Order Summary</h3>

        <div className="space-y-2 mb-4 pb-4 border-b border-slate-200">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Subtotal:</span>
            <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({appliedCoupon.code}):</span>
              <span>-₹{calculateDiscount().toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-2">
            <span>Total:</span>
            <span className="text-amber-600">₹{calculateFinalAmount().toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => {
                setPaymentMode(e.target.value as 'online' | 'credit' | 'rtgs' | 'silver_settlement');
                setAppliedCoupon(null);
              }}
              className="w-full px-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
            >
              <option value="online">Online Payment</option>
              <option value="rtgs">RTGS (Advance Payment)</option>
              <option value="silver_settlement">Silver Settlement</option>
              <option value="credit">Dealer Credit</option>
            </select>
            {paymentMode === 'credit' && dealerProfile && (
              <p className="text-xs text-slate-500 mt-2">
                Available: ₹{(dealerProfile.credit_limit - dealerProfile.credit_used).toLocaleString('en-IN')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Delivery Method</label>
            <select
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value as 'in_person' | 'dealer_delivery')}
              className="w-full px-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
            >
              <option value="in_person">In-Person Delivery</option>
              <option value="dealer_delivery">Dealer Delivery</option>
            </select>
            {deliveryMethod === 'dealer_delivery' && (
              <p className="text-xs text-slate-500 mt-2">
                Available for RTGS, Silver Payment & Dealer Credit orders
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Coupon Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="flex-1 px-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
              />
              <button
                onClick={applyCoupon}
                className="px-4 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 active:bg-slate-400 transition-colors font-medium"
              >
                Apply
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full bg-amber-600 text-white py-4 rounded-xl font-semibold hover:bg-amber-700 active:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
