import { useState } from 'react';
import { DemoLogin } from './components/auth/DemoLogin';
import { DealerDashboard } from './components/dealer/DealerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

function App() {
  const [userRole, setUserRole] = useState<'admin' | 'dealer' | null>(null);

  if (!userRole) {
    return <DemoLogin onLogin={setUserRole} />;
  }

  if (userRole === 'admin') {
    return <AdminDashboard />;
  }

  return <DealerDashboard />;
}

export default App;
