import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const API_BASE = '/api';

function SlotAllocator() {
  const { colors, themeName } = useTheme();
  const t = colors;
  const th = themeName === 'dark'
    ? { bg: '#031220', card: '#0d2536', border: 'rgba(34,211,238,0.12)', text: '#e6f2f8', muted: '#94a3b8', dim: '#64748b', cyan: '#22d3ee', teal: '#06b6d4', green: '#10b981', red: '#ef4444', amber: '#f59e0b', purple: '#a78bfa' }
    : { bg: '#f0f4f8', card: '#ffffff', border: 'rgba(15,23,41,0.08)', text: '#0f1729', muted: '#64748b', dim: '#94a3b8', cyan: '#0891b2', teal: '#0e7490', green: '#059669', red: '#dc2626', amber: '#d97706', purple: '#7c3aed' };

  const [sources, setSources] = useState([]);
  const [tankers, setTankers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [sourcesRes, tankersRes] = await Promise.all([fetch(`${API_BASE}/sources`), fetch(`${API_BASE}/tankers`)]);
      const [sourcesData, tankersData] = await Promise.all([sourcesRes.json(), tankersRes.json()]);
      setSources(sourcesData);
      setTankers(tankersData);
    } catch (err) { console.error('Error fetching data:', err); }
  };

  const runBacktracking = async () => {
    setLoading(true);
    try {
      const sampleRequests = tankers.slice(0, 8).map((tanker, idx) => ({
        tankerId: tanker.tankerId, preferredSource: sources[idx % sources.length].sourceId,
        requestedHour: 8 + Math.floor(Math.random() * 8),
        priority: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)], loadingDuration: 1
      }));
      const response = await fetch(`${API_BASE}/algorithms/backtrack`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources, tankers: sampleRequests, timeSlots: 14, options: { maxIterations: 5000 } })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) { console.error('Error running backtracking:', err); }
    setLoading(false);
  };

  const hours = Array.from({ length: 14 }, (_, i) => 6 + i);
  const badge = (color) => ({ padding: '3px 10px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 700, background: `${color}20`, color });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: th.text }}>Slot Allocator</h1>
        <p style={{ color: th.muted, fontSize: '0.85rem', marginTop: 4 }}>Backtracking for Contention Resolution</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text }}>Hydrant Slot Allocation</h3>
            <button onClick={runBacktracking} disabled={loading} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${th.green}, ${th.teal})`, color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Resolving...' : 'Resolve Conflicts'}
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 700 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '140px repeat(14, 1fr)', gap: 2 }}>
                <div style={{ padding: 6, fontSize: '0.72rem', fontWeight: 600, color: th.muted }}>Source</div>
                {hours.map(h => <div key={h} style={{ padding: 6, fontSize: '0.72rem', fontWeight: 600, color: th.muted, textAlign: 'center' }}>{h}:00</div>)}
                {sources.slice(0, 5).map(source => (
                  <React.Fragment key={source.sourceId}>
                    <div style={{ padding: 6, fontSize: '0.72rem', fontWeight: 600, color: th.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{source.name.split(' ').slice(0, 2).join(' ')}</div>
                    {hours.map(h => {
                      const isOccupied = result?.slotMap?.[source.sourceId]?.[h] && !result.slotMap[source.sourceId][h].available;
                      return <div key={h} style={{ padding: 4, borderRadius: 4, fontSize: '0.65rem', textAlign: 'center', background: isOccupied ? `${th.red}30` : `${th.green}15`, color: isOccupied ? th.red : th.green }}>{isOccupied ? 'X' : 'O'}</div>;
                    })}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: '0.72rem', color: th.muted }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: `${th.green}15` }} />Available</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: `${th.red}30` }} />Occupied</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 12 }}>Water Sources</h3>
          <div style={{ maxHeight: 260, overflow: 'auto' }}>
            {sources.map(source => (
              <div key={source.sourceId} style={{ padding: 12, borderRadius: 8, background: `${th.cyan}08`, border: `1px solid ${th.cyan}15`, marginBottom: 8 }}>
                <p style={{ fontWeight: 600, fontSize: '0.82rem', color: th.text }}>{source.name}</p>
                <p style={{ fontSize: '0.72rem', color: th.muted }}>Type: {source.type}</p>
                <p style={{ fontSize: '0.72rem', color: th.muted }}>Capacity: {source.capacity.toLocaleString()} L</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            {[{ l: 'Assigned', v: result.statistics?.totalAssigned, c: th.green }, { l: 'Conflicts', v: result.statistics?.totalConflicts, c: th.red }, { l: 'On Time', v: result.statistics?.scheduledOnTime, c: th.cyan }, { l: 'With Delay', v: result.statistics?.scheduledWithDelay, c: th.amber }].map(s => (
              <div key={s.l} style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: th.muted }}>{s.l}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.c, fontFamily: 'JetBrains Mono, monospace' }}>{s.v}</div>
              </div>
            ))}
          </div>

          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 16 }}>Slot Allocations</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead><tr>{['Tanker', 'Source', 'Hour', 'Duration', 'Priority', 'Delay', 'Status'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: th.dim, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', borderBottom: `1px solid ${th.border}` }}>{h}</th>)}</tr></thead>
                <tbody>
                  {result.assignments?.map((a, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${th.border}` }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: th.text }}>{a.tankerId}</td>
                      <td style={{ padding: '8px 10px', color: th.muted, fontSize: '0.72rem' }}>{a.sourceId}</td>
                      <td style={{ padding: '8px 10px', color: th.text }}>{a.hour}:00</td>
                      <td style={{ padding: '8px 10px', color: th.text }}>{a.duration} hr</td>
                      <td style={{ padding: '8px 10px' }}><span style={badge(a.priority === 'critical' ? th.red : a.priority === 'high' ? th.amber : a.priority === 'medium' ? th.teal : th.green)}>{a.priority}</span></td>
                      <td style={{ padding: '8px 10px', color: th.text }}>{a.delay} hrs</td>
                      <td style={{ padding: '8px 10px' }}><span style={badge(a.delay === 0 ? th.green : th.amber)}>{a.delay === 0 ? 'On Time' : `Delayed ${a.delay}h`}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {result.conflicts?.length > 0 && (
            <div style={{ background: th.card, border: `1px solid ${th.red}30`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.red, marginBottom: 12 }}>Unresolved Conflicts</h3>
              {result.conflicts.map((c, idx) => (
                <div key={idx} style={{ padding: 10, borderRadius: 8, background: `${th.red}10`, border: `1px solid ${th.red}20`, marginBottom: 8 }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, color: th.red }}>{c.tankerId}</p>
                  <p style={{ fontSize: '0.72rem', color: th.red }}>{c.reason}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 12 }}>Algorithm Performance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[{ l: 'Iterations', v: result.statistics?.iterations }, { l: 'Solutions Found', v: result.statistics?.solutionsFound }, { l: 'Avg Delay', v: `${result.statistics?.averageDelay} hrs` }, { l: 'Complexity', v: result.complexity?.time }].map(p => (
                <div key={p.l} style={{ padding: 12, borderRadius: 8, background: `${th.cyan}08`, border: `1px solid ${th.cyan}15` }}>
                  <div style={{ fontSize: '0.72rem', color: th.muted }}>{p.l}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: th.text }}>{p.v}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SlotAllocator;
