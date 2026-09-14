import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const API_BASE = '/api';

const WHO_STANDARDS = {
  ph: { min: 6.5, max: 8.5, unit: '', label: 'pH Level' },
  tds: { min: 0, max: 1000, unit: 'ppm', label: 'Total Dissolved Solids' },
  turbidity: { min: 0, max: 5, unit: 'NTU', label: 'Turbidity' },
  chlorine: { min: 0, max: 5, unit: 'mg/l', label: 'Chlorine Residual' }
};

function QualityPage() {
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
    grid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' },
    card: { backgroundColor: th.card, border: `1px solid ${th.border}`, borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' },
    cardTitle: { fontSize: '1rem', fontWeight: 600, color: th.cyan, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${th.border}` },
    label: { display: 'block', fontSize: '0.75rem', fontWeight: 500, color: th.muted, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
    input: { width: '100%', padding: '0.55rem 0.75rem', backgroundColor: th.inputBg, border: `1px solid ${th.border}`, borderRadius: '0.5rem', color: th.text, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', marginBottom: '0.75rem' },
    select: { width: '100%', padding: '0.55rem 0.75rem', backgroundColor: th.inputBg, border: `1px solid ${th.border}`, borderRadius: '0.5rem', color: th.text, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', cursor: 'pointer', marginBottom: '0.75rem' },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    btnPrimary: { width: '100%', padding: '0.65rem', backgroundColor: th.teal, border: 'none', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
    th: { textAlign: 'left', padding: '0.75rem 0.5rem', color: th.muted, borderBottom: `1px solid ${th.border}`, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 },
    td: { padding: '0.75rem 0.5rem', borderBottom: `1px solid ${th.border}` },
    pass: { color: th.green, fontWeight: 600 },
    fail: { color: th.red, fontWeight: 600 },
    scoreBox: { textAlign: 'center', padding: '1rem', backgroundColor: th.inputBg, borderRadius: '0.5rem', marginTop: '0.75rem' },
    scoreValue: { fontSize: '2rem', fontWeight: 700 },
    whoItem: { display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: `1px solid ${th.border}` },
    whoLabel: { color: th.muted, fontSize: '0.85rem' },
    whoRange: { color: th.cyan, fontSize: '0.85rem', fontFamily: 'monospace' },
    loading: { textAlign: 'center', padding: '4rem', color: th.muted },
    error: { textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', color: th.red, marginBottom: '1rem' },
    success: { textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '0.5rem', color: '#22c55e', marginBottom: '1rem' }
  };

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    tankerId: '', source: '', ph: '', tds: '', turbidity: '', chlorine: '', bacteria: 'pass'
  });

  useEffect(() => { fetchTests(); }, []);

  const fetchTests = async () => {
    try {
      const res = await fetch(`${API_BASE}/quality-tests`);
      const data = await res.json();
      setTests(Array.isArray(data) ? data : data.tests || []);
    } catch (err) {
      setError('Failed to load test records');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const checkPass = (key, value) => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    const std = WHO_STANDARDS[key];
    if (!std) return null;
    return v >= std.min && v <= std.max;
  };

  const calculateScore = () => {
    let total = 0, passed = 0;
    ['ph', 'tds', 'turbidity', 'chlorine'].forEach(key => {
      const result = checkPass(key, form[key]);
      if (result !== null) {
        total++;
        if (result) passed++;
      }
    });
    if (form.bacteria === 'pass') { passed++; }
    total++;
    return total > 0 ? Math.round((passed / total) * 100) : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tankerId || !form.source) {
      setError('Tanker ID and source are required');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/quality-tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          ph: parseFloat(form.ph), tds: parseFloat(form.tds),
          turbidity: parseFloat(form.turbidity), chlorine: parseFloat(form.chlorine),
          qualityScore: calculateScore(),
          bacteria: form.bacteria
        })
      });
      if (!res.ok) throw new Error('Failed to save test');
      setSuccess('Quality test recorded successfully');
      setForm({ tankerId: '', source: '', ph: '', tds: '', turbidity: '', chlorine: '', bacteria: 'pass' });
      fetchTests();
    } catch (err) {
      setError(err.message);
    }
  };

  const getTestId = (t) => t.id || t.testId || '-';
  const getScore = (t) => t.qualityScore || t.quality_score || t.score || 0;
  const getBacteria = (t) => t.bacteria || 'pass';

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Water Quality Testing</h1>
          <p style={styles.subtitle}>Monitor and record water quality parameters for tanker fleet</p>
        </div>

        {error && <div style={styles.error}>{error}<span onClick={() => setError('')} style={{ cursor: 'pointer', marginLeft: '1rem' }}>✕</span></div>}
        {success && <div style={styles.success}>{success}<span onClick={() => setSuccess('')} style={{ cursor: 'pointer', marginLeft: '1rem' }}>✕</span></div>}

        <div style={styles.grid}>
          <div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>New Quality Test</div>
              <form onSubmit={handleSubmit}>
                <div style={styles.formRow}>
                  <div>
                    <label style={styles.label}>Tanker ID *</label>
                    <input style={styles.input} type="text" name="tankerId" value={form.tankerId} onChange={handleChange} placeholder="e.g., T-001" />
                  </div>
                  <div>
                    <label style={styles.label}>Water Source *</label>
                    <select style={styles.select} name="source" value={form.source} onChange={handleChange}>
                      <option value="">Select source</option>
                      <option value="municipal">Municipal Supply</option>
                      <option value="borewell">Borewell</option>
                      <option value="tank">Storage Tank</option>
                      <option value="natural">Natural Source</option>
                      <option value="treatment">Treatment Plant</option>
                    </select>
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div>
                    <label style={styles.label}>pH Level</label>
                    <input style={styles.input} type="number" step="0.1" name="ph" value={form.ph} onChange={handleChange} placeholder="6.5 - 8.5" />
                    {form.ph && <span style={checkPass('ph', form.ph) ? styles.pass : styles.fail}>{checkPass('ph', form.ph) ? '✓ Pass' : '✕ Fail'}</span>}
                  </div>
                  <div>
                    <label style={styles.label}>TDS (ppm)</label>
                    <input style={styles.input} type="number" name="tds" value={form.tds} onChange={handleChange} placeholder="0 - 1000" />
                    {form.tds && <span style={checkPass('tds', form.tds) ? styles.pass : styles.fail}>{checkPass('tds', form.tds) ? '✓ Pass' : '✕ Fail'}</span>}
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div>
                    <label style={styles.label}>Turbidity (NTU)</label>
                    <input style={styles.input} type="number" step="0.1" name="turbidity" value={form.turbidity} onChange={handleChange} placeholder="0 - 5" />
                    {form.turbidity && <span style={checkPass('turbidity', form.turbidity) ? styles.pass : styles.fail}>{checkPass('turbidity', form.turbidity) ? '✓ Pass' : '✕ Fail'}</span>}
                  </div>
                  <div>
                    <label style={styles.label}>Chlorine (mg/l)</label>
                    <input style={styles.input} type="number" step="0.1" name="chlorine" value={form.chlorine} onChange={handleChange} placeholder="0 - 5" />
                    {form.chlorine && <span style={checkPass('chlorine', form.chlorine) ? styles.pass : styles.fail}>{checkPass('chlorine', form.chlorine) ? '✓ Pass' : '✕ Fail'}</span>}
                  </div>
                </div>

                <div>
                  <label style={styles.label}>Bacteria Test</label>
                  <select style={styles.select} name="bacteria" value={form.bacteria} onChange={handleChange}>
                    <option value="pass">✓ Pass (No bacteria detected)</option>
                    <option value="fail">✕ Fail (Bacteria detected)</option>
                  </select>
                </div>

                <div style={styles.scoreBox}>
                  <div style={styles.label}>Quality Score</div>
                  <div style={{ ...styles.scoreValue, color: calculateScore() >= 80 ? th.green : calculateScore() >= 50 ? th.amber : th.red }}>
                    {calculateScore()}%
                  </div>
                </div>

                <button style={styles.btnPrimary} type="submit">Submit Test Results</button>
              </form>
            </div>
          </div>

          <div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>WHO Standards Reference</div>
              {Object.entries(WHO_STANDARDS).map(([key, std]) => (
                <div style={styles.whoItem} key={key}>
                  <span style={styles.whoLabel}>{std.label}</span>
                  <span style={styles.whoRange}>{std.min} - {std.max} {std.unit}</span>
                </div>
              ))}
              <div style={{ ...styles.whoItem, borderBottom: 'none' }}>
                <span style={styles.whoLabel}>Bacteria Test</span>
                <span style={styles.whoRange}>Not Detected</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Test History</div>
          {loading ? (
            <div style={styles.loading}>Loading test records...</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Tanker</th>
                  <th style={styles.th}>Source</th>
                  <th style={styles.th}>pH</th>
                  <th style={styles.th}>TDS</th>
                  <th style={styles.th}>Turbidity</th>
                  <th style={styles.th}>Chlorine</th>
                  <th style={styles.th}>Bacteria</th>
                  <th style={styles.th}>Score</th>
                </tr>
              </thead>
              <tbody>
                {tests.length === 0 ? (
                  <tr><td colSpan={9} style={{ ...styles.td, textAlign: 'center', color: th.muted }}>No test records found</td></tr>
                ) : tests.map(t => {
                  const score = getScore(t);
                  const bact = getBacteria(t);
                  return (
                    <tr key={getTestId(t)}>
                      <td style={{ ...styles.td, fontFamily: 'monospace', color: th.cyan, fontSize: '0.8rem' }}>{getTestId(t)}</td>
                      <td style={styles.td}>{t.tankerId || t.tanker_id || '-'}</td>
                      <td style={styles.td}>{t.source || '-'}</td>
                      <td style={styles.td}>{t.ph || '-'}</td>
                      <td style={styles.td}>{t.tds || '-'}</td>
                      <td style={styles.td}>{t.turbidity || '-'}</td>
                      <td style={styles.td}>{t.chlorine || '-'}</td>
                      <td style={styles.td}>
                        <span style={['pass', 'absent', 'safe'].includes(bact) ? styles.pass : styles.fail}>
                          {['pass', 'absent', 'safe'].includes(bact) ? '✓ Pass' : '✕ Fail'}
                        </span>
                      </td>
                      <td style={{ ...styles.td, fontWeight: 700, color: score >= 80 ? th.green : score >= 50 ? th.amber : th.red }}>
                        {score}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default QualityPage;
