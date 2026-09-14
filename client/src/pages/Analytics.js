import React, { useState, useEffect } from 'react';
import { Bar, Line, Radar } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, ArcElement, Title, Tooltip, Legend, Filler);

const API_BASE = '/api';

function Analytics() {
  const { colors, themeName } = useTheme();
  const t = colors;
  const th = themeName === 'dark'
    ? { bg: '#031220', card: '#0d2536', border: 'rgba(34,211,238,0.12)', text: '#e6f2f8', muted: '#94a3b8', dim: '#64748b', cyan: '#22d3ee', teal: '#06b6d4', green: '#10b981', red: '#ef4444', amber: '#f59e0b', purple: '#a78bfa' }
    : { bg: '#f0f4f8', card: '#ffffff', border: 'rgba(15,23,41,0.08)', text: '#0f1729', muted: '#64748b', dim: '#94a3b8', cyan: '#0891b2', teal: '#0e7490', green: '#059669', red: '#dc2626', amber: '#d97706', purple: '#7c3aed' };

  const [dashboardStats, setDashboardStats] = useState(null);
  const [performanceStats, setPerformanceStats] = useState(null);
  const [algorithmComparison, setAlgorithmComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
      const [dashRes, perfRes, algoRes] = await Promise.all([
        fetch(`${API_BASE}/analytics/dashboard`), fetch(`${API_BASE}/analytics/performance`), fetch(`${API_BASE}/analytics/algorithm-comparison`)
      ]);
      const [dashData, perfData, algoData] = await Promise.all([dashRes.json(), perfRes.json(), algoRes.json()]);
      setDashboardStats(dashData);
      setPerformanceStats(perfData);
      setAlgorithmComparison(algoData);
      setLoading(false);
    } catch (err) { console.error('Error fetching analytics:', err); setLoading(false); }
  };

  if (loading) return (
    <div style={{ display: 'grid', placeItems: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: `3px solid ${th.cyan}30`, borderTopColor: th.cyan, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: th.muted }}>Loading analytics...</p>
      </div>
    </div>
  );

  const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: th.card, borderColor: th.border, borderWidth: 1, titleColor: th.text, bodyColor: th.muted, padding: 12, cornerRadius: 8 } }, scales: { x: { grid: { color: th.border }, ticks: { color: th.dim, font: { size: 11 } } }, y: { grid: { color: th.border }, ticks: { color: th.dim, font: { size: 11 } } } } };
  const radarOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: th.muted, padding: 12, usePointStyle: true, font: { size: 11 } } } }, scales: { r: { beginAtZero: true, max: 10, ticks: { stepSize: 2, color: th.dim }, grid: { color: th.border }, pointLabels: { color: th.text, font: { size: 11 } } } } };

  const hourlyData = {
    labels: Array.from({ length: 14 }, (_, i) => `${6 + i}:00`),
    datasets: [{ label: 'Deliveries per Hour', data: performanceStats?.hourlyDistribution || [], borderColor: th.cyan, backgroundColor: `${th.cyan}20`, fill: true, tension: 0.4, pointBackgroundColor: th.cyan, pointRadius: 3 }]
  };

  const algorithmPerformance = {
    labels: algorithmComparison?.algorithms?.map(a => a.name) || [],
    datasets: [{ label: 'Time Complexity Score', data: [9, 8, 6, 4, 7], backgroundColor: [`${th.cyan}CC`, `${th.green}CC`, `${th.purple}CC`, `${th.amber}CC`, `${th.red}CC`], borderWidth: 0, borderRadius: 6 }]
  };

  const radarData = {
    labels: ['Speed', 'Optimality', 'Memory', 'Scalability', 'Flexibility'],
    datasets: [
      { label: "Dijkstra's", data: [9, 10, 8, 7, 6], borderColor: th.cyan, backgroundColor: `${th.cyan}20`, pointBackgroundColor: th.cyan },
      { label: 'Greedy', data: [10, 7, 9, 8, 7], borderColor: th.green, backgroundColor: `${th.green}20`, pointBackgroundColor: th.green },
      { label: 'DP', data: [6, 10, 5, 5, 8], borderColor: th.purple, backgroundColor: `${th.purple}20`, pointBackgroundColor: th.purple },
      { label: 'Backtracking', data: [4, 10, 7, 3, 9], borderColor: th.amber, backgroundColor: `${th.amber}20`, pointBackgroundColor: th.amber },
      { label: 'Ford-Fulkerson', data: [7, 10, 7, 6, 7], borderColor: th.red, backgroundColor: `${th.red}20`, pointBackgroundColor: th.red }
    ]
  };

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: th.text }}>Analytics Dashboard</h1>
        <p style={{ color: th.muted, fontSize: '0.85rem', marginTop: 4 }}>Algorithm Performance Analysis & System Metrics</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[{ l: 'Total Deliveries', v: performanceStats?.totalDeliveries || 0, c: th.cyan, bg: `${th.cyan}15` }, { l: 'Completed', v: performanceStats?.byStatus?.completed || 0, c: th.green, bg: `${th.green}15` }, { l: 'Avg Delay', v: `${performanceStats?.delays?.averageMinutes || 0} min`, c: th.amber, bg: `${th.amber}15` }, { l: 'Delay Cost', v: `$${performanceStats?.delays?.totalCost || 0}`, c: th.red, bg: `${th.red}15` }].map(s => (
        <div key={s.l} style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: '0.78rem', color: th.muted }}>{s.l}</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.c, fontFamily: 'JetBrains Mono, monospace', marginTop: 4 }}>{s.v}</div>
        </div>
      ))}

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 16 }}>Deliveries by Hour</h3>
          <div style={{ height: 250 }}><Line data={hourlyData} options={chartOpts} /></div>
        </div>
        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 16 }}>Algorithm Complexity Comparison</h3>
          <div style={{ height: 250 }}><Bar data={algorithmPerformance} options={{ ...chartOpts, scales: { ...chartOpts.scales, y: { ...chartOpts.scales.y, max: 10 } } }} /></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 16 }}>Algorithm Radar Comparison</h3>
          <div style={{ height: 300 }}><Radar data={radarData} options={radarOpts} /></div>
        </div>
        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 16 }}>Algorithm Details</h3>
          <div style={{ maxHeight: 320, overflow: 'auto' }}>
            {algorithmComparison?.algorithms?.map((algo, idx) => (
              <div key={idx} style={{ padding: 14, borderRadius: 10, background: `${th.cyan}08`, border: `1px solid ${th.cyan}15`, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontWeight: 600, color: th.text, fontSize: '0.88rem' }}>{algo.name}</h4>
                  <span style={{ padding: '2px 8px', background: `${th.cyan}20`, color: th.cyan, borderRadius: 6, fontSize: '0.68rem', fontWeight: 600 }}>{algo.type}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, fontSize: '0.72rem', color: th.muted, marginBottom: 8 }}>
                  <div>Time: {algo.timeComplexity}</div>
                  <div>Space: {algo.spaceComplexity}</div>
                  <div style={{ gridColumn: '1 / -1' }}>Best for: {algo.bestFor}</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {algo.pros?.map((pro, pIdx) => <span key={pIdx} style={{ padding: '2px 6px', background: `${th.green}20`, color: th.green, borderRadius: 4, fontSize: '0.65rem' }}>+ {pro}</span>)}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                  {algo.cons?.map((con, cIdx) => <span key={cIdx} style={{ padding: '2px 6px', background: `${th.red}20`, color: th.red, borderRadius: 4, fontSize: '0.65rem' }}>- {con}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 16 }}>Delivery Status Breakdown</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {Object.entries(performanceStats?.byStatus || {}).map(([status, count]) => (
            <div key={status} style={{ textAlign: 'center', padding: 16, borderRadius: 10, background: `${th.cyan}08`, border: `1px solid ${th.cyan}15` }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: th.text, fontFamily: 'JetBrains Mono, monospace' }}>{count}</div>
              <div style={{ fontSize: '0.78rem', color: th.muted, textTransform: 'capitalize' }}>{status}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 16 }}>Priority Distribution</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {Object.entries(performanceStats?.byPriority || {}).map(([priority, count]) => (
            <div key={priority} style={{ textAlign: 'center', padding: 16, borderRadius: 10, background: `${priority === 'critical' ? th.red : priority === 'high' ? th.amber : priority === 'medium' ? th.teal : th.green}10`, border: `1px solid ${priority === 'critical' ? th.red : priority === 'high' ? th.amber : priority === 'medium' ? th.teal : th.green}20` }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: priority === 'critical' ? th.red : priority === 'high' ? th.amber : priority === 'medium' ? th.teal : th.green, fontFamily: 'JetBrains Mono, monospace' }}>{count}</div>
              <div style={{ fontSize: '0.78rem', color: th.muted, textTransform: 'capitalize' }}>{priority}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
