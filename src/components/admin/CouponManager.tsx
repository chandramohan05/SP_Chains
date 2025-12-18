import { useState } from 'react';
import { Coupon } from '../../types';
import { Gift, Plus, Trash2 } from 'lucide-react';

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'SAVE10',
    discount_type: 'percentage',
    discount_value: 10,
    min_quantity: 1,
    applicable_payment_modes: ['online', 'credit'],
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_by: 'admin1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    code: 'WELCOME500',
    discount_type: 'fixed',
    discount_value: 500,
    min_quantity: 5,
    applicable_payment_modes: ['online'],
    expiry_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_by: 'admin1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function CouponManager() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
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
  });

  const createCoupon = () => {
    if (!formData.code || !formData.discountValue || !formData.expiryDate) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const paymentModes = [];
      if (formData.applicablePaymentModes.online) paymentModes.push('online');
      if (formData.applicablePaymentModes.credit) paymentModes.push('credit');

      const newCoupon: Coupon = {
        id: Date.now().toString(),
        code: formData.code.toUpperCase(),
        discount_type: formData.discountType,
        discount_value: parseFloat(formData.discountValue),
        min_quantity: parseInt(formData.minQuantity),
        applicable_payment_modes: paymentModes as any,
        expiry_date: new Date(formData.expiryDate).toISOString(),
        is_active: true,
        created_by: 'admin1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setCoupons([newCoupon, ...coupons]);
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minQuantity: '1',
        expiryDate: '',
        applicablePaymentModes: { online: true, credit: true }
      });
      setShowForm(false);
      setLoading(false);
    }, 500);
  };

  const toggleCoupon = (couponId: string, currentStatus: boolean) => {
    setCoupons(coupons.map(c =>
      c.id === couponId ? { ...c, is_active: !currentStatus } : c
    ));
  };

  const deleteCoupon = (couponId: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(coupons.filter(c => c.id !== couponId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Coupon Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Coupon
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">New Coupon</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Coupon Code
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g., WELCOME10"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Discount Type
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={formData.discountType === 'percentage' ? 'e.g., 10' : 'e.g., 500'}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Minimum Quantity
              </label>
              <input
                type="number"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                min="1"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Expiry Date
              </label>
              <input
                type="datetime-local"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Applicable Payment Modes
              </label>
              <div className="flex space-x-4 pt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.applicablePaymentModes.online}
                    onChange={(e) => setFormData({
                      ...formData,
                      applicablePaymentModes: {
                        ...formData.applicablePaymentModes,
                        online: e.target.checked
                      }
                    })}
                    className="mr-2"
                  />
                  Online
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.applicablePaymentModes.credit}
                    onChange={(e) => setFormData({
                      ...formData,
                      applicablePaymentModes: {
                        ...formData.applicablePaymentModes,
                        credit: e.target.checked
                      }
                    })}
                    className="mr-2"
                  />
                  Credit
                </label>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={createCoupon}
              disabled={loading}
              className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Coupon'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {coupons.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Gift className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No coupons created yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map(coupon => (
            <div key={coupon.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{coupon.code}</h3>
                  <p className={`text-sm ${coupon.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {coupon.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleCoupon(coupon.id, coupon.is_active)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      coupon.is_active
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {coupon.is_active ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => deleteCoupon(coupon.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Discount:</span>
                  <span className="font-medium text-amber-600">
                    {coupon.discount_type === 'percentage'
                      ? `${coupon.discount_value}%`
                      : `₹${coupon.discount_value}`
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Min Quantity:</span>
                  <span className="font-medium">{coupon.min_quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Modes:</span>
                  <span className="font-medium capitalize">
                    {coupon.applicable_payment_modes.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Expires:</span>
                  <span className="font-medium">
                    {new Date(coupon.expiry_date).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
