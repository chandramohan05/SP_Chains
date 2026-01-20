import { useState, useEffect } from 'react'
import { CartItem, PricingConfig, DealerProfile } from '../../types'
import { Trash2, ShoppingBag } from 'lucide-react'

/* ================= MOCK DATA (TEMP) ================= */

const mockPricing: PricingConfig = {
  id: '1',
  mcx_rate: 75.5,
  premium_percentage: 2.5,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

const mockDealerProfile: DealerProfile = {
  id: '1',
  user_id: '1',
  business_name: 'Silver Star Jewellers',
  gst_number: '27AABCU9603R1ZX',
  pan_number: 'AABCU9603R',
  approval_status: 'approved',
  credit_limit: 100000,
  credit_used: 15000,
  approved_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

/* ================= COMPONENT ================= */

interface CartProps {
  onCartUpdate: (count: number) => void
}

export function Cart({ onCartUpdate }: CartProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [pricing] = useState<PricingConfig>(mockPricing)
  const [dealerProfile] = useState<DealerProfile>(mockDealerProfile)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    discount_type: 'percentage' | 'fixed'
    discount_value: number
  } | null>(null)

  const [paymentMode, setPaymentMode] =
    useState<'online' | 'credit' | 'rtgs' | 'silver_settlement'>('online')
  const [deliveryMethod, setDeliveryMethod] =
    useState<'in_person' | 'dealer_delivery'>('in_person')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  /* ================= LOAD CART ================= */

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const cartData: CartItem[] = JSON.parse(savedCart)
      setCart(cartData)
      onCartUpdate(
        cartData.reduce((sum, item) => sum + item.quantity, 0)
      )
    }
  }, [onCartUpdate])

  /* ================= CALCULATIONS ================= */

  const calculateNetRate = () =>
    pricing.mcx_rate * (1 + pricing.premium_percentage / 100)

  const calculateRetailRate = () => calculateNetRate() * 1.01

  const calculateItemTotal = (item: CartItem) => {
    const rate = calculateRetailRate()
    const weight = item.product.base_weight * item.quantity
    return weight * rate + item.product.making_charges * item.quantity
  }

  const calculateSubtotal = () =>
    cart.reduce((sum, item) => sum + calculateItemTotal(item), 0)

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0
    const subtotal = calculateSubtotal()

    return appliedCoupon.discount_type === 'percentage'
      ? (subtotal * appliedCoupon.discount_value) / 100
      : appliedCoupon.discount_value
  }

  const calculateFinalAmount = () =>
    Math.max(0, calculateSubtotal() - calculateDiscount())

  const getTotalQuantity = () =>
    cart.reduce((sum, item) => sum + item.quantity, 0)

  /* ================= CART ACTIONS ================= */

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    onCartUpdate(getTotalQuantity())
  }

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return
    const newCart = [...cart]
    newCart[index].quantity = quantity
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    onCartUpdate(getTotalQuantity())
  }

  /* ================= COUPON ================= */

  const applyCoupon = () => {
    setError('')
    if (couponCode === 'SAVE10') {
      setAppliedCoupon({
        code: 'SAVE10',
        discount_type: 'percentage',
        discount_value: 10
      })
    } else {
      setError('Invalid coupon code')
    }
  }

  /* ================= PLACE ORDER ================= */

  const placeOrder = () => {
    if (!cart.length) return

    if (paymentMode === 'credit') {
      const available =
        dealerProfile.credit_limit - dealerProfile.credit_used
      if (calculateFinalAmount() > available) {
        setError('Insufficient credit limit')
        return
      }
    }

    setLoading(true)
    setError('')

    setTimeout(() => {
      setCart([])
      localStorage.removeItem('cart')
      onCartUpdate(0)
      setSuccess(true)
      setLoading(false)
    }, 1000)
  }

  /* ================= UI STATES ================= */

  if (success) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-green-600">
          Order Placed Successfully!
        </h2>
      </div>
    )
  }

  if (!cart.length) {
    return (
      <div className="bg-white p-12 text-center rounded-lg">
        <ShoppingBag className="w-16 h-16 mx-auto text-slate-300" />
        <h2 className="text-xl font-bold mt-2">Your cart is empty</h2>
      </div>
    )
  }

  /* ================= MAIN UI ================= */

  return (
    <div className="space-y-4">
      {cart.map((item, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-sm text-slate-500">
                Size: {item.size} | Weight: {item.product.base_weight}g
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold text-amber-600">
                ₹{calculateItemTotal(item).toFixed(2)}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e =>
                    updateQuantity(index, Number(e.target.value))
                  }
                  className="w-16 border rounded px-2 py-1"
                />
                <button onClick={() => removeFromCart(index)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <p className="flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-amber-600">
            ₹{calculateFinalAmount().toFixed(2)}
          </span>
        </p>

        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}

        <button
          onClick={placeOrder}
          disabled={loading}
          className="w-full mt-4 bg-amber-600 text-white py-3 rounded-lg"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}
