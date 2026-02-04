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
  Truck,
  Menu,
  X
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setMobileMenuOpen(false); // close menu on mobile click
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* ================= NAVBAR ================= */}
      <nav className="bg-slate-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <h1 className="text-lg sm:text-2xl font-bold text-white truncate">
                SP Chains Admin
              </h1>
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden lg:flex items-center gap-1">
              <NavButton active={currentView === 'dealers'} onClick={() => handleNavClick('dealers')} icon={<Users className="w-4 h-4 mr-2" />} label="Dealers" />
              <NavButton active={currentView === 'orders'} onClick={() => handleNavClick('orders')} icon={<Package className="w-4 h-4 mr-2" />} label="Orders" />
              <NavButton active={currentView === 'pricing'} onClick={() => handleNavClick('pricing')} icon={<DollarSign className="w-4 h-4 mr-2" />} label="Pricing" />
              <NavButton active={currentView === 'coupons'} onClick={() => handleNavClick('coupons')} icon={<Gift className="w-4 h-4 mr-2" />} label="Coupons" />
              <NavButton active={currentView === 'notifications'} onClick={() => handleNavClick('notifications')} icon={<Bell className="w-4 h-4 mr-2" />} label="Notifications" />
              <NavButton active={currentView === 'reviews'} onClick={() => handleNavClick('reviews')} icon={<Star className="w-4 h-4 mr-2" />} label="Reviews" />
              <NavButton active={currentView === 'banners'} onClick={() => handleNavClick('banners')} icon={<Image className="w-4 h-4 mr-2" />} label="Banners" />
              <NavButton active={currentView === 'support'} onClick={() => handleNavClick('support')} icon={<MessageSquare className="w-4 h-4 mr-2" />} label="Support" />
              <NavButton active={currentView === 'delivery'} onClick={() => handleNavClick('delivery')} icon={<Truck className="w-4 h-4 mr-2" />} label="Delivery" />
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              <button
                onClick={onLogout}
                className="hidden sm:flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>

              {/* MOBILE MENU BUTTON */}
              <button
                className="lg:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-800 px-4 py-3 space-y-2">
            <MobileNav label="Dealers" onClick={() => handleNavClick('dealers')} />
            <MobileNav label="Orders" onClick={() => handleNavClick('orders')} />
            <MobileNav label="Pricing" onClick={() => handleNavClick('pricing')} />
            <MobileNav label="Coupons" onClick={() => handleNavClick('coupons')} />
            <MobileNav label="Notifications" onClick={() => handleNavClick('notifications')} />
            <MobileNav label="Reviews" onClick={() => handleNavClick('reviews')} />
            <MobileNav label="Banners" onClick={() => handleNavClick('banners')} />
            <MobileNav label="Support" onClick={() => handleNavClick('support')} />
            <MobileNav label="Delivery" onClick={() => handleNavClick('delivery')} />
            <button
              onClick={onLogout}
              className="w-full text-left text-red-400 py-2"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 py-6">
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

/* ================= DESKTOP BUTTON ================= */
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
      className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
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

/* ================= MOBILE BUTTON ================= */
function MobileNav({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="block w-full text-left text-slate-200 hover:bg-slate-700 px-3 py-2 rounded"
    >
      {label}
    </button>
  );
}
