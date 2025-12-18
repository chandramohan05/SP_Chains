import { useState } from 'react';
import { ShoppingCart, Package, Home, User, ArrowLeft, Menu, X, LogOut, MessageSquare, Warehouse } from 'lucide-react';
import { ProductCatalogue } from './ProductCatalogue';
import { Cart } from './Cart';
import { OrderHistory } from './OrderHistory';
import { DealerProfile } from './DealerProfile';
import SupportTickets from './SupportTickets';
import InventoryManager from './InventoryManager';
import BannerCarousel from './BannerCarousel';
import { DealerProfile as DealerProfileType } from '../../types';
import { useAuth } from '../../context/AuthContext';

type View = 'home' | 'products' | 'cart' | 'orders' | 'profile' | 'support' | 'inventory';

const mockDealerProfile: DealerProfileType = {
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

export function DealerDashboard() {
  const { signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');
  const [dealerProfile] = useState<DealerProfileType | null>(mockDealerProfile);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const updateCartCount = (count: number) => {
    setCartCount(count);
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
    setMenuOpen(false);
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'home': return 'SP Chains';
      case 'products': return 'Products';
      case 'cart': return 'Cart';
      case 'orders': return 'Orders';
      case 'profile': return 'Profile';
      case 'support': return 'Support';
      case 'inventory': return 'My Inventory';
      default: return 'SP Chains';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {currentView !== 'home' && (
                <button
                  onClick={() => navigateTo('home')}
                  className="p-2 -ml-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Back to home"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-slate-900 truncate">{getPageTitle()}</h1>
                {dealerProfile && currentView === 'home' && (
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    Credit: ₹{(dealerProfile.credit_limit - dealerProfile.credit_used).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => navigateTo('cart')}
                  className="p-2 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                  aria-label="View cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              <button
                onClick={() => navigateTo('home')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === 'home' ? 'bg-amber-50 text-amber-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </button>
              <button
                onClick={() => navigateTo('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === 'products' ? 'bg-amber-50 text-amber-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">Products</span>
              </button>
              <button
                onClick={() => navigateTo('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === 'orders' ? 'bg-amber-50 text-amber-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">Orders</span>
              </button>
              <button
                onClick={() => navigateTo('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === 'profile' ? 'bg-amber-50 text-amber-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </button>
              <button
                onClick={() => navigateTo('inventory')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === 'inventory' ? 'bg-amber-50 text-amber-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Warehouse className="w-5 h-5" />
                <span className="font-medium">My Inventory</span>
              </button>
              <button
                onClick={() => navigateTo('support')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === 'support' ? 'bg-amber-50 text-amber-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Support</span>
              </button>
              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        {currentView === 'home' && <DealerHome onNavigate={setCurrentView} profile={dealerProfile} />}
        {currentView === 'products' && <ProductCatalogue onCartUpdate={updateCartCount} />}
        {currentView === 'cart' && <Cart onCartUpdate={updateCartCount} />}
        {currentView === 'orders' && <OrderHistory />}
        {currentView === 'profile' && dealerProfile && <DealerProfile profile={dealerProfile} />}
        {currentView === 'support' && <SupportTickets />}
        {currentView === 'inventory' && <InventoryManager />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden z-20 safe-area-inset-bottom">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center justify-center py-2 px-3 flex-1 transition-colors ${
              currentView === 'home' ? 'text-amber-600' : 'text-slate-500'
            }`}
            aria-label="Home"
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => navigateTo('products')}
            className={`flex flex-col items-center justify-center py-2 px-3 flex-1 transition-colors ${
              currentView === 'products' ? 'text-amber-600' : 'text-slate-500'
            }`}
            aria-label="Products"
          >
            <Package className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Products</span>
          </button>
          <button
            onClick={() => navigateTo('orders')}
            className={`flex flex-col items-center justify-center py-2 px-3 flex-1 transition-colors ${
              currentView === 'orders' ? 'text-amber-600' : 'text-slate-500'
            }`}
            aria-label="Orders"
          >
            <Package className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Orders</span>
          </button>
          <button
            onClick={() => navigateTo('inventory')}
            className={`flex flex-col items-center justify-center py-2 px-3 flex-1 transition-colors ${
              currentView === 'inventory' ? 'text-amber-600' : 'text-slate-500'
            }`}
            aria-label="Inventory"
          >
            <Warehouse className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Inventory</span>
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex flex-col items-center justify-center py-2 px-3 flex-1 transition-colors ${
              menuOpen ? 'text-amber-600' : 'text-slate-500'
            }`}
            aria-label="More"
          >
            <Menu className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

interface DealerHomeProps {
  onNavigate: (view: View) => void;
  profile: DealerProfileType | null;
}

function DealerHome({ onNavigate, profile }: DealerHomeProps) {
  return (
    <div className="space-y-4">
      <BannerCarousel />

      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
        <p className="text-amber-100 mb-4">{profile?.business_name}</p>
        <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl p-4">
          <div>
            <p className="text-sm text-amber-100 mb-1">Available Credit</p>
            <p className="text-2xl font-bold">
              ₹{profile ? (profile.credit_limit - profile.credit_used).toLocaleString('en-IN') : '0'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-amber-100 mb-1">Total Limit</p>
            <p className="text-lg font-semibold">
              ₹{profile?.credit_limit.toLocaleString('en-IN') || '0'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('products')}
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 active:scale-95 transition-transform"
          >
            <Package className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">Browse Products</span>
          </button>
          <button
            onClick={() => onNavigate('orders')}
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 active:scale-95 transition-transform"
          >
            <Package className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">My Orders</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-900">Live Rates</h3>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
            LIVE
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div>
              <p className="text-sm text-slate-600 mb-1">MCX Silver</p>
              <p className="text-xl font-bold text-slate-900">₹75.50/g</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-green-600 font-medium">+2.5%</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div>
              <p className="text-sm text-slate-600 mb-1">Retail Rate</p>
              <p className="text-xl font-bold text-amber-600">₹78.22/g</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium">+3.6%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">💡</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Special Offer!</h4>
            <p className="text-sm text-blue-700">Use code SAVE10 for 10% off on your next order</p>
          </div>
        </div>
      </div>
    </div>
  );
}
