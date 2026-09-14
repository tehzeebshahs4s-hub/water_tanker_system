import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const API_BASE = '/api';

const STATUS_COLORS = {
  pending: { bg: 'rgba(234,179,8,0.15)', text: '#eab308' },
  confirmed: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
  dispatched: { bg: 'rgba(249,115,22,0.15)', text: '#f97316' },
  delivered: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
  cancelled: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' }
};

function BookingsListPage() {
  const navigate = useNavigate();
  const { colors, themeName } = useTheme();
  const t = colors;
  const th = themeName === 'dark'
    ? { bg: '#031220', card: '#0d2536', border: 'rgba(34,211,238,0.12)', text: '#e6f2f8', muted: '#94a3b8', dim: '#64748b', cyan: '#22d3ee', teal: '#06b6d4', green: '#10b981', red: '#ef4444', amber: '#f59e0b', purple: '#a78bfa', inputBg: '#031220' }
    : { bg: '#f0f4f8', card: '#ffffff', border: 'rgba(15,23,41,0.08)', text: '#0f1729', muted: '#64748b', dim: '#94a3b8', cyan: '#0891b2', teal: '#0e7490', green: '#059669', red: '#dc2626', amber: '#d97706', purple: '#7c3aed', inputBg: '#ffffff' };

  const styles = {
    page: { minHeight: '100vh', backgroundColor: th.bg, color: th.text, padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' },
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    title: { fontSize: '1.75rem', fontWeight: 700, color: th.cyan },
    card: { backgroundColor: th.card, border: `1px solid ${th.border}`, borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' },
    controls: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
    input: { padding: '0.5rem 0.75rem', backgroundColor: th.inputBg, border: `1px solid ${th.border}`, borderRadius: '0.5rem', color: th.text, fontSize: '0.85rem', outline: 'none' },
    select: { padding: '0.5rem 0.75rem', backgroundColor: th.inputBg, border: `1px solid ${th.border}`, borderRadius: '0.5rem', color: th.text, fontSize: '0.85rem', outline: 'none', cursor: 'pointer' },
    btn: { padding: '0.5rem 1rem', backgroundColor: 'rgba(6,182,212,0.1)', border: `1px solid ${th.border}`, borderRadius: '0.5rem', color: th.cyan, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
    th: { textAlign: 'left', padding: '0.75rem 0.5rem', color: th.muted, borderBottom: `1px solid ${th.border}`, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 },
    td: { padding: '0.75rem 0.5rem', borderBottom: `1px solid ${th.border}` },
    badge: { padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 },
    loading: { textAlign: 'center', padding: '4rem', color: th.muted },
    error: { textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', color: th.red, marginBottom: '1rem' },
    detailOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    detailCard: { backgroundColor: th.card, border: `1px solid ${th.border}`, borderRadius: '0.75rem', padding: '2rem', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto' },
    detailTitle: { fontSize: '1.1rem', fontWeight: 600, color: th.cyan, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${th.border}` },
    detailRow: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: `1px solid ${th.border}` },
    detailLabel: { color: th.muted, fontSize: '0.85rem' },
    detailValue: { color: th.text, fontSize: '0.85rem', fontWeight: 500 }
  };

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortDesc, setSortDesc] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : data.bookings || []);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings
    .filter(b => {
      if (statusFilter && b.status !== statusFilter) return false;
      if (search && !b.customerName?.toLowerCase().includes(search.toLowerCase()) && !b.customer_name?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const da = new Date(a.createdAt || a.created_at || 0);
      const db = new Date(b.createdAt || b.created_at || 0);
      return sortDesc ? db - da : da - db;
    });

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-PK') : '-';
  const formatTime = (d) => d ? new Date(d).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }) : '-';
  const getName = (b) => b.customerName || b.customer_name || '-';
  const getStatus = (b) => b.status || 'pending';
  const getId = (b) => b.id || b.bookingId || b.booking_id || '-';

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Bookings Management</h1>
          <button style={styles.btn} onClick={() => navigate('/dashboard/book')}>+ New Booking</button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.controls}>
          <input style={{ ...styles.input, width: '250px' }} type="text" placeholder="Search by customer name..." value={search} onChange={e => setSearch(e.target.value)} />
          <select style={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button style={styles.btn} onClick={() => setSortDesc(!sortDesc)}>
            Sort {sortDesc ? '↓ Newest' : '↑ Oldest'}
          </button>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading bookings...</div>
        ) : (
          <div style={styles.card}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Area</th>
                  <th style={styles.th}>Tanker</th>
                  <th style={styles.th}>Date/Time</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ ...styles.td, textAlign: 'center', color: th.muted }}>No bookings found</td></tr>
                ) : filtered.map(b => {
                  const st = getStatus(b);
                  const sc = STATUS_COLORS[st] || STATUS_COLORS.pending;
                  return (
                    <tr key={getId(b)} style={{ cursor: 'pointer' }} onClick={() => setSelectedBooking(b)}>
                      <td style={{ ...styles.td, fontFamily: 'monospace', color: th.cyan, fontSize: '0.8rem' }}>{getId(b)}</td>
                      <td style={styles.td}>{getName(b)}</td>
                      <td style={styles.td}>{b.areaId || b.area || '-'}</td>
                      <td style={styles.td}>{b.tankerSize || b.tanker_size || '-'}</td>
                      <td style={styles.td}>
                        <div>{formatDate(b.date || b.deliveryDate || b.delivery_date)}</div>
                        <div style={{ color: th.muted, fontSize: '0.75rem' }}>{b.timeSlot || b.time_slot || ''}</div>
                      </td>
                      <td style={{ ...styles.td, fontWeight: 600 }}>PKR {(b.price || b.amount || 0).toLocaleString()}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, backgroundColor: sc.bg, color: sc.text }}>{st}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedBooking && (
        <div style={styles.detailOverlay} onClick={() => setSelectedBooking(null)}>
          <div style={styles.detailCard} onClick={e => e.stopPropagation()}>
            <div style={styles.detailTitle}>Booking Details</div>
            {[
              ['Booking ID', getId(selectedBooking)],
              ['Customer', getName(selectedBooking)],
              ['Phone', selectedBooking.phone || '-'],
              ['Email', selectedBooking.email || '-'],
              ['Area', selectedBooking.areaId || selectedBooking.area || '-'],
              ['Tanker Size', selectedBooking.tankerSize || selectedBooking.tanker_size || '-'],
              ['Date', formatDate(selectedBooking.date || selectedBooking.deliveryDate || selectedBooking.delivery_date)],
              ['Time Slot', selectedBooking.timeSlot || selectedBooking.time_slot || '-'],
              ['Address', selectedBooking.address || '-'],
              ['Amount', `PKR ${(selectedBooking.price || selectedBooking.amount || 0).toLocaleString()}`],
              ['Status', getStatus(selectedBooking)],
              ['Instructions', selectedBooking.instructions || 'None']
            ].map(([label, value]) => (
              <div style={styles.detailRow} key={label}>
                <span style={styles.detailLabel}>{label}</span>
                <span style={styles.detailValue}>{value}</span>
              </div>
            ))}
            <button style={{ ...styles.btn, width: '100%', marginTop: '1rem' }} onClick={() => setSelectedBooking(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingsListPage;
