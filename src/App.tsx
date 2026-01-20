import { useState } from 'react';
import { DemoLogin } from './components/auth/DemoLogin';
import { DealerDashboard } from './components/dealer/DealerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useAuth } from './context/AuthContext';

type Role = 'admin' | 'dealer';

function AppContent() {
  const { user, loading } = useAuth();

  const [demoRole, setDemoRole] = useState<Role | null>(null);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-slate-800 rounded-full" />
      </div>
    );
  }

  /* ---------------- ROLE RESOLUTION ---------------- */
  const role: Role | null = user?.role ?? demoRole;

  /* ---------------- LOGIN ---------------- */
  if (!role) {
    return <DemoLogin onLogin={(r) => setDemoRole(r)} />;
  }

  /* ---------------- DASHBOARDS ---------------- */
  return (
    <div className="min-h-screen bg-slate-50">
      {role === 'admin' ? <AdminDashboard onLogout={function (): void {
        throw new Error('Function not implemented.');
      } } /> : <DealerDashboard />}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
