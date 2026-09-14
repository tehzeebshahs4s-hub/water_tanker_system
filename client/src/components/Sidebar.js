import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const navSections = [
  {
    title: 'OPERATIONS',
    items: [
      { path: '', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
      { path: 'book', label: 'New Booking', icon: 'fas fa-plus-circle' },
      { path: 'bookings', label: 'All Bookings', icon: 'fas fa-list-alt' },
      { path: 'dispatch', label: 'Dispatch', icon: 'fas fa-truck-loading' },
    ],
  },
  {
    title: 'FLEET',
    items: [
      { path: 'resource-assignment', label: 'Tanker Assignment', icon: 'fas fa-water' },
      { path: 'drivers', label: 'Driver Management', icon: 'fas fa-id-card' },
      { path: 'maintenance', label: 'Maintenance', icon: 'fas fa-wrench' },
    ],
  },
  {
    title: 'ALGORITHMS (DAA)',
    items: [
      { path: 'route-optimizer', label: 'Route Optimizer', icon: 'fas fa-route' },
      { path: 'scheduler', label: 'DP Scheduler', icon: 'fas fa-calendar-check' },
      { path: 'slot-allocator', label: 'Slot Allocator', icon: 'fas fa-th-large' },
      { path: 'flow-optimizer', label: 'Flow Optimizer', icon: 'fas fa-arrows-alt-h' },
      { path: 'transfer-optimizer', label: 'Transfer Optimizer', icon: 'fas fa-exchange-alt' },
      { path: 'benchmarking', label: 'Benchmarking', icon: 'fas fa-tachometer-alt' },
    ],
  },
  {
    title: 'QUALITY & FINANCE',
    items: [
      { path: 'quality', label: 'Water Quality', icon: 'fas fa-flask' },
      { path: 'payments', label: 'Payments', icon: 'fas fa-credit-card' },
      { path: 'analytics', label: 'Analytics', icon: 'fas fa-chart-bar' },
    ],
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { colors, themeName, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const t = colors;

  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <aside
      className="sidebar"
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        background: `linear-gradient(180deg, ${t.bg} 0%, ${t.bg2} 100%)`,
        transition: 'width 0.3s ease, min-width 0.3s ease',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${t.border}`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '20px 0' : '20px 16px',
          borderBottom: `1px solid ${t.border}`,
          minHeight: 70,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: 28 }}>💧</span>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 18, fontWeight: 700, background: 'linear-gradient(135deg, #00b4d8, #0077b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AquaManager
              </span>
              <span style={{ fontSize: 9, fontWeight: 700, background: 'linear-gradient(135deg, #00b4d8, #0077b6)', color: '#fff', padding: '2px 6px', borderRadius: 4, letterSpacing: 1 }}>
                PRO
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ background: 'none', border: 'none', color: t.text, cursor: 'pointer', fontSize: 16, padding: 6, borderRadius: 6, transition: 'background 0.2s', display: collapsed ? 'none' : 'block' }}
        >
          <i className="fas fa-chevron-left" />
        </button>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
        {navSections.map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: 4 }}>
            {!collapsed && (
              <div style={{ padding: '14px 16px 6px', fontSize: 10, fontWeight: 700, color: t.dim, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                {section.title}
              </div>
            )}
            {collapsed && <div style={{ height: 12 }} />}
            {section.items.map((item) => {
              const fullPath = `/dashboard/${item.path}`;
              const isActive = location.pathname === fullPath || (item.path === '' && (location.pathname === '/dashboard' || location.pathname === '/dashboard/'));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: collapsed ? '10px 0' : '10px 16px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    textDecoration: 'none',
                    color: isActive ? '#00b4d8' : t.text,
                    background: isActive ? 'rgba(0, 180, 216, 0.1)' : 'transparent',
                    borderLeft: isActive ? '3px solid #00b4d8' : '3px solid transparent',
                    transition: 'all 0.2s ease',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    borderRadius: '0 6px 6px 0',
                    margin: '1px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <i className={item.icon} style={{ width: 20, textAlign: 'center', fontSize: 15, flexShrink: 0 }} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ borderTop: `1px solid ${t.border}`, padding: collapsed ? '10px 0' : '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button
          onClick={toggleTheme}
          style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10, padding: collapsed ? '10px 0' : '10px 12px', background: 'none', border: 'none', color: t.text, cursor: 'pointer', borderRadius: 6, fontSize: 13, width: '100%', transition: 'background 0.2s' }}
        >
          <i className={themeName === 'dark' ? 'fas fa-sun' : 'fas fa-moon'} style={{ width: 20, textAlign: 'center', fontSize: 15 }} />
          {!collapsed && <span>{themeName === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        <button
          onClick={logout}
          style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10, padding: collapsed ? '10px 0' : '10px 12px', background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', borderRadius: 6, fontSize: 13, width: '100%', transition: 'background 0.2s' }}
        >
          <i className="fas fa-sign-out-alt" style={{ width: 20, textAlign: 'center', fontSize: 15 }} />
          {!collapsed && <span>Logout</span>}
        </button>

        {!collapsed && (
          <div style={{ textAlign: 'center', fontSize: 9, color: t.dim, padding: '6px 0 2px', letterSpacing: 0.5 }}>
            DAA Semester Project
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
