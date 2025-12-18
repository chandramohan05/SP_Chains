import { useState } from 'react';
import { Users, Package, DollarSign, Gift, Bell, LogOut } from 'lucide-react';
import { DealerApprovalManager } from './DealerApprovalManager';
import { OrderManagement } from './OrderManagement';
import { PricingManager } from './PricingManager';
import { CouponManager } from './CouponManager';
import { NotificationManager } from './NotificationManager';

type View = 'dealers' | 'orders' | 'pricing' | 'coupons' | 'notifications';

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState<View>('dealers');

  const signOut = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-white">SP Chains Admin</h1>
              <div className="hidden md:flex space-x-2">
                <button
                  onClick={() => setCurrentView('dealers')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'dealers'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Dealers
                </button>
                <button
                  onClick={() => setCurrentView('orders')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'orders'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Package className="w-4 h-4 inline mr-2" />
                  Orders
                </button>
                <button
                  onClick={() => setCurrentView('pricing')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'pricing'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Pricing
                </button>
                <button
                  onClick={() => setCurrentView('coupons')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'coupons'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Gift className="w-4 h-4 inline mr-2" />
                  Coupons
                </button>
                <button
                  onClick={() => setCurrentView('notifications')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'notifications'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Bell className="w-4 h-4 inline mr-2" />
                  Notifications
                </button>
              </div>
            </div>

            <button
              onClick={signOut}
              className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dealers' && <DealerApprovalManager />}
        {currentView === 'orders' && <OrderManagement />}
        {currentView === 'pricing' && <PricingManager />}
        {currentView === 'coupons' && <CouponManager />}
        {currentView === 'notifications' && <NotificationManager />}
      </main>
    </div>
  );
}
