import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const API_BASE = '/api';

const STATUS_FLOW = ['Assigned', 'Loading', 'En Route', 'Delivered'];
const STATUS_COLORS = {
  assigned: { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8' },
  loading: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
  'en-route': { bg: 'rgba(249,115,22,0.15)', text: '#f97316' },
  delivered: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
  dispatched: { bg: 'rgba(249,115,22,0.15)', text: '#f97316' }
};

function DispatchPage() {
  const navigate = useNavigate();
  const { colors, themeName } = useTheme();
  const t = colors;
  const th = themeName === 'dark'
    ? { bg: '#031220', card: '#0d2536', border: 'rgba(34,211,238,0.12)', text: '#e6f2f8', muted: '#94a3b8', dim: '#64748b', cyan: '#22d3ee', teal: '#06b6d4', green: '#10b981', red: '#ef4444', amber: '#f59e0b', purple: '#a78bfa', inputBg: '#031220' }
    : { bg: '#f0f4f8', card: '#ffffff', border: 'rgba(15,23,41,0.08)', text: '#0f1729', muted: '#64748b', dim: '#94a3b8', cyan: '#0891b2', teal: '#0e7490', green: '#059669', red: '#dc2626', amber: '#d97706', purple: '#7c3aed', inputBg: '#ffffff' };

  const styles = {
    page: { minHeight: '100vh', backgroundColor: th.bg, color: th.text, padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' },
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '1.5rem' },
    title: { fontSize: '1.75rem', fontWeight: 700, color: th.cyan, marginBottom: '0.25rem' },
    subtitle: { color: th.muted, fontSize: '0.875rem' },
    card: { backgroundColor: th.card, border: `1px solid ${th.border}`, borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' },
    cardTitle: { fontSize: '1rem', fontWeight: 600, color: th.cyan, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${th.border}` },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' },
    selectItem: { padding: '0.75rem', backgroundColor: th.inputBg, border: `1px solid ${th.border}`, borderRadius: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer', transition: 'border-color 0.2s' },
    selectItemActive: { borderColor: th.teal, backgroundColor: 'rgba(6,182,212,0.1)' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
    th: { textAlign: 'left', padding: '0.75rem 0.5rem', color: th.muted, borderBottom: `1px solid ${th.border}`, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 },
    td: { padding: '0.75rem 0.5rem', borderBottom: `1px solid ${th.border}` },
    badge: { padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 },
    btnPrimary: { padding: '0.6rem 1.5rem', backgroundColor: th.teal, border: 'none', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' },
    btnSmall: { padding: '0.3rem 0.6rem', backgroundColor: 'rgba(6,182,212,0.1)', border: `1px solid ${th.border}`, borderRadius: '0.4rem', color: th.cyan, fontSize: '0.75rem', cursor: 'pointer' },
    btnDanger: { padding: '0.3rem 0.6rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.4rem', color: th.red, fontSize: '0.75rem', cursor: 'pointer' },
    mapPlaceholder: { width: '100%', height: '200px', backgroundColor: th.inputBg, border: `1px solid ${th.border}`, borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: th.muted, fontSize: '0.85rem' },
    routeLine: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: th.cyan, fontSize: '0.75rem' },
    routeDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: th.cyan },
    loading: { textAlign: 'center', padding: '4rem', color: th.muted },
    error: { textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', color: th.red, marginBottom: '1rem' },
    success: { textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '0.5rem', color: '#22c55e', marginBottom: '1rem' },
    dispatchBtn: { width: '100%', padding: '0.6rem', marginTop: '0.5rem', backgroundColor: th.teal, border: 'none', borderRadius: '0.5rem', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' },
    sectionTitle: { fontSize: '0.8rem', color: th.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }
  };

  const [dispatches, setDispatches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tankers, setTankers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedTanker, setSelectedTanker] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [dRes, bRes, tRes, drRes] = await Promise.allSettled([
        fetch(`${API_BASE}/dispatches`),
        fetch(`${API_BASE}/bookings`),
        fetch(`${API_BASE}/tankers`),
        fetch(`${API_BASE}/drivers`)
      ]);
      const dData = dRes.status === 'fulfilled' ? await dRes.value.json() : [];
      const bData = bRes.status === 'fulfilled' ? await bRes.value.json() : [];
      const tData = tRes.status === 'fulfilled' ? await tRes.value.json() : [];
      const drData = drRes.status === 'fulfilled' ? await drRes.value.json() : [];
      setDispatches(Array.isArray(dData) ? dData : dData.dispatches || []);
      setBookings(Array.isArray(bData) ? bData : bData.bookings || []);
      setTankers(Array.isArray(tData) ? tData : tData.tankers || []);
      setDrivers(Array.isArray(drData) ? drData : drData.drivers || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const pendingBookings = bookings.filter(b => {
    const s = (b.status || 'pending').toLowerCase();
    return s === 'pending' || s === 'scheduled';
  });

  const availableTankers = tankers.filter(t => {
    const s = (t.status || 'available').toLowerCase();
    return s === 'available';
  });

  const availableDrivers = drivers.filter(d => {
    const s = (d.status || 'active').toLowerCase();
    return s === 'available' || s === 'active';
  });

  const activeDispatches = dispatches.filter(d => {
    const s = (d.status || '').toLowerCase();
    return s !== 'delivered' && s !== 'cancelled';
  });

  const handleDispatch = async () => {
    if (!selectedBooking || !selectedTanker || !selectedDriver) {
      setError('Please select a booking, tanker, and driver');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/dispatches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.id || selectedBooking.bookingId,
          tankerId: selectedTanker.id || selectedTanker.tankerId,
          driverId: selectedDriver.id || selectedDriver.driverId,
          status: 'assigned'
        })
      });
      if (!res.ok) throw new Error('Dispatch failed');
      setSuccess('Dispatch created successfully');
      setSelectedBooking(null);
      setSelectedTanker(null);
      setSelectedDriver(null);
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateDispatchStatus = async (id, newStatus) => {
    try {
      await fetch(`${API_BASE}/dispatches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      loadAll();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const getDispatchId = (d) => d.id || d.dispatchId || '-';
  const getDispatchBooking = (d) => d.bookingId || d.booking_id || '-';
  const getDispatchDriver = (d) => d.driverName || d.driver_name || d.driverId || '-';
  const getDispatchTanker = (d) => d.tankerNumber || d.tanker_number || d.tankerId || '-';
  const getDispatchStatus = (d) => (d.status || 'assigned').toLowerCase();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Dispatch Management</h1>
          <p style={styles.subtitle}>Manage water tanker dispatches and track deliveries</p>
        </div>

        {error && <div style={styles.error}>{error}<span onClick={() => setError('')} style={{ cursor: 'pointer', marginLeft: '1rem' }}>✕</span></div>}
        {success && <div style={styles.success}>{success}<span onClick={() => setSuccess('')} style={{ cursor: 'pointer', marginLeft: '1rem' }}>✕</span></div>}

        {loading ? (
          <div style={styles.loading}>Loading dispatch data...</div>
        ) : (
          <>
            <div style={styles.card}>
              <div style={styles.cardTitle}>New Dispatch</div>
              <div style={styles.grid}>
                <div>
                  <div style={styles.sectionTitle}>Pending Bookings ({pendingBookings.length})</div>
                  {pendingBookings.length === 0 ? (
                    <div style={{ color: th.muted, fontSize: '0.85rem', padding: '1rem' }}>No pending bookings</div>
                  ) : pendingBookings.slice(0, 4).map(b => {
                    const bid = b.bookingId || b.id;
                    return (
                    <div key={bid} style={{ ...styles.selectItem, ...(selectedBooking?.bookingId === bid ? styles.selectItemActive : {}) }} onClick={() => setSelectedBooking(b)}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{b.customerName || b.customer_name || 'Customer'}</div>
                      <div style={{ fontSize: '0.75rem', color: th.muted }}>{b.areaId || b.area || '-'} • {b.tankerSize || b.tanker_size || '-'}</div>
                    </div>
                    );
                  })}
                </div>
                <div>
                  <div style={styles.sectionTitle}>Available Tankers ({availableTankers.length})</div>
                  {availableTankers.length === 0 ? (
                    <div style={{ color: th.muted, fontSize: '0.85rem', padding: '1rem' }}>No tankers available</div>
                  ) : availableTankers.slice(0, 4).map(t => {
                    const tid = t.tankerId || t.id;
                    return (
                    <div key={tid} style={{ ...styles.selectItem, ...(selectedTanker?.tankerId === tid ? styles.selectItemActive : {}) }} onClick={() => setSelectedTanker(t)}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{t.tankerId || t.number || 'Tanker'}</div>
                      <div style={{ fontSize: '0.75rem', color: th.muted }}>{t.capacity || '-'}L • {typeof t.currentLocation === 'object' ? t.currentLocation?.lat?.toFixed(2) + ',' + t.currentLocation?.lng?.toFixed(2) : t.currentLocation || t.location || 'Depot'}</div>
                    </div>
                    );
                  })}
                </div>
                <div>
                  <div style={styles.sectionTitle}>Available Drivers ({availableDrivers.length})</div>
                  {availableDrivers.length === 0 ? (
                    <div style={{ color: th.muted, fontSize: '0.85rem', padding: '1rem' }}>No drivers available</div>
                  ) : availableDrivers.slice(0, 4).map(d => {
                    const did = d.driverId || d.id;
                    return (
                    <div key={did} style={{ ...styles.selectItem, ...(selectedDriver?.driverId === did ? styles.selectItemActive : {}) }} onClick={() => setSelectedDriver(d)}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{d.name || d.driverName || 'Driver'}</div>
                      <div style={{ fontSize: '0.75rem', color: th.muted }}>{d.phone || '-'} • ★ {d.rating || d.stars || 4}</div>
                    </div>
                    );
                  })}
                </div>
              </div>
              <button style={styles.dispatchBtn} onClick={handleDispatch} disabled={!selectedBooking || !selectedTanker || !selectedDriver}>
                Dispatch Selected
              </button>
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>Active Dispatches ({activeDispatches.length})</div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Booking</th>
                    <th style={styles.th}>Driver</th>
                    <th style={styles.th}>Tanker</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>ETA</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeDispatches.length === 0 ? (
                    <tr><td colSpan={7} style={{ ...styles.td, textAlign: 'center', color: th.muted }}>No active dispatches</td></tr>
                  ) : activeDispatches.map(d => {
                    const st = getDispatchStatus(d);
                    const sc = STATUS_COLORS[st] || STATUS_COLORS.assigned;
                    const nextStatus = STATUS_FLOW[STATUS_FLOW.findIndex(s => s.toLowerCase() === st) + 1];
                    return (
                      <tr key={getDispatchId(d)}>
                        <td style={{ ...styles.td, fontFamily: 'monospace', color: th.cyan, fontSize: '0.8rem' }}>{getDispatchId(d)}</td>
                        <td style={styles.td}>{getDispatchBooking(d)}</td>
                        <td style={styles.td}>{getDispatchDriver(d)}</td>
                        <td style={styles.td}>{getDispatchTanker(d)}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, backgroundColor: sc.bg, color: sc.text }}>{st}</span>
                        </td>
                        <td style={styles.td}>{d.eta || d.estimatedArrival || '30-45 min'}</td>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {nextStatus && (
                              <button style={styles.btnSmall} onClick={() => updateDispatchStatus(getDispatchId(d), nextStatus.toLowerCase())}>
                                → {nextStatus}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {activeDispatches.length > 0 && (
              <div style={styles.card}>
                <div style={styles.cardTitle}>Route Tracking</div>
                <div style={styles.mapPlaceholder}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗺️</div>
                  <div>Map View — Live Tracking</div>
                  <div style={styles.routeLine}>
                    <div style={styles.routeDot}></div>
                    <span>Depot</span>
                    <div style={{ width: '60px', height: '1px', backgroundColor: th.cyan }}></div>
                    <span>📍</span>
                    <div style={{ width: '60px', height: '1px', backgroundColor: th.muted }}></div>
                    <div style={{ ...styles.routeDot, backgroundColor: th.muted }}></div>
                    <span>Destination</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DispatchPage;
