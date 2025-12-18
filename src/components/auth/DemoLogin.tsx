import { useState } from 'react';
import { LogIn, User, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DemoLoginProps {
  onLogin: (role: 'admin' | 'dealer') => void;
}

export function DemoLogin({ onLogin }: DemoLoginProps) {
  const [loading, setLoading] = useState(false);

  const loginAs = async (role: 'admin' | 'dealer') => {
    setLoading(true);
    try {
      const email = role === 'dealer' ? '8888888888@spchains.internal' : '9999999999@spchains.internal';
      const password = 'demo123456';

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Demo login error:', error);
        alert('Demo login failed. Please try again.');
      } else {
        onLogin(role);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

      <div className="relative w-full max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mb-6 shadow-2xl">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">SP Chains</h1>
          <p className="text-xl text-slate-300">B2B Silver Trading Platform</p>
          <div className="mt-4 inline-block px-4 py-2 bg-amber-600/20 border border-amber-500/30 rounded-lg">
            <p className="text-amber-400 text-sm font-medium">Demo Mode - No OTP Required</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform transition-all hover:scale-105 hover:shadow-amber-500/20">
            <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 p-8 border-b border-white/10">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-amber-500/20 rounded-xl">
                  <Shield className="w-12 h-12 text-amber-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">Admin Panel</h2>
              <p className="text-slate-300 text-center text-sm">Full system control & management</p>
            </div>

            <div className="p-8 space-y-4">
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2"></div>
                  <span>Dealer approval & management</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2"></div>
                  <span>Order processing & approval</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2"></div>
                  <span>Live MCX pricing configuration</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2"></div>
                  <span>Coupon & notification management</span>
                </div>
              </div>

              <button
                onClick={() => loginAs('admin')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center">
                  <Shield className="w-5 h-5 mr-2" />
                  {loading ? 'Signing in...' : 'Login as Admin'}
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform transition-all hover:scale-105 hover:shadow-blue-500/20">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-8 border-b border-white/10">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-blue-500/20 rounded-xl">
                  <User className="w-12 h-12 text-blue-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">Dealer Portal</h2>
              <p className="text-slate-300 text-center text-sm">Browse, order & track purchases</p>
            </div>

            <div className="p-8 space-y-4">
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></div>
                  <span>Product catalogue with live pricing</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></div>
                  <span>Shopping cart & weight calculator</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></div>
                  <span>Apply coupons & dealer credit</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></div>
                  <span>Order history & tracking</span>
                </div>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-blue-300 mb-1 font-medium">Demo Account</p>
                <p className="text-sm text-white font-semibold">Silver Star Jewellers</p>
                <p className="text-xs text-slate-300 mt-1">Credit: ₹85,000 available</p>
              </div>

              <button
                onClick={() => loginAs('dealer')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center">
                  <User className="w-5 h-5 mr-2" />
                  {loading ? 'Signing in...' : 'Login as Dealer'}
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Click any button above to instantly access the demo
          </p>
        </div>
      </div>
    </div>
  );
}
