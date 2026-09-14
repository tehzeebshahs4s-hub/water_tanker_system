import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import RoleSidebar from './components/RoleSidebar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DispatcherDashboard from './pages/DispatcherDashboard';
import DriverDashboard from './pages/DriverDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import RouteOptimizer from './pages/RouteOptimizer';
import ResourceAssignment from './pages/ResourceAssignment';
import Scheduler from './pages/Scheduler';
import SlotAllocator from './pages/SlotAllocator';
import FlowOptimizer from './pages/FlowOptimizer';
import Analytics from './pages/Analytics';
import BookingPage from './pages/BookingPage';
import BookingsListPage from './pages/BookingsListPage';
import DriverManagementPage from './pages/DriverManagementPage';
import DispatchPage from './pages/DispatchPage';
import PaymentsPage from './pages/PaymentsPage';
import QualityPage from './pages/QualityPage';
import MaintenancePage from './pages/MaintenancePage';
import TransferOptimizer from './pages/TransferOptimizer';
import Benchmarking from './pages/Benchmarking';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: '#031220' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid rgba(34,211,238,0.2)', borderTopColor: '#22d3ee', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <div style={{ color: '#94a3b8' }}>Loading...</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function ThemeToggle() {
  const { themeName, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} title={themeName === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} style={{
      width: 38, height: 38, borderRadius: 10,
      border: `1px solid ${themeName === 'dark' ? 'rgba(34,211,238,0.2)' : 'rgba(15,23,41,0.12)'}`,
      background: themeName === 'dark' ? 'rgba(34,211,238,0.06)' : 'rgba(8,145,178,0.06)',
      color: themeName === 'dark' ? '#94a3b8' : '#475569',
      cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: '1rem', transition: 'all 0.2s', flexShrink: 0
    }}>
      {themeName === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

function DashboardLayout() {
  const { user, logout } = useAuth();
  const { colors: t, themeName } = useTheme();

  const roleHome = {
    admin: <Dashboard />,
    dispatcher: <DispatcherDashboard />,
    driver: <DriverDashboard />,
    customer: <CustomerDashboard />,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: t.bg }}>
      <RoleSidebar />
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', marginLeft: 260 }}>
        <div style={{ padding: '12px 24px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: themeName === 'dark' ? 'rgba(3,18,32,0.8)' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #a78bfa)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>
              {user?.avatar || 'U'}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: t.text }}>{user?.name}</div>
              <div style={{ fontSize: '0.7rem', color: t.muted, textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ThemeToggle />
            <div style={{ width: 1, height: 24, background: t.border, margin: '0 4px' }} />
            <button onClick={logout} style={{
              padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 700, fontSize: '0.82rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', fontFamily: 'inherit'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}>
              <i className="fas fa-sign-out-alt" /> Logout
            </button>
          </div>
        </div>
        <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={roleHome[user?.role] || <Dashboard />} />
            <Route path="/route-optimizer" element={<RouteOptimizer />} />
            <Route path="/resource-assignment" element={<ResourceAssignment />} />
            <Route path="/scheduler" element={<Scheduler />} />
            <Route path="/slot-allocator" element={<SlotAllocator />} />
            <Route path="/flow-optimizer" element={<FlowOptimizer />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/bookings" element={<BookingsListPage />} />
            <Route path="/drivers" element={<DriverManagementPage />} />
            <Route path="/dispatch" element={<DispatchPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/quality" element={<QualityPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/transfer-optimizer" element={<TransferOptimizer />} />
            <Route path="/benchmarking" element={<Benchmarking />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
