import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const API = '/api';

export default function DriverDashboard() {
  const { colors: t } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dispatches, setDispatches] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [myProfile, setMyProfile] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [dRes, drRes] = await Promise.allSettled([
        fetch(`${API}/dispatches`).then(r => r.json()),
        fetch(`${API}/drivers`).then(r => r.json()),
      ]);
      const allDispatches = dRes.status === 'fulfilled' ? dRes.value : [];
      const allDrivers = drRes.status === 'fulfilled' ? drRes.value : [];

      const drv = allDrivers.find(d => d.name?.toLowerCase().includes('ahmed') || d.driverId === 'DRV-001');
      setMyProfile(drv || allDrivers[0] || null);

      const myDrvId = drv?.driverId || 'DRV-001';
      const mine = allDispatches.filter(d => d.driverId === myDrvId);
      setMyDeliveries(mine);
      setDispatches(allDispatches);
    } catch (e) {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const activeDeliveries = myDeliveries.filter(d => !['delivered', 'cancelled'].includes(d.status));
  const completedDeliveries = myDeliveries.filter(d => d.status === 'delivered');
  const todayDeliveries = myDeliveries.filter(d => {
    if (!d.createdAt) return false;
    return d.createdAt.startsWith(new Date().toISOString().split('T')[0]);
  });

  const Badge = ({ status }) => {
    const colors = { assigned: '#f59e0b', loading: '#3b82f6', 'en-route': '#f97316', delivered: '#22c55e', cancelled: '#ef4444' };
    const c = colors[status?.toLowerCase()] || '#64748b';
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: c, background: `${c}18`, textTransform: 'capitalize' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
        {status?.replace(/_/g, ' ')}
      </span>
    );
  };

  if (loading) return (
    <div style={{ display: 'grid', placeItems: 'center', height: '60vh', color: t.textSecondary }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${t.border}`, borderTopColor: '#22c55e', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 12 }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      Loading your dashboard...
    </div>
  );

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} } @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }`}</style>

      {/* Profile Header */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 72, height: 72, borderRadius: 16, background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 28, fontWeight: 700, flexShrink: 0 }}>
          {user?.avatar || 'D'}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: t.text, fontSize: 22, fontWeight: 700, margin: 0 }}>{user?.name || 'Driver'}</h1>
          <div style={{ display: 'flex', gap: 20, marginTop: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: t.textSecondary }}><i className="fas fa-id-badge" style={{ marginRight: 6 }} />{myProfile?.driverId || 'N/A'}</span>
            <span style={{ fontSize: 13, color: t.textSecondary }}><i className="fas fa-phone" style={{ marginRight: 6 }} />{myProfile?.phone || 'N/A'}</span>
            <span style={{ fontSize: 13, color: t.textSecondary }}><i className="fas fa-star" style={{ marginRight: 6, color: '#f59e0b' }} />{myProfile?.rating || '4.5'}</span>
            <span style={{ fontSize: 13, color: t.textSecondary }}><i className="fas fa-truck" style={{ marginRight: 6 }} />{myProfile?.totalDeliveries || 0} deliveries</span>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace" }}>{activeDeliveries.length}</div>
          <div style={{ fontSize: 12, color: t.textSecondary }}>Active Now</div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { icon: '🚚', label: 'Active Deliveries', value: activeDeliveries.length, color: '#f97316' },
          { icon: '✅', label: 'Completed Today', value: todayDeliveries.filter(d => d.status === 'delivered').length, color: '#22c55e' },
          { icon: '📊', label: 'Total Assigned', value: myDeliveries.length, color: '#3b82f6' },
          { icon: '⭐', label: 'Rating', value: myProfile?.rating || '4.5', color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: '18px 16px', textAlign: 'center', animation: `slideUp 0.3s ease ${i * 0.1}s both` }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Active Deliveries */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <h3 style={{ color: t.text, fontSize: 16, fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#f97316' }}>🔥</span> Active Deliveries
          {activeDeliveries.length > 0 && <span style={{ fontSize: 11, background: '#f9731620', color: '#f97316', padding: '2px 8px', borderRadius: 10 }}>{activeDeliveries.length}</span>}
        </h3>
        {activeDeliveries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: t.textSecondary }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <p style={{ fontSize: 14 }}>No active deliveries. You're all caught up!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {activeDeliveries.map((d, i) => {
              const statusIdx = ['assigned', 'loading', 'en-route', 'delivered'].indexOf(d.status);
              const progress = statusIdx >= 0 ? ((statusIdx + 1) / 4) * 100 : 25;
              return (
                <div key={i} style={{ padding: '16px', borderRadius: 10, background: `${t.text}04`, border: `1px solid ${t.border}`, animation: `slideUp 0.3s ease ${i * 0.1}s both` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>{d.dispatchId}</span>
                      <span style={{ fontSize: 12, color: t.textSecondary, marginLeft: 10 }}>&rarr; {d.bookingId}</span>
                    </div>
                    <Badge status={d.status} />
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: `${t.text}10`, overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #f97316, #22c55e)', transition: 'width 0.8s' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: t.textSecondary }}>Started: {d.timeline?.[0]?.time?.split('T')[1]?.slice(0, 5) || 'N/A'}</span>
                    <span style={{ fontSize: 11, color: t.textSecondary }}>{Math.round(progress)}% complete</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* My Delivery History */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: t.text, fontSize: 16, fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#3b82f6' }}>📜</span> Delivery History
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Dispatch ID', 'Booking', 'Status', 'Date', 'Timeline Steps'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: t.textSecondary, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${t.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myDeliveries.slice(0, 10).map((d, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${t.border}` }}>
                <td style={{ padding: '10px 12px', fontFamily: "'JetBrains Mono', monospace", color: t.text, fontSize: 12 }}>{d.dispatchId}</td>
                <td style={{ padding: '10px 12px', color: t.text }}>{d.bookingId}</td>
                <td style={{ padding: '10px 12px' }}><Badge status={d.status} /></td>
                <td style={{ padding: '10px 12px', color: t.textSecondary, fontSize: 12 }}>{d.createdAt?.split('T')[0] || '-'}</td>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {(d.timeline || []).map((step, si) => (
                      <span key={si} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#22c55e18', color: '#22c55e', fontWeight: 500 }}>
                        {step.status}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
