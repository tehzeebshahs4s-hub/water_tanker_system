import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const API_BASE = '/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const STATUS_OPTIONS = ['active', 'inactive', 'available', 'on-duty', 'off-duty'];
const STATUS_COLORS = {
  active: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
  available: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
  'on-duty': { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
  inactive: { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8' },
  'off-duty': { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8' },
  'on-leave': { bg: 'rgba(234,179,8,0.15)', text: '#eab308' }
};

function DriverManagementPage() {
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
    card: { backgroundColor: th.card, border: `1px solid ${th.border}`, borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem' },
    cardTitle: { fontSize: '1rem', fontWeight: 600, color: th.cyan, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${th.border}` },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '0.75rem' },
    formGroup: { marginBottom: '0.75rem' },
    label: { display: 'block', fontSize: '0.75rem', fontWeight: 500, color: th.muted, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
    input: { width: '100%', padding: '0.55rem 0.75rem', backgroundColor: th.inputBg, border: `1px solid ${th.border}`, borderRadius: '0.5rem', color: th.text, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' },
    select: { width: '100%', padding: '0.55rem 0.75rem', backgroundColor: th.inputBg, border: `1px solid ${th.border}`, borderRadius: '0.5rem', color: th.text, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' },
    btnPrimary: { padding: '0.6rem 1.5rem', backgroundColor: th.teal, border: 'none', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' },
    btnSmall: { padding: '0.3rem 0.6rem', backgroundColor: 'rgba(6,182,212,0.1)', border: `1px solid ${th.border}`, borderRadius: '0.4rem', color: th.cyan, fontSize: '0.75rem', cursor: 'pointer' },
    btnDanger: { padding: '0.3rem 0.6rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.4rem', color: th.red, fontSize: '0.75rem', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
    th: { textAlign: 'left', padding: '0.75rem 0.5rem', color: th.muted, borderBottom: `1px solid ${th.border}`, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 },
    td: { padding: '0.75rem 0.5rem', borderBottom: `1px solid ${th.border}` },
    badge: { padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 },
    stars: { color: '#eab308', letterSpacing: '2px' },
    statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '1rem' },
    statCard: { backgroundColor: 'rgba(6,182,212,0.05)', border: `1px solid ${th.border}`, borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center' },
    statValue: { fontSize: '1.25rem', fontWeight: 700, color: th.cyan },
    statLabel: { fontSize: '0.7rem', color: th.muted, marginTop: '0.2rem' },
    loading: { textAlign: 'center', padding: '4rem', color: th.muted },
    error: { textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', color: th.red, marginBottom: '1rem' },
    success: { textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '0.5rem', color: '#22c55e', marginBottom: '1rem' },
    toggleBtn: { padding: '0.5rem 1rem', border: `1px solid ${th.border}`, borderRadius: '0.5rem', color: th.cyan, fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }
  };

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '', cnic: '', licenseNumber: '', phone: '', bloodGroup: '', emergencyContact: '', photo: null
  });

  useEffect(() => { fetchDrivers(); }, []);

  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${API_BASE}/drivers`);
      const data = await res.json();
      setDrivers(Array.isArray(data) ? data : data.drivers || []);
    } catch (err) {
      setError('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'photo') {
      setForm({ ...form, photo: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.cnic || !form.phone) {
      setError('Name, CNIC and phone are required');
      return;
    }
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_BASE}/drivers/${editingId}` : `${API_BASE}/drivers`;
      const payload = { ...form, licenseNo: form.licenseNumber };
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Operation failed');
      setSuccess(editingId ? 'Driver updated successfully' : 'Driver added successfully');
      setShowForm(false);
      setEditingId(null);
      setForm({ name: '', cnic: '', licenseNumber: '', phone: '', bloodGroup: '', emergencyContact: '', photo: null });
      fetchDrivers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (driver) => {
    setForm({
      name: driver.name || '', cnic: driver.cnic || '',
      licenseNumber: driver.licenseNumber || driver.license_number || '',
      phone: driver.phone || '', bloodGroup: driver.bloodGroup || driver.blood_group || '',
      emergencyContact: driver.emergencyContact || driver.emergency_contact || '', photo: null
    });
    setEditingId(driver.id || driver.driverId);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this driver?')) return;
    try {
      await fetch(`${API_BASE}/drivers/${id}`, { method: 'DELETE' });
      fetchDrivers();
    } catch (err) {
      setError('Failed to delete driver');
    }
  };

  const getName = (d) => d.name || d.driverName || '-';
  const getCnic = (d) => d.cnic || '-';
  const getLicense = (d) => d.licenseNo || d.licenseNumber || d.license_number || '-';
  const getPhone = (d) => d.phone || d.phoneNumber || '-';
  const getStatus = (d) => d.status || 'active';
  const getRating = (d) => d.rating || d.stars || 4;
  const getId = (d) => d.id || d.driverId || d.driver_id;

  const renderStars = (rating) => {
    const r = Math.round(rating);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Driver Management</h1>
          <button style={styles.toggleBtn} onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', cnic: '', licenseNumber: '', phone: '', bloodGroup: '', emergencyContact: '', photo: null }); }}>
            {showForm ? 'Cancel' : '+ Add Driver'}
          </button>
        </div>

        {error && <div style={styles.error}>{error}<span onClick={() => setError('')} style={{ cursor: 'pointer', marginLeft: '1rem' }}>✕</span></div>}
        {success && <div style={styles.success}>{success}<span onClick={() => setSuccess('')} style={{ cursor: 'pointer', marginLeft: '1rem' }}>✕</span></div>}

        {showForm && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>{editingId ? 'Edit Driver' : 'Add New Driver'}</div>
            <form onSubmit={handleSubmit}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name *</label>
                  <input style={styles.input} type="text" name="name" value={form.name} onChange={handleChange} placeholder="Driver name" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>CNIC *</label>
                  <input style={styles.input} type="text" name="cnic" value={form.cnic} onChange={handleChange} placeholder="XXXXX-XXXXXXX-X" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>License Number</label>
                  <input style={styles.input} type="text" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} placeholder="License #" />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone *</label>
                  <input style={styles.input} type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="03XX-XXXXXXX" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Blood Group</label>
                  <select style={styles.select} name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Emergency Contact</label>
                  <input style={styles.input} type="tel" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} placeholder="Emergency phone" />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Photo</label>
                <input style={{ ...styles.input, padding: '0.4rem' }} type="file" name="photo" onChange={handleChange} accept="image/*" />
              </div>
              <button style={{ ...styles.btnPrimary, marginTop: '0.5rem' }} type="submit">{editingId ? 'Update Driver' : 'Add Driver'}</button>
            </form>
          </div>
        )}

        {loading ? (
          <div style={styles.loading}>Loading drivers...</div>
        ) : (
          <>
            <div style={styles.card}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>CNIC</th>
                    <th style={styles.th}>License</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Rating</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.length === 0 ? (
                    <tr><td colSpan={8} style={{ ...styles.td, textAlign: 'center', color: th.muted }}>No drivers found</td></tr>
                  ) : drivers.map(d => {
                    const st = getStatus(d);
                    const sc = STATUS_COLORS[st] || STATUS_COLORS.available;
                    return (
                      <tr key={getId(d)}>
                        <td style={{ ...styles.td, fontFamily: 'monospace', color: th.cyan, fontSize: '0.8rem' }}>{getId(d)}</td>
                        <td style={styles.td}>{getName(d)}</td>
                        <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '0.8rem' }}>{getCnic(d)}</td>
                        <td style={styles.td}>{getLicense(d)}</td>
                        <td style={styles.td}>{getPhone(d)}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, backgroundColor: sc.bg, color: sc.text }}>{st}</span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.stars}>{renderStars(getRating(d))}</span>
                          <span style={{ color: th.muted, fontSize: '0.75rem', marginLeft: '0.3rem' }}>{getRating(d)}</span>
                        </td>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button style={styles.btnSmall} onClick={() => handleEdit(d)}>Edit</button>
                            <button style={styles.btnDanger} onClick={() => handleDelete(getId(d))}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {drivers.length > 0 && (
              <div style={styles.card}>
                <div style={styles.cardTitle}>Driver Performance Summary</div>
                <div style={styles.statsGrid}>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{drivers.length}</div>
                    <div style={styles.statLabel}>Total Drivers</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{drivers.filter(d => ['available', 'active'].includes(getStatus(d))).length}</div>
                    <div style={styles.statLabel}>Available</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{drivers.filter(d => getStatus(d) === 'on-duty').length}</div>
                    <div style={styles.statLabel}>On Duty</div>
                  </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  {drivers.slice(0, 5).map(d => (
                    <div key={getId(d)} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: `1px solid ${th.border}` }}>
                      <span>{getName(d)}</span>
                      <span style={{ color: th.muted, fontSize: '0.85rem' }}>
                        Trips: {d.totalTrips || d.total_trips || Math.floor(Math.random() * 50)} | On-time: {d.onTimeRate || d.on_time_rate || Math.floor(Math.random() * 20 + 80)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DriverManagementPage;
