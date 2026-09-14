import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const API_BASE = '/api';

function TransferOptimizer() {
  const { colors, themeName } = useTheme();
  const t = colors;
  const th = themeName === 'dark'
    ? { bg:'#031220',card:'#0d2536',border:'rgba(34,211,238,0.12)',text:'#e6f2f8',muted:'#94a3b8',dim:'#64748b',cyan:'#22d3ee',teal:'#06b6d4',green:'#10b981',red:'#ef4444',amber:'#f59e0b',purple:'#a78bfa',inputBg:'#031220' }
    : { bg:'#f0f4f8',card:'#ffffff',border:'rgba(15,23,41,0.08)',text:'#0f1729',muted:'#64748b',dim:'#94a3b8',cyan:'#0891b2',teal:'#0e7490',green:'#059669',red:'#dc2626',amber:'#d97706',purple:'#7c3aed',inputBg:'#ffffff' };

  const [nodes, setNodes] = useState([]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [bfsResult, setBfsResult] = useState(null);
  const [astarResult, setAstarResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/algorithms/road-network`)
      .then(r => r.json())
      .then(data => { setNodes(data.nodes || []); if (data.nodes && data.nodes.length > 1) { setSource(data.nodes[0].id); setDestination(data.nodes[data.nodes.length-1].id); } })
      .catch(() => {});
  }, []);

  const runBFS = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/algorithms/bfs-transfer`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({source, destination}) });
      const data = await res.json();
      setBfsResult(data);
    } catch(e) { setError('BFS failed: ' + e.message); }
    setLoading(false);
  };

  const runAStar = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/algorithms/astar-transfer`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({source, destination}) });
      const data = await res.json();
      setAstarResult(data);
    } catch(e) { setError('A* failed: ' + e.message); }
    setLoading(false);
  };

  const inputStyle = { padding:'10px 14px', borderRadius:10, border:`1px solid ${th.border}`, background:th.inputBg, color:th.text, fontSize:'0.85rem', width:'100%' };
  const btnStyle = (color) => ({ padding:'10px 20px', borderRadius:10, border:'none', background:color, color:'#fff', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', transition:'all 0.2s' });

  const renderResult = (result, label, color) => {
    if (!result) return null;
    return (
      <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:24, flex:1 }}>
        <h3 style={{ fontSize:'1rem', fontWeight:700, color, marginBottom:16 }}>{label}</h3>
        {result.success === false ? (
          <p style={{ color:th.red }}>{result.message || 'No path found'}</p>
        ) : (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              {[{l:'Distance',v:`${result.totalKm?.toFixed(1)} km`},{l:'Time',v:`${result.totalTime} min`},{l:'Hops',v:result.hops || result.path?.length-1},{l:'Exec Time',v:`${result.executionTime?.toFixed(3)} ms`}].map(s => (
                <div key={s.l} style={{ padding:12, borderRadius:10, background:`${color}10`, border:`1px solid ${color}20` }}>
                  <div style={{ fontSize:'0.7rem', color:th.muted }}>{s.l}</div>
                  <div style={{ fontSize:'1.2rem', fontWeight:800, color, fontFamily:'JetBrains Mono, monospace' }}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:'0.75rem', fontWeight:600, color:th.muted, marginBottom:6 }}>PATH</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:4, alignItems:'center' }}>
                {(result.path || []).map((node, i) => (
                  <React.Fragment key={i}>
                    <span style={{ padding:'4px 8px', borderRadius:6, background:`${color}20`, color, fontSize:'0.75rem', fontWeight:600 }}>{node}</span>
                    {i < result.path.length - 1 && <span style={{ color:th.muted, fontSize:'0.8rem' }}>{'>'}</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div style={{ fontSize:'0.75rem', color:th.muted }}>
              Complexity: {result.complexity?.time} | Space: {result.complexity?.space}
            </div>
            <div style={{ marginTop:8, fontSize:'0.7rem', color:th.dim }}>
              Nodes: {result.complexity?.vertices} | Edges: {result.complexity?.edges}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800, color:th.text }}>Transfer Optimizer</h1>
        <p style={{ color:th.muted, fontSize:'0.85rem', marginTop:4 }}>Component E: Connected/Transfer Entity Optimization — BFS vs A*</p>
      </div>

      <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:24, marginBottom:20 }}>
        <h3 style={{ fontSize:'1rem', fontWeight:700, color:th.text, marginBottom:16 }}>Configure Transfer Route</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:16, alignItems:'end' }}>
          <div>
            <label style={{ fontSize:'0.75rem', fontWeight:600, color:th.muted, display:'block', marginBottom:6 }}>Source Node</label>
            <select value={source} onChange={e => setSource(e.target.value)} style={inputStyle}>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.id} ({n.type})</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:'0.75rem', fontWeight:600, color:th.muted, display:'block', marginBottom:6 }}>Destination Node</label>
            <select value={destination} onChange={e => setDestination(e.target.value)} style={inputStyle}>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.id} ({n.type})</option>)}
            </select>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={runBFS} disabled={loading || !source || !destination} style={btnStyle(th.cyan)}>Run BFS</button>
            <button onClick={runAStar} disabled={loading || !source || !destination} style={btnStyle(th.purple)}>Run A*</button>
          </div>
        </div>
        {loading && <div style={{ marginTop:12, color:th.muted, fontSize:'0.85rem' }}>Running algorithms...</div>}
        {error && <div style={{ marginTop:12, color:th.red, fontSize:'0.85rem' }}>{error}</div>}
      </div>

      {(bfsResult || astarResult) && (
        <div style={{ display:'flex', gap:20, marginBottom:20 }}>
          {renderResult(bfsResult, 'BFS (Approach 1) — Unweighted Shortest Path', th.cyan)}
          {renderResult(astarResult, 'A* (Approach 2) — Heuristic-Based Pathfinding', th.purple)}
        </div>
      )}

      {bfsResult && astarResult && bfsResult.success && astarResult.success && (
        <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:24 }}>
          <h3 style={{ fontSize:'1rem', fontWeight:700, color:th.text, marginBottom:16 }}>Algorithm Comparison</h3>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Algorithm','Path','Distance','Time','Hops','Exec Time'].map(h => (
                  <th key={h} style={{ padding:'10px 12px', textAlign:'left', borderBottom:`2px solid ${th.border}`, color:th.muted, fontSize:'0.75rem', fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[{ label:'BFS', result:bfsResult, color:th.cyan },{ label:'A*', result:astarResult, color:th.purple }].map(row => (
                <tr key={row.label}>
                  <td style={{ padding:'10px 12px', borderBottom:`1px solid ${th.border}`, fontWeight:600, color:row.color }}>{row.label}</td>
                  <td style={{ padding:'10px 12px', borderBottom:`1px solid ${th.border}`, color:th.text, fontSize:'0.75rem' }}>{row.result.path?.join(' > ')}</td>
                  <td style={{ padding:'10px 12px', borderBottom:`1px solid ${th.border}`, color:th.text, fontFamily:'JetBrains Mono, monospace' }}>{row.result.totalKm?.toFixed(1)} km</td>
                  <td style={{ padding:'10px 12px', borderBottom:`1px solid ${th.border}`, color:th.text, fontFamily:'JetBrains Mono, monospace' }}>{row.result.totalTime} min</td>
                  <td style={{ padding:'10px 12px', borderBottom:`1px solid ${th.border}`, color:th.text }}>{row.result.hops}</td>
                  <td style={{ padding:'10px 12px', borderBottom:`1px solid ${th.border}`, color:th.text, fontFamily:'JetBrains Mono, monospace' }}>{row.result.executionTime?.toFixed(3)} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TransferOptimizer;
