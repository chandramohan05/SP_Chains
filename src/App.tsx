import { Login } from './components/auth/Login'
import { DealerDashboard } from './components/dealer/DealerDashboard'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { useAuth } from './context/AuthContext'

function AppContent() {
  const { user, loading, signOut } = useAuth()

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-slate-800 rounded-full" />
      </div>
    )
  }

  /* ---------------- NOT LOGGED IN ---------------- */
  if (!user) {
    return <Login onLoginSuccess={() => {}} onSwitchToRegister={() => {}} />
  }

  /* ---------------- DASHBOARDS ---------------- */
  return (
    <div className="min-h-screen bg-slate-50">
      {user.role === 'admin' ? (
        <AdminDashboard onLogout={signOut} />
      ) : (
        <DealerDashboard onLogout={signOut} />
      )}
    </div>
  )
}

export default function App() {
  return <AppContent />
}
