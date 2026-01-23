import { LogIn, User, Shield } from 'lucide-react'

interface DemoLoginProps {
  onSelectRole: (role: 'admin' | 'dealer') => void
}

export function DemoLogin({ onSelectRole }: DemoLoginProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6">

        {/* ADMIN */}
        <div className="bg-white/10 rounded-xl p-8 text-center">
          <Shield className="w-12 h-12 mx-auto text-amber-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Admin Panel</h2>
          <p className="text-slate-300 mb-6">System control & pricing</p>

          <button
            onClick={() => onSelectRole('admin')}
            className="w-full bg-amber-600 text-white py-3 rounded-lg"
          >
            Login as Admin
          </button>
        </div>

        {/* DEALER */}
        <div className="bg-white/10 rounded-xl p-8 text-center">
          <User className="w-12 h-12 mx-auto text-blue-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Dealer Portal</h2>
          <p className="text-slate-300 mb-6">Order & tracking</p>

          <button
            onClick={() => onSelectRole('dealer')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Login as Dealer
          </button>
        </div>

      </div>
    </div>
  )
}
