import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const roleNavConfig = {
  admin: {
    title: 'ADMIN PANEL',
    sections: [
      {
        title: 'OVERVIEW',
        items: [
          { path: '', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
        ],
      },
      {
        title: 'OPERATIONS',
        items: [
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
    ],
  },
  dispatcher: {
    title: 'DISPATCHER PANEL',
    sections: [
      {
        title: 'DISPATCH',
        items: [
          { path: '', label: 'Dispatch Hub', icon: 'fas fa-broadcast-tower' },
          { path: 'dispatch', label: 'Active Dispatches', icon: 'fas fa-truck-loading' },
          { path: 'bookings', label: 'Pending Bookings', icon: 'fas fa-clipboard-list' },
        ],
      },
      {
        title: 'FLEET',
        items: [
          { path: 'drivers', label: 'Drivers', icon: 'fas fa-id-card' },
          { path: 'resource-assignment', label: 'Tanker Status', icon: 'fas fa-water' },
        ],
      },
      {
        title: 'TOOLS',
        items: [
          { path: 'route-optimizer', label: 'Route Optimizer', icon: 'fas fa-route' },
          { path: 'quality', label: 'Quality Checks', icon: 'fas fa-flask' },
        ],
      },
    ],
  },
  driver: {
    title: 'DRIVER PANEL',
    sections: [
      {
        title: 'MY WORK',
        items: [
          { path: '', label: 'My Dashboard', icon: 'fas fa-home' },
          { path: 'bookings', label: 'My Deliveries', icon: 'fas fa-truck' },
          { path: 'route-optimizer', label: 'My Route', icon: 'fas fa-route' },
        ],
      },
      {
        title: 'PROFILE',
        items: [
          { path: 'drivers', label: 'My Profile', icon: 'fas fa-user-circle' },
          { path: 'quality', label: 'Quality Log', icon: 'fas fa-flask' },
        ],
      },
    ],
  },
  customer: {
    title: 'MY ACCOUNT',
    sections: [
      {
        title: 'WATER SERVICES',
        items: [
          { path: '', label: 'My Dashboard', icon: 'fas fa-home' },
          { path: 'book', label: 'Book Water', icon: 'fas fa-plus-circle' },
          { path: 'bookings', label: 'My Bookings', icon: 'fas fa-clipboard-list' },
        ],
      },
      {
        title: 'TRACKING',
        items: [
          { path: 'dispatch', label: 'Track Delivery', icon: 'fas fa-map-marker-alt' },
          { path: 'payments', label: 'My Payments', icon: 'fas fa-credit-card' },
        ],
      },
      {
        title: 'INFO',
        items: [
          { path: 'quality', label: 'Water Quality', icon: 'fas fa-flask' },
        ],
      },
    ],
  },
};

const RoleSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { colors, themeName, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const t = colors;

  const roleConfig = roleNavConfig[user?.role] || roleNavConfig.admin;
  const sidebarWidth = collapsed ? 72 : 260;

  const roleColors = {
    admin: '#06b6d4',
    dispatcher: '#a855f7',
    driver: '#22c55e',
    customer: '#f59e0b',
  };
  const accent = roleColors[user?.role] || '#06b6d4';

  return (
    <aside style={{
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
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '16px 0' : '16px',
        borderBottom: `1px solid ${t.border}`,
        minHeight: 70,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
            display: 'grid', placeItems: 'center',
            color: '#fff', fontWeight: 700, fontSize: '0.75rem',
            flexShrink: 0,
          }}>
            {user?.avatar || 'U'}
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{user?.name}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: accent, textTransform: 'uppercase', letterSpacing: 1 }}>
                {user?.role}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'none', border: 'none', color: t.textSecondary,
            cursor: 'pointer', fontSize: 14, padding: 6, borderRadius: 6,
            display: collapsed ? 'none' : 'block',
          }}
        >
          <i className="fas fa-chevron-left" />
        </button>
      </div>

      {!collapsed && (
        <div style={{
          margin: '10px 12px 0',
          padding: '8px 12px',
          borderRadius: 8,
          background: `${accent}12`,
          border: `1px solid ${accent}25`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: accent, letterSpacing: 0.5 }}>
            {roleConfig.title}
          </span>
        </div>
      )}

      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
        {roleConfig.sections.map((section, sIdx) => (
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
                    color: isActive ? accent : t.text,
                    background: isActive ? `${accent}15` : 'transparent',
                    borderLeft: isActive ? `3px solid ${accent}` : '3px solid transparent',
                    transition: 'all 0.2s ease',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    borderRadius: '0 6px 6px 0',
                    margin: '1px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = `${accent}08`; }}
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

      <div style={{ borderTop: `1px solid ${t.border}`, padding: collapsed ? '10px 0' : '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 10, padding: collapsed ? '10px 0' : '10px 12px', background: 'none',
            border: 'none', color: t.text, cursor: 'pointer', borderRadius: 6,
            fontSize: 13, width: '100%',
          }}
        >
          <i className={themeName === 'dark' ? 'fas fa-sun' : 'fas fa-moon'} style={{ width: 20, textAlign: 'center', fontSize: 15 }} />
          {!collapsed && <span>{themeName === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 10, padding: collapsed ? '10px 0' : '10px 12px', background: 'none',
            border: 'none', color: '#e74c3c', cursor: 'pointer', borderRadius: 6,
            fontSize: 13, width: '100%',
          }}
        >
          <i className="fas fa-sign-out-alt" style={{ width: 20, textAlign: 'center', fontSize: 15 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default RoleSidebar;
