import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const API_BASE = '/api';

function Scheduler() {
  const { colors, themeName } = useTheme();
  const t = colors;
  const th = themeName === 'dark'
    ? { bg: '#031220', card: '#0d2536', border: 'rgba(34,211,238,0.12)', text: '#e6f2f8', muted: '#94a3b8', dim: '#64748b', cyan: '#22d3ee', teal: '#06b6d4', green: '#10b981', red: '#ef4444', amber: '#f59e0b', purple: '#a78bfa', inputBg: '#031220' }
    : { bg: '#f0f4f8', card: '#ffffff', border: 'rgba(15,23,41,0.08)', text: '#0f1729', muted: '#64748b', dim: '#94a3b8', cyan: '#0891b2', teal: '#0e7490', green: '#059669', red: '#dc2626', amber: '#d97706', purple: '#7c3aed', inputBg: '#ffffff' };

  const [tankers, setTankers] = useState([]);
  const [areas, setAreas] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [tankersRes, areasRes] = await Promise.all([fetch(`${API_BASE}/tankers`), fetch(`${API_BASE}/areas`)]);
      const [tankersData, areasData] = await Promise.all([tankersRes.json(), areasRes.json()]);
      setTankers(tankersData);
      setAreas(areasData);
      const sampleDeliveries = [];
      for (let i = 0; i < 15; i++) {
        const area = areasData[Math.floor(Math.random() * areasData.length)];
        sampleDeliveries.push({
          deliveryId: `DEL-${String(i + 1).padStart(3, '0')}`, scheduledHour: 6 + Math.floor(Math.random() * 12),
          loadAmount: 2000 + Math.floor(Math.random() * 8000),
          priority: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)], areaName: area.name
        });
      }
      setDeliveries(sampleDeliveries);
    } catch (err) { console.error('Error fetching data:', err); }
  };

  const runDP = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/algorithms/dp-schedule`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveries, tankerCount: Math.min(tankers.length, 10), timeSlots: 14 })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) { console.error('Error running DP:', err); }
    setLoading(false);
  };

  const hours = Array.from({ length: 14 }, (_, i) => 6 + i);
  const badge = (color) => ({ padding: '3px 10px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 700 });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: th.text }}>Delivery Scheduler</h1>
        <p style={{ color: th.muted, fontSize: '0.85rem', marginTop: 4 }}>Dynamic Programming for Optimal Scheduling</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text }}>Scheduled Deliveries</h3>
            <button onClick={runDP} disabled={loading} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${th.teal}, ${th.cyan})`, color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Optimizing...' : 'Run DP Optimizer'}
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead><tr>{['ID', 'Area', 'Priority', 'Load', 'Hour', 'Status'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: th.dim, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', borderBottom: `1px solid ${th.border}` }}>{h}</th>)}</tr></thead>
              <tbody>
                {deliveries.map(d => (
                  <tr key={d.deliveryId} style={{ borderBottom: `1px solid ${th.border}` }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: th.text }}>{d.deliveryId}</td>
                    <td style={{ padding: '8px 10px', color: th.text }}>{d.areaName}</td>
                    <td style={{ padding: '8px 10px' }}><span style={{ ...badge(d.priority === 'critical' ? th.red : d.priority === 'high' ? th.amber : d.priority === 'medium' ? th.teal : th.green), background: `${d.priority === 'critical' ? th.red : d.priority === 'high' ? th.amber : d.priority === 'medium' ? th.teal : th.green}20`, color: d.priority === 'critical' ? th.red : d.priority === 'high' ? th.amber : d.priority === 'medium' ? th.teal : th.green }}>{d.priority}</span></td>
                    <td style={{ padding: '8px 10px', color: th.text }}>{d.loadAmount.toLocaleString()} L</td>
                    <td style={{ padding: '8px 10px', color: th.text }}>{d.scheduledHour}:00</td>
                    <td style={{ padding: '8px 10px' }}><span style={{ ...badge(th.cyan), background: `${th.cyan}20`, color: th.cyan }}>pending</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 16 }}>Schedule Parameters</h3>
          {[{ l: 'Available Tankers', v: tankers.length, c: th.cyan }, { l: 'Total Deliveries', v: deliveries.length, c: th.green }, { l: 'Time Window', v: '06:00 - 20:00', c: th.muted }, { l: 'Slot Duration', v: '1 hour', c: th.muted }].map(p => (
            <div key={p.l} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.78rem', color: th.muted, marginBottom: 4 }}>{p.l}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: p.c, fontFamily: 'JetBrains Mono, monospace' }}>{p.v}</div>
            </div>
          ))}
          {result && (
            <div style={{ padding: 12, borderRadius: 8, background: `${th.cyan}08`, border: `1px solid ${th.cyan}15` }}>
              <p style={{ fontSize: '0.72rem', color: th.muted }}><strong>Algorithm Complexity:</strong> {result.complexity?.time}</p>
              <p style={{ fontSize: '0.72rem', color: th.muted }}><strong>Execution Time:</strong> {result.executionTime?.toFixed(2)} ms</p>
            </div>
          )}
        </div>
      </div>

      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            {[{ l: 'Scheduled', v: result.statistics?.totalScheduled, c: th.green }, { l: 'Unscheduled', v: result.statistics?.unscheduled, c: th.red }, { l: 'Total Delay', v: `${result.statistics?.totalDelaySlots} hrs`, c: th.amber }, { l: 'Avg Delay Cost', v: `$${result.statistics?.totalDelayCost}`, c: th.purple }].map(s => (
              <div key={s.l} style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: th.muted }}>{s.l}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.c, fontFamily: 'JetBrains Mono, monospace' }}>{s.v}</div>
              </div>
            ))}
          </div>

          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 16 }}>Optimized Schedule Timeline</h3>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: 800 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(14, 1fr)', gap: 2 }}>
                  <div style={{ padding: 6, fontSize: '0.72rem', fontWeight: 600, color: th.muted }}>Tanker</div>
                  {hours.map(h => <div key={h} style={{ padding: 6, fontSize: '0.72rem', fontWeight: 600, color: th.muted, textAlign: 'center' }}>{h}:00</div>)}
                  {Array.from({ length: Math.min(10, result.schedule?.length || 0) }, (_, tIdx) => (
                    <React.Fragment key={tIdx}>
                      <div style={{ padding: 6, fontSize: '0.72rem', fontWeight: 600, color: th.text }}>TK-{String(tIdx + 1).padStart(3, '0')}</div>
                      {hours.map(h => {
                        const a = result.schedule?.find(s => s.tanker === tIdx + 1 && s.startTime <= h && s.endTime > h);
                        return <div key={h} style={{ padding: 4, borderRadius: 4, fontSize: '0.65rem', textAlign: 'center', background: a ? (a.delay === 0 ? `${th.green}30` : `${th.amber}30`) : `${th.dim}10`, color: a ? (a.delay === 0 ? th.green : th.amber) : 'transparent' }}>{a ? a.deliveryId.substring(4) : ''}</div>;
                      })}
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: '0.72rem', color: th.muted }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: `${th.green}30` }} />On Time</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: `${th.amber}30` }} />Delayed</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: `${th.dim}10` }} />Available</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 16 }}>Optimized Assignments</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead><tr>{['Delivery', 'Tanker', 'Slot', 'Delay', 'Cost', 'Status'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: th.dim, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', borderBottom: `1px solid ${th.border}` }}>{h}</th>)}</tr></thead>
                <tbody>
                  {result.schedule?.map((a, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${th.border}` }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: th.text }}>{a.deliveryId}</td>
                      <td style={{ padding: '8px 10px', color: th.text }}>TK-{String(a.tanker).padStart(3, '0')}</td>
                      <td style={{ padding: '8px 10px', color: th.text }}>{a.timeLabel}</td>
                      <td style={{ padding: '8px 10px', color: th.text }}>{a.delay} hrs</td>
                      <td style={{ padding: '8px 10px', color: th.text }}>${a.delayCost}</td>
                      <td style={{ padding: '8px 10px' }}><span style={{ ...badge(a.delay === 0 ? th.green : th.amber), background: `${a.delay === 0 ? th.green : th.amber}20`, color: a.delay === 0 ? th.green : th.amber }}>{a.delay === 0 ? 'On Time' : 'Delayed'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Scheduler;
