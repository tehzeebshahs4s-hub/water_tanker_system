import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const API_BASE = '/api';

function FlowOptimizer() {
  const { colors, themeName } = useTheme();
  const t = colors;
  const th = themeName === 'dark'
    ? { bg: '#031220', card: '#0d2536', border: 'rgba(34,211,238,0.12)', text: '#e6f2f8', muted: '#94a3b8', dim: '#64748b', cyan: '#22d3ee', teal: '#06b6d4', green: '#10b981', red: '#ef4444', amber: '#f59e0b', purple: '#a78bfa' }
    : { bg: '#f0f4f8', card: '#ffffff', border: 'rgba(15,23,41,0.08)', text: '#0f1729', muted: '#64748b', dim: '#94a3b8', cyan: '#0891b2', teal: '#0e7490', green: '#059669', red: '#dc2626', amber: '#d97706', purple: '#7c3aed' };

  const [sources, setSources] = useState([]);
  const [areas, setAreas] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [sourcesRes, areasRes] = await Promise.all([fetch(`${API_BASE}/sources`), fetch(`${API_BASE}/areas`)]);
      const [sourcesData, areasData] = await Promise.all([sourcesRes.json(), areasRes.json()]);
      setSources(sourcesData);
      setAreas(areasData);
    } catch (err) { console.error('Error fetching data:', err); }
  };

  const buildFlowNetwork = () => {
    const edges = [];
    const superSource = 'SUPER_SOURCE';
    const superSink = 'SUPER_SINK';
    sources.forEach(source => { edges.push({ from: superSource, to: source.sourceId, capacity: source.currentOutput / 1000, weight: 0 }); });
    sources.forEach(source => {
      areas.forEach(area => {
        if (area.nearestHydrants && area.nearestHydrants.length > 0) {
          const hydrant = area.nearestHydrants[0];
          const capacity = Math.min(source.currentOutput, area.demand) / 5000;
          if (capacity > 0) edges.push({ from: source.sourceId, to: hydrant, capacity: Math.floor(capacity) + 1, weight: 1 });
        }
      });
    });
    const hydrants = ['HYD-001', 'HYD-002', 'HYD-003', 'HYD-004', 'HYD-005', 'HYD-006', 'HYD-007', 'HYD-008', 'HYD-009', 'HYD-010'];
    hydrants.forEach(hydrant => {
      const connectedAreas = areas.filter(a => a.nearestHydrants?.includes(hydrant));
      connectedAreas.forEach(area => { edges.push({ from: hydrant, to: area.areaId, capacity: Math.floor(area.demand / 10000) + 1, weight: 1 }); });
    });
    areas.forEach(area => { edges.push({ from: area.areaId, to: superSink, capacity: Math.floor(area.demand / 5000) + 1, weight: 0 }); });
    return { edges };
  };

  const runFordFulkerson = async () => {
    setLoading(true);
    try {
      const graph = buildFlowNetwork();
      const response = await fetch(`${API_BASE}/algorithms/maxflow`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ graph, source: 'SUPER_SOURCE', sink: 'SUPER_SINK' })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) { console.error('Error running Ford-Fulkerson:', err); }
    setLoading(false);
  };

  const totalCapacity = sources.reduce((sum, s) => sum + s.currentOutput, 0);
  const totalDemand = areas.reduce((sum, a) => sum + a.demand, 0);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: th.text }}>Flow Optimizer</h1>
        <p style={{ color: th.muted, fontSize: '0.85rem', marginTop: 4 }}>Ford-Fulkerson for Maximum Flow Distribution</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text }}>Network Flow Diagram</h3>
            <button onClick={runFordFulkerson} disabled={loading} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${th.green}, ${th.teal})`, color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Calculating...' : 'Calculate Max Flow'}
            </button>
          </div>

          <div style={{ padding: 24, borderRadius: 12, background: `linear-gradient(135deg, ${th.cyan}10, ${th.teal}10)`, border: `1px solid ${th.cyan}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: th.cyan, display: 'grid', placeItems: 'center', fontSize: '1.5rem', margin: '0 auto 8px' }}>💧</div>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: th.text }}>Sources</p>
                <p style={{ fontSize: '0.72rem', color: th.muted }}>{sources.length}</p>
              </div>
              <div style={{ flex: 1, margin: '0 16px' }}>
                <div style={{ height: 4, background: `linear-gradient(90deg, ${th.cyan}, ${th.purple}, ${th.green})`, borderRadius: 2 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.72rem', color: th.muted }}>
                  <span>Sources</span><span>Hydrants</span><span>Areas</span>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: th.green, display: 'grid', placeItems: 'center', fontSize: '1.5rem', margin: '0 auto 8px' }}>🏘️</div>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: th.text }}>Areas</p>
                <p style={{ fontSize: '0.72rem', color: th.muted }}>{areas.length}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                {sources.slice(0, 4).map(source => (
                  <div key={source.sourceId} style={{ padding: 8, borderRadius: 6, background: th.card, border: `1px solid ${th.border}`, marginBottom: 6, fontSize: '0.72rem' }}>
                    <p style={{ fontWeight: 600, color: th.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{source.name.split(' ').slice(0, 2).join(' ')}</p>
                    <p style={{ color: th.muted }}>{(source.currentOutput / 1000).toFixed(0)}k L/day</p>
                  </div>
                ))}
              </div>
              <div>
                {['HYD-001', 'HYD-002', 'HYD-003', 'HYD-004'].map(h => (
                  <div key={h} style={{ padding: 8, borderRadius: 6, background: `${th.purple}20`, border: `1px solid ${th.purple}30`, marginBottom: 6, fontSize: '0.72rem', textAlign: 'center' }}>
                    <p style={{ fontWeight: 600, color: th.purple }}>{h}</p>
                  </div>
                ))}
              </div>
              <div>
                {areas.slice(0, 4).map(area => (
                  <div key={area.areaId} style={{ padding: 8, borderRadius: 6, background: th.card, border: `1px solid ${th.border}`, marginBottom: 6, fontSize: '0.72rem' }}>
                    <p style={{ fontWeight: 600, color: th.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{area.name}</p>
                    <p style={{ color: th.muted }}>{(area.demand / 1000).toFixed(0)}k L/day</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 16 }}>Network Statistics</h3>
          {[{ l: 'Total Sources', v: sources.length, c: th.cyan }, { l: 'Total Areas', v: areas.length, c: th.green }, { l: 'Total Capacity', v: `${totalCapacity.toLocaleString()} L/day`, c: th.teal }, { l: 'Total Demand', v: `${totalDemand.toLocaleString()} L/day`, c: th.amber }].map(p => (
            <div key={p.l} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.78rem', color: th.muted, marginBottom: 4 }}>{p.l}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: p.c, fontFamily: 'JetBrains Mono, monospace' }}>{p.v}</div>
            </div>
          ))}
          {result && (
            <div style={{ padding: 12, borderRadius: 8, background: `${th.cyan}08`, border: `1px solid ${th.cyan}15` }}>
              <p style={{ fontSize: '0.72rem', color: th.muted }}><strong>Complexity:</strong> {result.complexity?.time}</p>
              <p style={{ fontSize: '0.72rem', color: th.muted }}><strong>Execution Time:</strong> {result.executionTime?.toFixed(2)} ms</p>
            </div>
          )}
        </div>
      </div>

      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            {[{ l: 'Max Flow', v: result.maxFlow, c: th.cyan, sub: 'units/day' }, { l: 'Iterations', v: result.statistics?.iterations, c: th.green, sub: 'BFS runs' }, { l: 'Edges with Flow', v: result.statistics?.edgesWithFlow, c: th.purple, sub: 'active paths' }, { l: 'Avg Utilization', v: `${result.statistics?.avgUtilization}%`, c: th.amber, sub: 'network load' }].map(s => (
              <div key={s.l} style={{ background: `linear-gradient(135deg, ${s.c}20, ${s.c}10)`, border: `1px solid ${s.c}30`, borderRadius: 16, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: s.c }}>{s.l}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.c, fontFamily: 'JetBrains Mono, monospace', marginTop: 4 }}>{s.v}</div>
                <div style={{ fontSize: '0.68rem', color: th.muted, marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 16 }}>Flow Distribution</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead><tr>{['From', 'To', 'Flow', 'Capacity', 'Utilization'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: th.dim, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', borderBottom: `1px solid ${th.border}` }}>{h}</th>)}</tr></thead>
                <tbody>
                  {result.flowDistribution?.slice(0, 20).map((f, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${th.border}` }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: th.text, fontSize: '0.72rem' }}>{f.from}</td>
                      <td style={{ padding: '8px 10px', color: th.muted, fontSize: '0.72rem' }}>{f.to}</td>
                      <td style={{ padding: '8px 10px', color: th.text }}>{f.flow}</td>
                      <td style={{ padding: '8px 10px', color: th.text }}>{f.capacity}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 80, height: 6, borderRadius: 3, background: `${th.dim}20`, overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(parseFloat(f.utilization), 100)}%`, height: '100%', background: parseFloat(f.utilization) > 80 ? th.red : parseFloat(f.utilization) > 50 ? th.amber : th.green, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: '0.72rem', color: th.muted }}>{f.utilization}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {result.steps && (
            <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 12 }}>Augmenting Paths Found</h3>
              <div style={{ maxHeight: 250, overflow: 'auto' }}>
                {result.steps.map((step, idx) => (
                  <div key={idx} style={{ padding: 12, borderRadius: 8, background: `${th.cyan}08`, border: `1px solid ${th.cyan}15`, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: th.text }}>Iteration {step.iteration}</span>
                      <span style={{ fontSize: '0.72rem', color: th.muted }}>Bottleneck: {step.bottleneck} | Total: {step.totalFlow}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {step.path.map((p, pIdx) => (
                        <span key={pIdx} style={{ padding: '3px 8px', background: `${th.cyan}20`, color: th.cyan, borderRadius: 6, fontSize: '0.68rem', fontWeight: 600 }}>{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FlowOptimizer;
