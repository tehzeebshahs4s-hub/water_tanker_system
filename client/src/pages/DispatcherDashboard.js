import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const API = '/api';

export default function DispatcherDashboard() {
  const { colors: t } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [bRes, dRes, fRes, drRes, aRes] = await Promise.allSettled([
        fetch(`${API}/bookings`).then(r => r.json()),
        fetch(`${API}/dispatches`).then(r => r.json()),
        fetch(`${API}/fleet`).then(r => r.json()),
        fetch(`${API}/drivers`).then(r => r.json()),
        fetch(`${API}/alerts`).then(r => r.json()),
      ]);
      if (bRes.status === 'fulfilled') setBookings(bRes.value);
      if (dRes.status === 'fulfilled') setDispatches(dRes.value);
      if (fRes.status === 'fulfilled') setFleet(fRes.value);
      if (drRes.status === 'fulfilled') setDrivers(drRes.value);
      if (aRes.status === 'fulfilled') setAlerts(aRes.value);
    } catch (e) {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 30000); return () => clearInterval(i); }, [fetchData]);

  const pendingBookings = bookings.filter(b => ['pending', 'scheduled'].includes(b.status));
  const activeDispatches = dispatches.filter(d => !['delivered', 'cancelled'].includes(d.status));
  const availableTankers = fleet.filter(t => t.status === 'available');
  const availableDrivers = drivers.filter(d => d.status === 'active' || d.status === 'available');
  const urgentAlerts = alerts.filter(a => a.priority === 'high' || a.urgency === 'high');

  const Badge = ({ status, pulse }) => {
    const colors = {
      pending: '#f59e0b', scheduled: '#3b82f6', dispatched: '#8b5cf6', 'en-route': '#f97316',
      delivered: '#22c55e', cancelled: '#ef4444', assigned: '#a855f7', loading: '#3b82f6',
      available: '#22c55e', active: '#22c55e', maintenance: '#f97316',
    };
    const c = colors[status?.toLowerCase()] || '#64748b';
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: c, background: `${c}18`, textTransform: 'capitalize' }}>
        {pulse && <span style={{ width: 6, height: 6, borderRadius: '50%', background: c, animation: 'pulse 1.5s ease-in-out infinite' }} />}
        {status?.replace(/_/g, ' ')}
      </span>
    );
  };

  const Card = ({ children, style: s = {} }) => (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20, ...s }}>{children}</div>
  );

  const StatBox = ({ icon, label, value, color }) => (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: '18px 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: color || t.text, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
      <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 4 }}>{label}</div>
    </div>
  );

  if (loading) return (
    <div style={{ display: 'grid', placeItems: 'center', height: '60vh', color: t.textSecondary }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${t.border}`, borderTopColor: '#a855f7', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 12 }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      Loading dispatch center...
    </div>
  );

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} } @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ padding: '0 0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ color: t.text, fontSize: 22, fontWeight: 700, margin: 0 }}>
              <span style={{ color: '#a855f7' }}>Dispatch</span> Control Center
            </h1>
            <p style={{ color: t.textSecondary, fontSize: 13, margin: '4px 0 0' }}>Real-time dispatch operations &mdash; {user?.name}</p>
          </div>
          <button onClick={() => navigate('/dashboard/dispatch')} style={{ background: '#a855f7', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fas fa-truck-loading" /> Open Dispatch Board
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 20 }}>
          <StatBox icon="📋" label="Pending Orders" value={pendingBookings.length} color="#f59e0b" />
          <StatBox icon="🚚" label="Active Dispatches" value={activeDispatches.length} color="#a855f7" />
          <StatBox icon="✅" label="Available Tankers" value={availableTankers.length} color="#22c55e" />
          <StatBox icon="👨‍✈️" label="Available Drivers" value={availableDrivers.length} color="#3b82f6" />
          <StatBox icon="⚠️" label="Urgent Alerts" value={urgentAlerts.length} color={urgentAlerts.length > 0 ? '#ef4444' : '#22c55e'} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 20 }}>
          <Card>
            <h3 style={{ color: t.text, fontSize: 15, fontWeight: 700, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#f59e0b' }}>⏳</span> Pending Bookings
              <span style={{ fontSize: 11, background: '#f59e0b20', color: '#f59e0b', padding: '2px 8px', borderRadius: 10 }}>{pendingBookings.length}</span>
            </h3>
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {pendingBookings.length === 0 ? (
                <p style={{ color: t.textSecondary, textAlign: 'center', padding: 30 }}>No pending bookings</p>
              ) : pendingBookings.map((b, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${t.border}`, animation: `slideUp 0.3s ease ${i * 0.05}s both` }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{b.customerName}</div>
                    <div style={{ fontSize: 11, color: t.textSecondary, marginTop: 2 }}>
                      {b.areaId} &bull; {b.tankerSize} &bull; {b.timeSlot}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>PKR {Number(b.price || 0).toLocaleString()}</div>
                    <Badge status={b.status} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 style={{ color: t.text, fontSize: 15, fontWeight: 700, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#a855f7' }}>🚛</span> Active Dispatches
              <span style={{ fontSize: 11, background: '#a855f720', color: '#a855f7', padding: '2px 8px', borderRadius: 10 }}>{activeDispatches.length}</span>
            </h3>
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {activeDispatches.length === 0 ? (
                <p style={{ color: t.textSecondary, textAlign: 'center', padding: 30 }}>No active dispatches</p>
              ) : activeDispatches.map((d, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${t.border}`, animation: `slideUp 0.3s ease ${i * 0.05}s both` }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>{d.dispatchId}</div>
                    <div style={{ fontSize: 11, color: t.textSecondary, marginTop: 2 }}>
                      {d.bookingId} &rarr; Driver: {d.driverId}
                    </div>
                  </div>
                  <Badge status={d.status} pulse />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Card>
            <h3 style={{ color: t.text, fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>
              <span style={{ color: '#22c55e' }}>⛽</span> Tanker Availability
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['available', 'en-route', 'loading', 'maintenance'].map(s => {
                const count = fleet.filter(f => f.status === s).length;
                const pct = fleet.length > 0 ? (count / fleet.length * 100) : 0;
                const c = { available: '#22c55e', 'en-route': '#f97316', loading: '#3b82f6', maintenance: '#ef4444' }[s] || '#64748b';
                return (
                  <div key={s}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: t.text, textTransform: 'capitalize' }}>{s.replace('-', ' ')}</span>
                      <span style={{ fontSize: 12, color: t.textSecondary, fontFamily: "'JetBrains Mono', monospace" }}>{count}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: `${t.text}10`, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: c, transition: 'width 0.6s' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <h3 style={{ color: t.text, fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>
              <span style={{ color: '#3b82f6' }}>👨‍✈️</span> Driver Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {drivers.slice(0, 6).map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${t.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${d.status === 'active' ? '#22c55e' : '#ef4444'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: d.status === 'active' ? '#22c55e' : '#ef4444' }}>
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{d.name}</div>
                      <div style={{ fontSize: 10, color: t.textSecondary }}>{d.driverId}</div>
                    </div>
                  </div>
                  <Badge status={d.status} pulse={d.status === 'active'} />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 style={{ color: t.text, fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>
              <span style={{ color: '#ef4444' }}>⚠️</span> Alerts & Notifications
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {alerts.length === 0 ? (
                <p style={{ color: t.textSecondary, textAlign: 'center', padding: 20, fontSize: 12 }}>No alerts</p>
              ) : alerts.map((a, i) => (
                <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: a.priority === 'high' ? 'rgba(239,68,68,0.08)' : `${t.textSecondary}08`, border: `1px solid ${a.priority === 'high' ? 'rgba(239,68,68,0.2)' : t.border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: t.text, marginBottom: 2 }}>{a.message || a.title || 'Alert'}</div>
                  <div style={{ fontSize: 11, color: t.textSecondary }}>{a.description || a.details || ''}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
