import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const API_BASE = '/api';

const SERVICE_TYPES = ['Oil Change', 'Tire Rotation', 'Brake Service', 'Tank Cleaning', 'Engine Service', 'Filter Replacement'];
const STATUS_COLORS = {
  scheduled: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
  'in-progress': { bg: 'rgba(249,115,22,0.15)', text: '#f97316' },
  completed: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
  overdue: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' }
};

function MaintenancePage() {
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
    alertsBar: { backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    alertText: { color: th.red, fontSize: '0.85rem', fontWeight: 500 },
    alertCount: { backgroundColor: th.red, color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
    statCard: { backgroundColor: th.card, border: `1px solid ${th.border}`, borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' },
    statValue: { fontSize: '1.3rem', fontWeight: 700, color: th.cyan },
    statLabel: { fontSize: '0.7rem', color: th.muted, marginTop: '0.2rem' },
    grid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
    th: { textAlign: 'left', padding: '0.75rem 0.5rem', color: th.muted, borderBottom: `1px solid ${th.border}`, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 },
    td: { padding: '0.75rem 0.5rem', borderBottom: `1px solid ${th.border}` },
    badge: { padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 },
    overdueBadge: { padding: '0.15rem 0.5rem', borderRadius: '0.25rem', backgroundColor: 'rgba(239,68,68,0.15)', color: th.red, fontSize: '0.7rem', fontWeight: 600, marginLeft: '0.5rem' },
    label: { display: 'block', fontSize: '0.75rem', fontWeight: 500, color: th.muted, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
    input: { width: '100%', padding: '0.55rem 0.75rem', backgroundColor: th.inputBg, border: `1px solid ${th.border}`, borderRadius: '0.5rem', color: th.text, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', marginBottom: '0.75rem' },
    select: { width: '100%', padding: '0.55rem 0.75rem', backgroundColor: th.inputBg, border: `1px solid ${th.border}`, borderRadius: '0.5rem', color: th.text, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', cursor: 'pointer', marginBottom: '0.75rem' },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    btnPrimary: { width: '100%', padding: '0.6rem', backgroundColor: th.teal, border: 'none', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' },
    loading: { textAlign: 'center', padding: '4rem', color: th.muted },
    error: { textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', color: th.red, marginBottom: '1rem' },
    success: { textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '0.5rem', color: '#22c55e', marginBottom: '1rem' },
    upcomingItem: { padding: '0.75rem', backgroundColor: th.inputBg, border: `1px solid ${th.border}`, borderRadius: '0.5rem', marginBottom: '0.5rem' },
    upcomingTitle: { fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' },
    upcomingDetail: { fontSize: '0.75rem', color: th.muted },
    costBar: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', borderBottom: `1px solid ${th.border}` },
    costBarFill: { height: '6px', borderRadius: '3px', backgroundColor: th.teal, transition: 'width 0.3s' },
    costBarBg: { flex: 1, height: '6px', borderRadius: '3px', backgroundColor: th.inputBg }
  };

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    tankerId: '', serviceType: '', lastServiceDate: '', nextServiceDue: '', mileage: '', cost: '', notes: ''
  });

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch(`${API_BASE}/maintenance`);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : data.records || data.maintenance || []);
    } catch (err) {
      setError('Failed to load maintenance records');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tankerId || !form.serviceType) {
      setError('Tanker ID and service type are required');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, cost: parseFloat(form.cost) || 0, mileage: parseInt(form.mileage) || 0 })
      });
      if (!res.ok) throw new Error('Failed to save record');
      setSuccess('Maintenance record saved');
      setForm({ tankerId: '', serviceType: '', lastServiceDate: '', nextServiceDue: '', mileage: '', cost: '', notes: '' });
      fetchRecords();
    } catch (err) {
      setError(err.message);
    }
  };

  const getRecordId = (r) => r.id || r.recordId || '-';
  const getTanker = (r) => r.tankerId || r.tanker_id || '-';
  const getType = (r) => r.type || r.serviceType || r.service_type || '-';
  const getLastDate = (r) => r.completedDate || r.lastServiceDate || r.last_service_date || null;
  const getNextDate = (r) => r.scheduledDate || r.nextServiceDue || r.next_service_due || null;
  const getStatus = (r) => (r.status || 'scheduled').toLowerCase();
  const getCost = (r) => r.cost || 0;
  const getMileage = (r) => r.mileage || 0;

  const now = new Date();
  const overdueRecords = records.filter(r => {
    const next = getNextDate(r);
    return next && new Date(next) < now && getStatus(r) !== 'completed';
  });

  const totalCost = records.reduce((s, r) => s + getCost(r), 0);
  const costByType = {};
  SERVICE_TYPES.forEach(t => { costByType[t] = 0; });
  records.forEach(r => {
    const t = getType(r);
    if (costByType[t] !== undefined) costByType[t] += getCost(r);
  });
  const maxCost = Math.max(...Object.values(costByType), 1);

  const upcoming = records.filter(r => {
    const next = getNextDate(r);
    return next && new Date(next) > now;
  }).sort((a, b) => new Date(getNextDate(a)) - new Date(getNextDate(b))).slice(0, 5);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Vehicle Maintenance</h1>
          <button style={{ padding: '0.5rem 1rem', backgroundColor: th.teal, border: 'none', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => document.getElementById('maintenance-form')?.scrollIntoView({ behavior: 'smooth' })}>+ New Record</button>
        </div>

        {error && <div style={styles.error}>{error}<span onClick={() => setError('')} style={{ cursor: 'pointer', marginLeft: '1rem' }}>✕</span></div>}
        {success && <div style={styles.success}>{success}<span onClick={() => setSuccess('')} style={{ cursor: 'pointer', marginLeft: '1rem' }}>✕</span></div>}

        {overdueRecords.length > 0 && (
          <div style={styles.alertsBar}>
            <span style={styles.alertCount}>{overdueRecords.length}</span>
            <span style={styles.alertText}>
              {overdueRecords.length} maintenance task(s) overdue — requires immediate attention
            </span>
          </div>
        )}

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{records.length}</div>
            <div style={styles.statLabel}>Total Records</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>PKR {totalCost.toLocaleString()}</div>
            <div style={styles.statLabel}>Total Maintenance Cost</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: th.red }}>{overdueRecords.length}</div>
            <div style={styles.statLabel}>Overdue Tasks</div>
          </div>
        </div>

        <div style={styles.grid}>
          <div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Maintenance Schedule</div>
              {loading ? (
                <div style={styles.loading}>Loading records...</div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Tanker</th>
                      <th style={styles.th}>Service Type</th>
                      <th style={styles.th}>Last Service</th>
                      <th style={styles.th}>Next Due</th>
                      <th style={styles.th}>Mileage</th>
                      <th style={styles.th}>Cost</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.length === 0 ? (
                      <tr><td colSpan={8} style={{ ...styles.td, textAlign: 'center', color: th.muted }}>No maintenance records</td></tr>
                    ) : records.map(r => {
                      const st = getStatus(r);
                      const sc = STATUS_COLORS[st] || STATUS_COLORS.scheduled;
                      const nextDue = getNextDate(r);
                      const isOverdue = nextDue && new Date(nextDue) < now && st !== 'completed';
                      return (
                        <tr key={getRecordId(r)}>
                          <td style={{ ...styles.td, fontFamily: 'monospace', color: th.cyan, fontSize: '0.8rem' }}>{getRecordId(r)}</td>
                          <td style={styles.td}>{getTanker(r)}</td>
                          <td style={styles.td}>{getType(r)}</td>
                          <td style={{ ...styles.td, fontSize: '0.8rem' }}>{getLastDate(r) ? new Date(getLastDate(r)).toLocaleDateString('en-PK') : '-'}</td>
                          <td style={styles.td}>
                            {nextDue ? new Date(nextDue).toLocaleDateString('en-PK') : '-'}
                            {isOverdue && <span style={styles.overdueBadge}>OVERDUE</span>}
                          </td>
                          <td style={styles.td}>{getMileage(r).toLocaleString()} km</td>
                          <td style={styles.td}>PKR {getCost(r).toLocaleString()}</td>
                          <td style={styles.td}>
                            <span style={{ ...styles.badge, backgroundColor: sc.bg, color: sc.text }}>{st}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>Maintenance Cost Breakdown</div>
              {SERVICE_TYPES.map(type => (
                <div style={styles.costBar} key={type}>
                  <span style={{ width: '140px', fontSize: '0.8rem', color: th.muted }}>{type}</span>
                  <div style={styles.costBarBg}>
                    <div style={{ ...styles.costBarFill, width: `${(costByType[type] / maxCost) * 100}%` }}></div>
                  </div>
                  <span style={{ width: '80px', fontSize: '0.8rem', textAlign: 'right' }}>PKR {costByType[type].toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div id="maintenance-form" style={styles.card}>
              <div style={styles.cardTitle}>Add Maintenance Record</div>
              <form onSubmit={handleSubmit}>
                <label style={styles.label}>Tanker ID *</label>
                <input style={styles.input} type="text" name="tankerId" value={form.tankerId} onChange={handleChange} placeholder="e.g., T-001" />

                <label style={styles.label}>Service Type *</label>
                <select style={styles.select} name="serviceType" value={form.serviceType} onChange={handleChange}>
                  <option value="">Select service</option>
                  {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <div style={styles.formRow}>
                  <div>
                    <label style={styles.label}>Last Service Date</label>
                    <input style={styles.input} type="date" name="lastServiceDate" value={form.lastServiceDate} onChange={handleChange} />
                  </div>
                  <div>
                    <label style={styles.label}>Next Service Due</label>
                    <input style={styles.input} type="date" name="nextServiceDue" value={form.nextServiceDue} onChange={handleChange} />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div>
                    <label style={styles.label}>Mileage (km)</label>
                    <input style={styles.input} type="number" name="mileage" value={form.mileage} onChange={handleChange} placeholder="Current mileage" />
                  </div>
                  <div>
                    <label style={styles.label}>Cost (PKR)</label>
                    <input style={styles.input} type="number" name="cost" value={form.cost} onChange={handleChange} placeholder="Service cost" />
                  </div>
                </div>

                <label style={styles.label}>Notes</label>
                <input style={styles.input} type="text" name="notes" value={form.notes} onChange={handleChange} placeholder="Any notes..." />

                <button style={styles.btnPrimary} type="submit">Save Record</button>
              </form>
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>Upcoming Services</div>
              {upcoming.length === 0 ? (
                <div style={{ color: th.muted, fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No upcoming services</div>
              ) : upcoming.map(r => (
                <div style={styles.upcomingItem} key={getRecordId(r)}>
                  <div style={styles.upcomingTitle}>{getType(r)} — {getTanker(r)}</div>
                  <div style={styles.upcomingDetail}>Due: {getNextDate(r) ? new Date(getNextDate(r)).toLocaleDateString('en-PK') : '-'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaintenancePage;
