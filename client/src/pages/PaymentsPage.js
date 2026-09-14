import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const API_BASE = '/api';

const STATUS_COLORS = {
  pending: { bg: 'rgba(234,179,8,0.15)', text: '#eab308' },
  completed: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
  refunded: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' }
};

const METHOD_ICONS = { Cash: '💵', cash: '💵', JazzCash: '📱', jazzcash: '📱', EasyPaisa: '📱', easypaisa: '📱', Bank: '🏦', bank: '🏦' };

function PaymentsPage() {
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
    cardTitle: { fontSize: '1rem', fontWeight: 600, color: th.cyan, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${th.border}` },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
    statCard: { backgroundColor: th.card, border: `1px solid ${th.border}`, borderRadius: '0.75rem', padding: '1.25rem', textAlign: 'center' },
    statValue: { fontSize: '1.5rem', fontWeight: 700, color: th.cyan },
    statLabel: { fontSize: '0.75rem', color: th.muted, marginTop: '0.3rem' },
    controls: { display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' },
    select: { padding: '0.5rem 0.75rem', backgroundColor: th.inputBg, border: `1px solid ${th.border}`, borderRadius: '0.5rem', color: th.text, fontSize: '0.85rem', outline: 'none', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
    th: { textAlign: 'left', padding: '0.75rem 0.5rem', color: th.muted, borderBottom: `1px solid ${th.border}`, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 },
    td: { padding: '0.75rem 0.5rem', borderBottom: `1px solid ${th.border}` },
    badge: { padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 },
    methodBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.5rem', backgroundColor: 'rgba(34,211,238,0.05)', border: `1px solid ${th.border}`, borderRadius: '1rem', fontSize: '0.75rem', color: th.text },
    chartPlaceholder: { width: '100%', height: '200px', backgroundColor: th.inputBg, border: `1px solid ${th.border}`, borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: th.muted, fontSize: '0.85rem' },
    chartBars: { display: 'flex', alignItems: 'flex-end', gap: '6px', height: '120px', marginTop: '1rem' },
    chartBar: { width: '20px', backgroundColor: 'rgba(6,182,212,0.3)', borderRadius: '3px 3px 0 0', transition: 'height 0.3s' },
    btn: { padding: '0.5rem 1rem', backgroundColor: 'rgba(6,182,212,0.1)', border: `1px solid ${th.border}`, borderRadius: '0.5rem', color: th.cyan, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 },
    btnPrimary: { padding: '0.5rem 1rem', backgroundColor: th.teal, border: 'none', borderRadius: '0.5rem', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' },
    loading: { textAlign: 'center', padding: '4rem', color: th.muted },
    error: { textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', color: th.red, marginBottom: '1rem' },
    success: { textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '0.5rem', color: '#22c55e', marginBottom: '1rem' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { backgroundColor: th.card, border: `1px solid ${th.border}`, borderRadius: '0.75rem', padding: '2rem', maxWidth: '450px', width: '90%' },
    label: { display: 'block', fontSize: '0.75rem', fontWeight: 500, color: th.muted, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
    input: { width: '100%', padding: '0.55rem 0.75rem', backgroundColor: th.inputBg, border: `1px solid ${th.border}`, borderRadius: '0.5rem', color: th.text, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', marginBottom: '0.75rem' }
  };

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPayment, setNewPayment] = useState({ bookingId: '', customer: '', amount: '', method: 'Cash' });

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${API_BASE}/payments`);
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : data.payments || []);
    } catch (err) {
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const getId = (p) => p.id || p.paymentId || '-';
  const getBooking = (p) => p.bookingId || p.booking_id || '-';
  const getCustomer = (p) => p.customerName || p.customer_name || p.customer || '-';
  const getAmount = (p) => p.amount || p.totalAmount || 0;
  const getMethod = (p) => p.method || p.paymentMethod || 'Cash';
  const getStatus = (p) => (p.status || 'pending').toLowerCase();
  const getDate = (p) => p.date || p.createdAt || p.created_at || null;

  const filtered = payments.filter(p => {
    if (filterMethod && getMethod(p).toLowerCase() !== filterMethod.toLowerCase()) return false;
    if (filterStatus && getStatus(p) !== filterStatus) return false;
    return true;
  });

  const today = new Date().toDateString();
  const todayRevenue = payments.filter(p => getStatus(p) === 'completed' && getDate(p) && new Date(getDate(p)).toDateString() === today).reduce((s, p) => s + getAmount(p), 0);
  const completedPayments = payments.filter(p => getStatus(p) === 'completed');
  const weekRevenue = completedPayments.reduce((s, p) => s + getAmount(p), 0);
  const monthRevenue = weekRevenue;
  const outstanding = payments.filter(p => getStatus(p) === 'pending').reduce((s, p) => s + getAmount(p), 0);

  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newPayment, amount: Number(newPayment.amount), status: 'completed' })
      });
      if (!res.ok) throw new Error('Failed to add payment');
      setSuccess('Payment recorded successfully');
      setShowAddForm(false);
      setNewPayment({ bookingId: '', customer: '', amount: '', method: 'Cash' });
      fetchPayments();
    } catch (err) {
      setError(err.message);
    }
  };

  const chartValues = [45, 65, 55, 80, 70, 90, 75, 95, 60, 85, 78, 88];
  const maxVal = Math.max(...chartValues);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Payments & Revenue</h1>
          <button style={styles.btnPrimary} onClick={() => setShowAddForm(true)}>+ Record Payment</button>
        </div>

        {error && <div style={styles.error}>{error}<span onClick={() => setError('')} style={{ cursor: 'pointer', marginLeft: '1rem' }}>✕</span></div>}
        {success && <div style={styles.success}>{success}<span onClick={() => setSuccess('')} style={{ cursor: 'pointer', marginLeft: '1rem' }}>✕</span></div>}

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>PKR {todayRevenue.toLocaleString()}</div>
            <div style={styles.statLabel}>Today's Revenue</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>PKR {weekRevenue.toLocaleString()}</div>
            <div style={styles.statLabel}>This Period</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>PKR {monthRevenue.toLocaleString()}</div>
            <div style={styles.statLabel}>Monthly Total</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: th.red }}>PKR {outstanding.toLocaleString()}</div>
            <div style={styles.statLabel}>Outstanding</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Revenue Trend</div>
          <div style={styles.chartPlaceholder}>
            <div style={styles.chartBars}>
              {chartValues.map((v, i) => (
                <div key={i} style={{ ...styles.chartBar, height: `${(v / maxVal) * 100}%` }}></div>
              ))}
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: th.muted }}>Last 12 months revenue</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Payment Records</div>
          <div style={styles.controls}>
            <select style={styles.select} value={filterMethod} onChange={e => setFilterMethod(e.target.value)}>
              <option value="">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="JazzCash">JazzCash</option>
              <option value="EasyPaisa">EasyPaisa</option>
              <option value="Bank">Bank Transfer</option>
            </select>
            <select style={styles.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          {loading ? (
            <div style={styles.loading}>Loading payments...</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Booking</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Method</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ ...styles.td, textAlign: 'center', color: th.muted }}>No payments found</td></tr>
                ) : filtered.map(p => {
                  const st = getStatus(p);
                  const sc = STATUS_COLORS[st] || STATUS_COLORS.pending;
                  const method = getMethod(p);
                  return (
                    <tr key={getId(p)}>
                      <td style={{ ...styles.td, fontFamily: 'monospace', color: th.cyan, fontSize: '0.8rem' }}>{getId(p)}</td>
                      <td style={styles.td}>{getBooking(p)}</td>
                      <td style={styles.td}>{getCustomer(p)}</td>
                      <td style={{ ...styles.td, fontWeight: 600 }}>PKR {getAmount(p).toLocaleString()}</td>
                      <td style={styles.td}>
                        <span style={styles.methodBadge}>{METHOD_ICONS[method] || '💰'} {method}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, backgroundColor: sc.bg, color: sc.text }}>{st}</span>
                      </td>
                      <td style={{ ...styles.td, color: th.muted, fontSize: '0.8rem' }}>
                        {getDate(p) ? new Date(getDate(p)).toLocaleDateString('en-PK') : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showAddForm && (
        <div style={styles.overlay} onClick={() => setShowAddForm(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: th.cyan, marginBottom: '1rem' }}>Record Payment</div>
            <form onSubmit={handleAddPayment}>
              <label style={styles.label}>Booking ID</label>
              <input style={styles.input} type="text" value={newPayment.bookingId} onChange={e => setNewPayment({ ...newPayment, bookingId: e.target.value })} placeholder="Booking reference" required />
              <label style={styles.label}>Customer</label>
              <input style={styles.input} type="text" value={newPayment.customer} onChange={e => setNewPayment({ ...newPayment, customer: e.target.value })} placeholder="Customer name" required />
              <label style={styles.label}>Amount (PKR)</label>
              <input style={styles.input} type="number" value={newPayment.amount} onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })} placeholder="Amount" required />
              <label style={styles.label}>Payment Method</label>
              <select style={{ ...styles.input, cursor: 'pointer' }} value={newPayment.method} onChange={e => setNewPayment({ ...newPayment, method: e.target.value })}>
                <option value="Cash">💵 Cash</option>
                <option value="JazzCash">📱 JazzCash</option>
                <option value="EasyPaisa">📱 EasyPaisa</option>
                <option value="Bank">🏦 Bank Transfer</option>
              </select>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button style={{ ...styles.btn, flex: 1 }} type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
                <button style={{ ...styles.btnPrimary, flex: 1 }} type="submit">Save Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsPage;
