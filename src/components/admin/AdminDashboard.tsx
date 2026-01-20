import { useState } from 'react';
import {
  Users,
  Package,
  DollarSign,
  Gift,
  Bell,
  LogOut,
  Star,
  Image,
  MessageSquare,
  Truck
} from 'lucide-react';

import { DealerApprovalManager } from './DealerApprovalManager';
import { OrderManagement } from './OrderManagement';
import { PricingManager } from './PricingManager';
import { CouponManager } from './CouponManager';
import { NotificationManager } from './NotificationManager';
import { ReviewManager } from './ReviewManager';
import BannerManager from './BannerManager';
import SupportTicketManager from './SupportTicketManager';
import DeliveryTrackingManager from './DeliveryTrackingManager';

type View =
  | 'dealers'
  | 'orders'
  | 'pricing'
  | 'coupons'
  | 'notifications'
  | 'reviews'
  | 'banners'
  | 'support'
  | 'delivery';

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [currentView, setCurrentView] = useState<View>('dealers');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= NAVBAR ================= */}
      <nav className="bg-slate-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-white">
                SP Chains Admin
              </h1>

              <div className="hidden md:flex space-x-2">
                <NavButton active={currentView === 'dealers'} onClick={() => setCurrentView('dealers')} icon={<Users className="w-4 h-4 mr-2" />} label="Dealers" />
                <NavButton active={currentView === 'orders'} onClick={() => setCurrentView('orders')} icon={<Package className="w-4 h-4 mr-2" />} label="Orders" />
                <NavButton active={currentView === 'pricing'} onClick={() => setCurrentView('pricing')} icon={<DollarSign className="w-4 h-4 mr-2" />} label="Pricing" />
                <NavButton active={currentView === 'coupons'} onClick={() => setCurrentView('coupons')} icon={<Gift className="w-4 h-4 mr-2" />} label="Coupons" />
                <NavButton active={currentView === 'notifications'} onClick={() => setCurrentView('notifications')} icon={<Bell className="w-4 h-4 mr-2" />} label="Notifications" />
                <NavButton active={currentView === 'reviews'} onClick={() => setCurrentView('reviews')} icon={<Star className="w-4 h-4 mr-2" />} label="Reviews" />
                <NavButton active={currentView === 'banners'} onClick={() => setCurrentView('banners')} icon={<Image className="w-4 h-4 mr-2" />} label="Banners" />
                <NavButton active={currentView === 'support'} onClick={() => setCurrentView('support')} icon={<MessageSquare className="w-4 h-4 mr-2" />} label="Support" />
                <NavButton active={currentView === 'delivery'} onClick={() => setCurrentView('delivery')} icon={<Truck className="w-4 h-4 mr-2" />} label="Delivery" />
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dealers' && <DealerApprovalManager />}
        {currentView === 'orders' && <OrderManagement />}
        {currentView === 'pricing' && <PricingManager />}
        {currentView === 'coupons' && <CouponManager />}
        {currentView === 'notifications' && <NotificationManager />}
        {currentView === 'reviews' && <ReviewManager />}
        {currentView === 'banners' && <BannerManager />}
        {currentView === 'support' && <SupportTicketManager />}
        {currentView === 'delivery' && <DeliveryTrackingManager />}
      </main>
    </div>
  );
}

/* ================= REUSABLE NAV BUTTON ================= */

function NavButton({
  active,
  onClick,
  icon,
  label
}: {
  active: boolean;
  onClick: () => void;
  icon: JSX.Element;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
        active
          ? 'bg-amber-600 text-white'
          : 'text-slate-300 hover:text-white hover:bg-slate-800'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
