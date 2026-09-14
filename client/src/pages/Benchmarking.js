import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE = '/api';

const ALGO_COMPONENTS = {
  'dijkstra': 'Route Optimization', 'bfs': 'Route Optimization',
  'greedy': 'Resource Assignment', 'priority': 'Resource Assignment',
  'dp': 'Scheduling', 'greedy-schedule': 'Scheduling',
  'backtrack': 'Slot Allocation', 'fcfs': 'Slot Allocation',
  'ford-fulkerson': 'Flow Optimization', 'capacity-scaling': 'Flow Optimization',
  'bfs-transfer': 'Transfer Optimization', 'astar-transfer': 'Transfer Optimization'
};

const COMP_COLORS = {
  'Route Optimization': '#22d3ee', 'Resource Assignment': '#10b981',
  'Scheduling': '#a78bfa', 'Slot Allocation': '#f59e0b',
  'Flow Optimization': '#ef4444', 'Transfer Optimization': '#06b6d4'
};

function Benchmarking() {
  const { colors, themeName } = useTheme();
  const t = colors;
  const th = themeName === 'dark'
    ? { bg:'#031220',card:'#0d2536',border:'rgba(34,211,238,0.12)',text:'#e6f2f8',muted:'#94a3b8',dim:'#64748b',cyan:'#22d3ee',green:'#10b981',red:'#ef4444',amber:'#f59e0b',purple:'#a78bfa',inputBg:'#031220' }
    : { bg:'#f0f4f8',card:'#ffffff',border:'rgba(15,23,41,0.08)',text:'#0f1729',muted:'#64748b',dim:'#94a3b8',cyan:'#0891b2',green:'#059669',red:'#dc2626',amber:'#d97706',purple:'#7c3aed',inputBg:'#ffffff' };

  const [datasetSize, setDatasetSize] = useState(20);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState('dijkstra');
  const [singleResult, setSingleResult] = useState(null);
  const [singleLoading, setSingleLoading] = useState(false);

  const runBenchmark = async () => {
    setLoading(true); setResults(null);
    try {
      const res = await fetch(`${API_BASE}/algorithms/benchmark/all`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({size:datasetSize}) });
      const data = await res.json();
      setResults(data);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const runSingle = async () => {
    setSingleLoading(true); setSingleResult(null);
    try {
      const res = await fetch(`${API_BASE}/algorithms/benchmark`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({algorithm:selectedAlgo, size:datasetSize}) });
      const data = await res.json();
      setSingleResult(data);
    } catch(e) { console.error(e); }
    setSingleLoading(false);
  };

  const inputStyle = { padding:'10px 14px', borderRadius:10, border:`1px solid ${th.border}`, background:th.inputBg, color:th.text, fontSize:'0.85rem' };
  const btnStyle = (color) => ({ padding:'10px 24px', borderRadius:10, border:'none', background:color, color:'#fff', fontWeight:700, fontSize:'0.85rem', cursor:'pointer' });

  const chartData = results ? {
    labels: results.results.map(r => r.algorithm),
    datasets: [{
      label: 'Avg Execution Time (ms)',
      data: results.results.map(r => parseFloat(r.avgTime)),
      backgroundColor: results.results.map(r => COMP_COLORS[ALGO_COMPONENTS[r.algorithm]] + 'CC'),
      borderWidth: 0, borderRadius: 6
    }]
  } : null;

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor:th.card, borderColor:th.border, borderWidth:1, titleColor:th.text, bodyColor:th.muted, padding:12, cornerRadius:8 } },
    scales: { x: { grid:{color:th.border}, ticks:{color:th.dim, font:{size:10}, maxRotation:45} }, y: { grid:{color:th.border}, ticks:{color:th.dim, font:{size:11}} } }
  };

  return (
    <div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800, color:th.text }}>Algorithm Benchmarking</h1>
        <p style={{ color:th.muted, fontSize:'0.85rem', marginTop:4 }}>Compare all 12 algorithms across different dataset sizes</p>
      </div>

      <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:24, marginBottom:20 }}>
        <h3 style={{ fontSize:'1rem', fontWeight:700, color:th.text, marginBottom:16 }}>Benchmark Configuration</h3>
        <div style={{ display:'flex', gap:16, alignItems:'end', flexWrap:'wrap' }}>
          <div>
            <label style={{ fontSize:'0.75rem', fontWeight:600, color:th.muted, display:'block', marginBottom:6 }}>Dataset Size</label>
            <select value={datasetSize} onChange={e => setDatasetSize(parseInt(e.target.value))} style={inputStyle}>
              <option value={20}>Small (20 entities)</option>
              <option value={100}>Medium (100 entities)</option>
              <option value={500}>Large (500 entities)</option>
              <option value={1000}>Very Large (1000 entities)</option>
            </select>
          </div>
          <button onClick={runBenchmark} disabled={loading} style={btnStyle(th.cyan)}>
            {loading ? 'Running...' : 'Run All Benchmarks'}
          </button>
        </div>
      </div>

      {results && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:20 }}>
            {[
              { l:'Algorithms Tested', v:results.results.length, c:th.cyan },
              { l:'Fastest', v:results.results.reduce((a,b) => parseFloat(a.avgTime)<parseFloat(b.avgTime)?a:b).algorithm, c:th.green },
              { l:'Slowest', v:results.results.reduce((a,b) => parseFloat(a.avgTime)>parseFloat(b.avgTime)?a:b).algorithm, c:th.red },
              { l:'Avg Time', v:(results.results.reduce((s,r)=>s+parseFloat(r.avgTime),0)/results.results.length).toFixed(3)+' ms', c:th.amber }
            ].map(s => (
              <div key={s.l} style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:20 }}>
                <div style={{ fontSize:'0.78rem', color:th.muted }}>{s.l}</div>
                <div style={{ fontSize:'1.1rem', fontWeight:800, color:s.c, fontFamily:'JetBrains Mono, monospace', marginTop:4, wordBreak:'break-all' }}>{s.v}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
            <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:24 }}>
              <h3 style={{ fontSize:'1rem', fontWeight:700, color:th.text, marginBottom:16 }}>Execution Time Comparison</h3>
              <div style={{ height:300 }}><Bar data={chartData} options={chartOpts} /></div>
            </div>
            <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:24, overflow:'auto', maxHeight:400 }}>
              <h3 style={{ fontSize:'1rem', fontWeight:700, color:th.text, marginBottom:16 }}>Detailed Results</h3>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>
                    {['Algorithm','Component','Avg (ms)','Min','Max'].map(h => (
                      <th key={h} style={{ padding:'8px', textAlign:'left', borderBottom:`2px solid ${th.border}`, color:th.muted, fontSize:'0.7rem', fontWeight:600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.results.map((r, i) => (
                    <tr key={i}>
                      <td style={{ padding:'8px', borderBottom:`1px solid ${th.border}`, fontSize:'0.78rem', fontWeight:600, color:COMP_COLORS[ALGO_COMPONENTS[r.algorithm]] }}>{r.algorithm}</td>
                      <td style={{ padding:'8px', borderBottom:`1px solid ${th.border}`, fontSize:'0.72rem', color:th.muted }}>{ALGO_COMPONENTS[r.algorithm]}</td>
                      <td style={{ padding:'8px', borderBottom:`1px solid ${th.border}`, fontSize:'0.78rem', fontFamily:'JetBrains Mono, monospace', color:th.text }}>{r.avgTime}</td>
                      <td style={{ padding:'8px', borderBottom:`1px solid ${th.border}`, fontSize:'0.78rem', fontFamily:'JetBrains Mono, monospace', color:th.green }}>{r.minTime}</td>
                      <td style={{ padding:'8px', borderBottom:`1px solid ${th.border}`, fontSize:'0.78rem', fontFamily:'JetBrains Mono, monospace', color:th.red }}>{r.maxTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:24, marginTop:20 }}>
        <h3 style={{ fontSize:'1rem', fontWeight:700, color:th.text, marginBottom:16 }}>Single Algorithm Test</h3>
        <div style={{ display:'flex', gap:16, alignItems:'end', marginBottom:16 }}>
          <div>
            <label style={{ fontSize:'0.75rem', fontWeight:600, color:th.muted, display:'block', marginBottom:6 }}>Algorithm</label>
            <select value={selectedAlgo} onChange={e => setSelectedAlgo(e.target.value)} style={inputStyle}>
              {Object.keys(ALGO_COMPONENTS).map(a => <option key={a} value={a}>{a} ({ALGO_COMPONENTS[a]})</option>)}
            </select>
          </div>
          <button onClick={runSingle} disabled={singleLoading} style={btnStyle(th.purple)}>
            {singleLoading ? 'Running...' : 'Run Single'}
          </button>
        </div>
        {singleResult && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:12 }}>
            {[{l:'Algorithm',v:singleResult.algorithm,c:th.cyan},{l:'Avg Time',v:singleResult.avgTime+' ms',c:th.green},{l:'Min Time',v:singleResult.minTime+' ms',c:th.green},{l:'Max Time',v:singleResult.maxTime+' ms',c:th.red},{l:'Iterations',v:singleResult.iterations,c:th.amber}].map(s => (
              <div key={s.l} style={{ padding:14, borderRadius:10, background:`${s.c}10`, border:`1px solid ${s.c}20`, textAlign:'center' }}>
                <div style={{ fontSize:'0.7rem', color:th.muted }}>{s.l}</div>
                <div style={{ fontSize:'1.1rem', fontWeight:800, color:s.c, fontFamily:'JetBrains Mono, monospace', marginTop:4 }}>{s.v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Benchmarking;
