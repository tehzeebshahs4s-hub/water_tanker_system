import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const API = '/api';

export default function CustomerDashboard() {
  const { colors: t } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [quality, setQuality] = useState([]);
  const [dispatches, setDispatches] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [bRes, pRes, qRes, dRes] = await Promise.allSettled([
        fetch(`${API}/bookings`).then(r => r.json()),
        fetch(`${API}/payments`).then(r => r.json()),
        fetch(`${API}/quality`).then(r => r.json()),
        fetch(`${API}/dispatches`).then(r => r.json()),
      ]);
      if (bRes.status === 'fulfilled') setBookings(bRes.value);
      if (pRes.status === 'fulfilled') setPayments(pRes.value);
      if (qRes.status === 'fulfilled') setQuality(qRes.value);
      if (dRes.status === 'fulfilled') setDispatches(dRes.value);
    } catch (e) {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const myBookings = bookings.slice(0, 5);
  const recentPayments = payments.slice(0, 5);
  const latestQuality = quality[0];
  const activeDispatch = dispatches.find(d => ['en-route', 'loading', 'assigned'].includes(d.status));
  const totalSpent = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const completedBookings = bookings.filter(b => ['completed', 'delivered'].includes(b.status)).length;

  const Badge = ({ status }) => {
    const colors = { pending: '#f59e0b', scheduled: '#3b82f6', dispatched: '#8b5cf6', 'en-route': '#f97316', delivered: '#22c55e', completed: '#22c55e', cancelled: '#ef4444' };
    const c = colors[status?.toLowerCase()] || '#64748b';
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: c, background: `${c}18`, textTransform: 'capitalize' }}>
        {status?.replace(/_/g, ' ')}
      </span>
    );
  };

  if (loading) return (
    <div style={{ display: 'grid', placeItems: 'center', height: '60vh', color: t.textSecondary }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${t.border}`, borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 12 }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      Loading your account...
    </div>
  );

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>
      <style>{`@keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }`}</style>

      {/* Welcome Header */}
      <div style={{ background: `linear-gradient(135deg, #f59e0b20, #f9731620)`, border: `1px solid #f59e0b30`, borderRadius: 16, padding: 28, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: t.text, fontSize: 24, fontWeight: 700, margin: 0 }}>Welcome, {user?.name || 'Customer'} 💧</h1>
          <p style={{ color: t.textSecondary, fontSize: 14, margin: '6px 0 0' }}>Manage your water deliveries and track orders</p>
        </div>
        <button onClick={() => navigate('/dashboard/book')} style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}>
          <span style={{ fontSize: 20 }}>+</span> Book Water Now
        </button>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { icon: '📦', label: 'Total Bookings', value: bookings.length, color: '#3b82f6' },
          { icon: '✅', label: 'Completed', value: completedBookings, color: '#22c55e' },
          { icon: '💰', label: 'Total Spent', value: `PKR ${totalSpent.toLocaleString()}`, color: '#f59e0b' },
          { icon: '🚚', label: 'In Transit', value: activeDispatch ? 1 : 0, color: '#f97316' },
        ].map((s, i) => (
          <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: '18px 16px', textAlign: 'center', animation: `slideUp 0.3s ease ${i * 0.1}s both` }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Live Tracking + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Live Delivery Tracking */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ color: t.text, fontSize: 16, fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#f97316' }}>📍</span> Live Delivery Tracking
          </h3>
          {activeDispatch ? (
            <div style={{ padding: 16, borderRadius: 10, background: '#f9731610', border: '1px solid #f9731630' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{activeDispatch.dispatchId}</div>
                  <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 2 }}>Booking: {activeDispatch.bookingId}</div>
                </div>
                <Badge status={activeDispatch.status} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                {['Assigned', 'Loading', 'En Route', 'Delivered'].map((step, i) => {
                  const stepKey = ['assigned', 'loading', 'en-route', 'delivered'][i];
                  const isActive = activeDispatch.status === stepKey;
                  const isDone = ['delivered', 'en-route', 'loading', 'assigned'].indexOf(activeDispatch.status) > i;
                  return (
                    <React.Fragment key={step}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: isDone || isActive ? '#f97316' : `${t.text}15`, color: isDone || isActive ? '#fff' : t.textSecondary, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>{i + 1}</div>
                        <div style={{ fontSize: 9, color: t.textSecondary, marginTop: 4 }}>{step}</div>
                      </div>
                      {i < 3 && <div style={{ flex: 1, height: 2, background: isDone ? '#f97316' : `${t.text}15`, borderRadius: 1 }} />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: t.textSecondary }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📦</div>
              <p style={{ fontSize: 13 }}>No active deliveries right now</p>
              <button onClick={() => navigate('/dashboard/book')} style={{ marginTop: 12, background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Book Your Next Delivery
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: t.text, fontSize: 16, fontWeight: 700, margin: '0 0 14px' }}>
              <span style={{ color: '#f59e0b' }}>⚡</span> Quick Actions
            </h3>
            {[
              { icon: '💧', label: 'Book Water Tanker', desc: 'Schedule a new delivery', color: '#06b6d4', path: '/dashboard/book' },
              { icon: '📋', label: 'View All Bookings', desc: 'Check order history', color: '#3b82f6', path: '/dashboard/bookings' },
              { icon: '💳', label: 'Payment History', desc: 'View transactions', color: '#8b5cf6', path: '/dashboard/payments' },
              { icon: '🔬', label: 'Water Quality Report', desc: 'Latest test results', color: '#22c55e', path: '/dashboard/quality' },
            ].map((action, i) => (
              <div key={i} onClick={() => navigate(action.path)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 10, background: `${action.color}08`, border: `1px solid ${action.color}20`, cursor: 'pointer', marginBottom: 8, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = `${action.color}15`; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${action.color}08`; e.currentTarget.style.transform = 'translateX(0)'; }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${action.color}20`, display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0 }}>{action.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{action.label}</div>
                  <div style={{ fontSize: 11, color: t.textSecondary }}>{action.desc}</div>
                </div>
                <span style={{ color: t.textSecondary, fontSize: 14 }}>&rarr;</span>
              </div>
            ))}
          </div>

          {/* Water Quality Snapshot */}
          {latestQuality && (
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20 }}>
              <h3 style={{ color: t.text, fontSize: 14, fontWeight: 700, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#22c55e' }}>🔬</span> Latest Quality Test
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'pH', value: latestQuality.ph, unit: '' },
                  { label: 'TDS', value: latestQuality.tds, unit: 'ppm' },
                  { label: 'Score', value: latestQuality.score, unit: '' },
                  { label: 'Grade', value: latestQuality.grade, unit: '' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '8px 10px', borderRadius: 8, background: `${t.text}04`, textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}{item.unit}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>All tests passed</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: t.text, fontSize: 16, fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#3b82f6' }}>📋</span> My Recent Bookings
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Booking ID', 'Area', 'Tanker Size', 'Date', 'Time', 'Amount', 'Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: t.textSecondary, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${t.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myBookings.map((b, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${t.border}` }}>
                <td style={{ padding: '10px 12px', fontFamily: "'JetBrains Mono', monospace", color: '#f59e0b', fontSize: 12, fontWeight: 600 }}>{b.bookingId}</td>
                <td style={{ padding: '10px 12px', color: t.text }}>{b.areaId}</td>
                <td style={{ padding: '10px 12px', color: t.text, textTransform: 'capitalize' }}>{b.tankerSize}</td>
                <td style={{ padding: '10px 12px', color: t.textSecondary, fontSize: 12 }}>{b.date}</td>
                <td style={{ padding: '10px 12px', color: t.textSecondary, fontSize: 12 }}>{b.timeSlot}</td>
                <td style={{ padding: '10px 12px', fontFamily: "'JetBrains Mono', monospace", color: t.text, fontWeight: 600 }}>PKR {Number(b.price || 0).toLocaleString()}</td>
                <td style={{ padding: '10px 12px' }}><Badge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
