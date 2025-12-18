import { useState } from 'react';
import { DemoLogin } from './components/auth/DemoLogin';
import { DealerDashboard } from './components/dealer/DealerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const [userRole, setUserRole] = useState<'admin' | 'dealer' | null>(null);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (!user && !userRole) {
    return <DemoLogin onLogin={setUserRole} />;
  }

  if (user?.role === 'admin' || userRole === 'admin') {
    return <AdminDashboard />;
  }

  if (user?.role === 'dealer' || userRole === 'dealer') {
    return <DealerDashboard />;
  }

  return <DemoLogin onLogin={setUserRole} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
