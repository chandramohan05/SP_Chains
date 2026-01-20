import { useState } from 'react'
import {
  ShoppingCart,
  Package,
  Home,
  User,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  MessageSquare,
  Warehouse
} from 'lucide-react'

import { ProductCatalogue } from './ProductCatalogue'
import { Cart } from './Cart'
import { OrderHistory } from './OrderHistory'
import { DealerProfile } from './DealerProfile'
import SupportTickets from './SupportTickets'
import InventoryManager from './InventoryManager'
import BannerCarousel from './BannerCarousel'

import { DealerProfile as DealerProfileType } from '../../types'

type View =
  | 'home'
  | 'products'
  | 'cart'
  | 'orders'
  | 'profile'
  | 'support'
  | 'inventory'

/* ================= MOCK DEALER ================= */

const dealerProfile: DealerProfileType = {
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

/* ================= DASHBOARD ================= */

export function DealerDashboard() {
  const [currentView, setCurrentView] = useState<View>('home')
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const navigateTo = (view: View) => {
    setCurrentView(view)
    setMenuOpen(false)
  }

  const getPageTitle = () => {
    switch (currentView) {
      case 'home':
        return 'SP Chains'
      case 'products':
        return 'Products'
      case 'cart':
        return 'Cart'
      case 'orders':
        return 'Orders'
      case 'profile':
        return 'Profile'
      case 'support':
        return 'Support'
      case 'inventory':
        return 'My Inventory'
      default:
        return 'SP Chains'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* ================= HEADER ================= */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {currentView !== 'home' && (
              <button onClick={() => navigateTo('home')}>
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold">{getPageTitle()}</h1>
              {currentView === 'home' && (
                <p className="text-xs text-slate-500">
                  Credit:{' '}
                  ₹
                  {(
                    dealerProfile.credit_limit -
                    dealerProfile.credit_used
                  ).toLocaleString('en-IN')}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('cart')}
              className="relative p-2 bg-amber-50 rounded-full"
            >
              <ShoppingCart className="w-5 h-5 text-amber-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* ================= DROPDOWN MENU ================= */}
        {menuOpen && (
          <div className="border-t bg-white px-4 py-2 space-y-1">
            <MenuButton icon={Home} label="Home" onClick={() => navigateTo('home')} />
            <MenuButton icon={Package} label="Products" onClick={() => navigateTo('products')} />
            <MenuButton icon={Package} label="Orders" onClick={() => navigateTo('orders')} />
            <MenuButton icon={User} label="Profile" onClick={() => navigateTo('profile')} />
            <MenuButton icon={Warehouse} label="Inventory" onClick={() => navigateTo('inventory')} />
            <MenuButton icon={MessageSquare} label="Support" onClick={() => navigateTo('support')} />

            {/* ✅ DEMO LOGOUT */}
            <button
              onClick={() => {
                localStorage.removeItem('demo_role')
                window.location.reload()
              }}
              className="w-full flex gap-3 items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-4 py-4">
        {currentView === 'home' && (
          <DealerHome onNavigate={navigateTo} profile={dealerProfile} />
        )}
        {currentView === 'products' && (
          <ProductCatalogue onCartUpdate={setCartCount} />
        )}
        {currentView === 'cart' && <Cart onCartUpdate={setCartCount} />}
        {currentView === 'orders' && <OrderHistory />}
        {currentView === 'profile' && <DealerProfile profile={dealerProfile} />}
        {currentView === 'support' && <SupportTickets />}
        {currentView === 'inventory' && <InventoryManager />}
      </main>
    </div>
  )
}

/* ================= SMALL COMPONENTS ================= */

function MenuButton({
  icon: Icon,
  label,
  onClick
}: {
  icon: any
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50"
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  )
}

/* ================= HOME ================= */

function DealerHome({
  onNavigate,
  profile
}: {
  onNavigate: (view: View) => void
  profile: DealerProfileType
}) {
  return (
    <div className="space-y-4">
      <BannerCarousel />

      <div className="bg-amber-600 text-white rounded-2xl p-6">
        <h2 className="text-2xl font-bold">Welcome back!</h2>
        <p>{profile.business_name}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('products')}
          className="p-6 bg-blue-100 rounded-xl"
        >
          Browse Products
        </button>
        <button
          onClick={() => onNavigate('orders')}
          className="p-6 bg-green-100 rounded-xl"
        >
          My Orders
        </button>
      </div>
    </div>
  )
}
