import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const API_BASE = '/api';

function ResourceAssignment() {
  const { colors, themeName } = useTheme();
  const t = colors;
  const th = themeName === 'dark'
    ? { bg: '#031220', card: '#0d2536', border: 'rgba(34,211,238,0.12)', text: '#e6f2f8', muted: '#94a3b8', dim: '#64748b', cyan: '#22d3ee', teal: '#06b6d4', green: '#10b981', red: '#ef4444', amber: '#f59e0b', purple: '#a78bfa' }
    : { bg: '#f0f4f8', card: '#ffffff', border: 'rgba(15,23,41,0.08)', text: '#0f1729', muted: '#64748b', dim: '#94a3b8', cyan: '#0891b2', teal: '#0e7490', green: '#059669', red: '#dc2626', amber: '#d97706', purple: '#7c3aed' };

  const [tankers, setTankers] = useState([]);
  const [areas, setAreas] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [tankersRes, areasRes] = await Promise.all([fetch(`${API_BASE}/tankers`), fetch(`${API_BASE}/areas`)]);
      const [tankersData, areasData] = await Promise.all([tankersRes.json(), areasRes.json()]);
      setTankers(tankersData);
      setAreas(areasData);
    } catch (err) { console.error('Error fetching data:', err); }
  };

  const runGreedy = async () => {
    setLoading(true);
    try {
      const availableTankers = tankers.filter(t => t.status === 'available');
      const response = await fetch(`${API_BASE}/algorithms/greedy`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tankers: availableTankers, areas, options: { prioritizeDistance: true } })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) { console.error('Error running greedy:', err); }
    setLoading(false);
  };

  const badge = (color, bg) => ({ padding: '3px 10px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 700, background: bg, color });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: th.text }}>Resource Assignment</h1>
        <p style={{ color: th.muted, fontSize: '0.85rem', marginTop: 4 }}>Greedy Algorithm for Tanker Allocation</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text }}>Available Tankers</h3>
            <span style={badge(th.green, `${th.green}20`)}>{tankers.filter(t => t.status === 'available').length} available</span>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: 380 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead><tr>{['ID', 'Type', 'Capacity', 'Location', 'Status'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: th.dim, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', borderBottom: `1px solid ${th.border}` }}>{h}</th>)}</tr></thead>
              <tbody>
                {tankers.map(t => (
                  <tr key={t.tankerId} style={{ borderBottom: `1px solid ${th.border}` }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: th.text }}>{t.tankerId}</td>
                    <td style={{ padding: '8px 10px' }}><span style={badge(t.type === 'large' ? th.purple : t.type === 'medium' ? th.cyan : th.dim, `${t.type === 'large' ? th.purple : t.type === 'medium' ? th.cyan : th.dim}20`)}>{t.type}</span></td>
                    <td style={{ padding: '8px 10px', color: th.text }}>{t.capacity.toLocaleString()} L</td>
                    <td style={{ padding: '8px 10px', color: th.muted, fontSize: '0.72rem' }}>{t.currentLocation.lat.toFixed(2)}, {t.currentLocation.lng.toFixed(2)}</td>
                    <td style={{ padding: '8px 10px' }}><span style={badge(t.status === 'available' ? th.green : th.dim, `${t.status === 'available' ? th.green : th.dim}20`)}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text }}>Area Requests</h3>
            <span style={badge(th.amber, `${th.amber}20`)}>{areas.length} areas</span>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: 380 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead><tr>{['Name', 'Priority', 'Demand', 'Population', 'Congestion'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: th.dim, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', borderBottom: `1px solid ${th.border}` }}>{h}</th>)}</tr></thead>
              <tbody>
                {areas.map(a => (
                  <tr key={a.areaId} style={{ borderBottom: `1px solid ${th.border}` }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: th.text }}>{a.name}</td>
                    <td style={{ padding: '8px 10px' }}><span style={badge(a.priority === 'critical' ? th.red : a.priority === 'high' ? th.amber : a.priority === 'medium' ? th.teal : th.green, `${a.priority === 'critical' ? th.red : a.priority === 'high' ? th.amber : a.priority === 'medium' ? th.teal : th.green}20`)}>{a.priority}</span></td>
                    <td style={{ padding: '8px 10px', color: th.text }}>{a.demand.toLocaleString()} L</td>
                    <td style={{ padding: '8px 10px', color: th.muted }}>{a.population.toLocaleString()}</td>
                    <td style={{ padding: '8px 10px' }}><span style={badge(a.congestionLevel === 'severe' ? th.red : a.congestionLevel === 'high' ? th.amber : th.green, `${a.congestionLevel === 'severe' ? th.red : a.congestionLevel === 'high' ? th.amber : th.green}20`)}>{a.congestionLevel}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text }}>Run Greedy Algorithm</h3>
          <button onClick={runGreedy} disabled={loading} style={{
            padding: '10px 20px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${th.green}, ${th.teal})`,
            color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', opacity: loading ? 0.6 : 1
          }}>{loading ? 'Assigning...' : 'Auto-Assign Tankers'}</button>
        </div>
        <p style={{ fontSize: '0.82rem', color: th.muted, marginBottom: 16 }}>The greedy algorithm assigns tankers to areas based on priority, proximity, and capacity fit.</p>

        {result && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
              {[{ l: 'Assigned', v: result.statistics?.totalAssigned, c: th.green }, { l: 'Unassigned', v: result.statistics?.totalUnassigned, c: th.red }, { l: 'Avg Efficiency', v: `${result.statistics?.averageEfficiency}%`, c: th.cyan }, { l: 'Total Distance', v: `${result.statistics?.totalDistance} km`, c: th.purple }].map(s => (
                <div key={s.l} style={{ padding: 12, borderRadius: 10, background: `${s.c}10`, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: th.muted }}>{s.l}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.c, fontFamily: 'JetBrains Mono, monospace' }}>{s.v}</div>
                </div>
              ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead><tr>{['Tanker', 'Assigned Area', 'Distance', 'Est. Time', 'Efficiency', 'Score'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: th.dim, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', borderBottom: `1px solid ${th.border}` }}>{h}</th>)}</tr></thead>
                <tbody>
                  {result.assignments?.map((a, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${th.border}` }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: th.text }}>{a.tanker?.tankerId}</td>
                      <td style={{ padding: '8px 10px', color: th.text }}>{a.area?.name}</td>
                      <td style={{ padding: '8px 10px', color: th.text }}>{a.distance?.toFixed(2)} km</td>
                      <td style={{ padding: '8px 10px', color: th.text }}>{a.estimatedTime} min</td>
                      <td style={{ padding: '8px 10px', color: th.text }}>{a.efficiency}%</td>
                      <td style={{ padding: '8px 10px', color: th.text }}>{a.score?.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: `${th.cyan}08`, border: `1px solid ${th.cyan}15` }}>
              <p style={{ fontSize: '0.72rem', color: th.muted }}><strong>Algorithm Complexity:</strong> {result.complexity?.time}</p>
              <p style={{ fontSize: '0.72rem', color: th.muted }}><strong>Execution Time:</strong> {result.executionTime?.toFixed(2)} ms</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResourceAssignment;
