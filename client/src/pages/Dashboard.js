import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_BASE = '/api';

const keyframesStyle = `
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
`;

const injectKeyframes = () => {
  if (!document.getElementById('dashboard-keyframes')) {
    const style = document.createElement('style');
    style.id = 'dashboard-keyframes';
    style.textContent = keyframesStyle;
    document.head.appendChild(style);
  }
};

const Badge = ({ text, color, pulse = false }) => {
  const { colors: theme } = useTheme();
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        color: color || theme.accent,
        backgroundColor: color ? `${color}20` : `${theme.accent}20`,
        letterSpacing: '0.02em',
      }}
    >
      {pulse && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: color || theme.accent,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      )}
      {text}
    </span>
  );
};

const StatCard = ({ icon, label, value, change, changeType, onClick }) => {
  const { colors: theme } = useTheme();
  return (
    <div
      onClick={onClick}
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        padding: '20px',
        cursor: onClick ? 'pointer' : 'default',
        animation: 'slideUp 0.4s ease forwards',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 24px ${theme.accent}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: theme.textSecondary, fontSize: 13, margin: '0 0 8px 0', fontWeight: 500 }}>
            {label}
          </p>
          <p
            style={{
              color: theme.text,
              fontSize: 26,
              fontWeight: 700,
              margin: 0,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {value}
          </p>
          {change !== undefined && (
            <p
              style={{
                color: changeType === 'positive' ? '#22c55e' : changeType === 'negative' ? '#ef4444' : theme.textSecondary,
                fontSize: 12,
                margin: '6px 0 0',
                fontWeight: 500,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {changeType === 'positive' ? '\u2191' : changeType === 'negative' ? '\u2193' : ''} {change}
            </p>
          )}
        </div>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: `${theme.accent}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({ icon, label, description, onClick }) => {
  const { colors: theme } = useTheme();
  return (
    <div
      onClick={onClick}
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 10,
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.accent;
        e.currentTarget.style.background = `${theme.accent}08`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.border;
        e.currentTarget.style.background = theme.card;
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          background: `${theme.accent}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: theme.text, fontSize: 13, fontWeight: 600, margin: 0 }}>{label}</p>
        <p style={{ color: theme.textSecondary, fontSize: 11, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {description}
        </p>
      </div>
      <span style={{ color: theme.textSecondary, fontSize: 14, flexShrink: 0 }}>{'\u2192'}</span>
    </div>
  );
};

const Table = ({ columns, data, onRowClick }) => {
  const { colors: theme } = useTheme();
  return (
    <div style={{ overflowX: 'auto', borderRadius: 10, border: `1px solid ${theme.border}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                style={{
                  padding: '10px 14px',
                  textAlign: col.align || 'left',
                  color: theme.textSecondary,
                  fontWeight: 600,
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: `1px solid ${theme.border}`,
                  background: theme.card,
                  whiteSpace: 'nowrap',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              onClick={() => onRowClick && onRowClick(row)}
              style={{
                borderBottom: rowIdx < data.length - 1 ? `1px solid ${theme.border}` : 'none',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = `${theme.accent}08`)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  style={{
                    padding: '10px 14px',
                    color: theme.text,
                    textAlign: col.align || 'left',
                    fontFamily: col.mono ? "'JetBrains Mono', monospace" : 'inherit',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const { colors: theme } = useTheme();
  const statusStyles = {
    pending: { bg: '#f59e0b15', color: '#f59e0b', dot: '#f59e0b' },
    confirmed: { bg: '#3b82f615', color: '#3b82f6', dot: '#3b82f6' },
    dispatched: { bg: '#8b5cf615', color: '#8b5cf6', dot: '#8b5cf6' },
    delivered: { bg: '#22c55e15', color: '#22c55e', dot: '#22c55e' },
    cancelled: { bg: '#ef444415', color: '#ef4444', dot: '#ef4444' },
    available: { bg: '#22c55e15', color: '#22c55e', dot: '#22c55e' },
    maintenance: { bg: '#f9731615', color: '#f97316', dot: '#f97316' },
    en_route: { bg: '#3b82f615', color: '#3b82f6', dot: '#3b82f6' },
    loading: { bg: '#8b5cf615', color: '#8b5cf6', dot: '#8b5cf6' },
    offline: { bg: '#64748b15', color: '#64748b', dot: '#64748b' },
    active: { bg: '#22c55e15', color: '#22c55e', dot: '#22c55e' },
    passed: { bg: '#22c55e15', color: '#22c55e', dot: '#22c55e' },
    failed: { bg: '#ef444415', color: '#ef4444', dot: '#ef4444' },
    paid: { bg: '#22c55e15', color: '#22c55e', dot: '#22c55e' },
    unpaid: { bg: '#f59e0b15', color: '#f59e0b', dot: '#f59e0b' },
  };
  const normalized = status?.toLowerCase().replace(/\s+/g, '_');
  const s = statusStyles[normalized] || { bg: `${theme.textSecondary}15`, color: theme.textSecondary, dot: theme.textSecondary };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        color: s.color,
        background: s.bg,
        textTransform: 'capitalize',
        letterSpacing: '0.01em',
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: s.dot,
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />
      {status?.replace(/_/g, ' ')}
    </span>
  );
};

const LoadingSpinner = ({ theme }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
    <div
      style={{
        width: 48,
        height: 48,
        border: `3px solid ${theme.border}`,
        borderTopColor: theme.accent,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    <p style={{ color: theme.textSecondary, fontSize: 14, fontWeight: 500 }}>Loading dashboard data...</p>
  </div>
);

const SectionHeader = ({ title, theme: t, subtitle }) => (
  <div style={{ marginBottom: 16 }}>
    <h2 style={{ color: t.text, fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h2>
    {subtitle && <p style={{ color: t.textSecondary, fontSize: 12, margin: '4px 0 0' }}>{subtitle}</p>}
  </div>
);

const ProgressBar = ({ value, max = 100, color }) => {
  const { colors: theme } = useTheme();
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ width: '100%', height: 6, borderRadius: 3, background: `${theme.text}10`, overflow: 'hidden' }}>
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          borderRadius: 3,
          background: color || theme.accent,
          transition: 'width 0.6s ease',
        }}
      />
    </div>
  );
};

const API_ENDPOINTS = {
  bookings: '/bookings',
  fleet: '/fleet',
  fleetStats: '/fleet/stats',
  drivers: '/drivers',
  quality: '/quality',
  payments: '/payments',
  dashboard: '/dashboard/stats',
  customers: '/customers',
  routes: '/routes',
  alerts: '/alerts',
  daa: '/analytics/algorithm-comparison',
};

const TABS = [
  { key: 'overview', label: 'Overview', icon: '\uD83D\uDCCA' },
  { key: 'bookings', label: 'Bookings', icon: '\uD83D\uDCCB' },
  { key: 'fleet', label: 'Fleet', icon: '\uD83D\uDE9B' },
  { key: 'quality', label: 'Quality', icon: '\uD83D\uDCA7' },
  { key: 'finance', label: 'Finance', icon: '\uD83D\uDCB0' },
];

export default function Dashboard() {
  const { colors: theme } = useTheme();
  const isDark = theme.bg === "#031220";
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [qualityTests, setQualityTests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [daaAlgorithms, setDaaAlgorithms] = useState([]);

  const [revenueTrend, setRevenueTrend] = useState({ labels: [], values: [] });
  const [fleetStatusData, setFleetStatusData] = useState({ labels: [], values: [] });
  const [bookingStatusData, setBookingStatusData] = useState({ labels: [], values: [] });
  const [qualityScores, setQualityScores] = useState({ labels: [], values: [] });
  const [revenueByMethod, setRevenueByMethod] = useState([]);
  const [driverPerformance, setDriverPerformance] = useState([]);
  const [systemCoverage, setSystemCoverage] = useState([]);

  useEffect(() => {
    injectKeyframes();
  }, []);

  const fetchAPI = useCallback(async (endpoint) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`API call failed: ${endpoint}`, err.message);
      return null;
    }
  }, []);

  const processDashboardStats = (data) => {
    if (!data) return;
    if (data.revenueTrend) setRevenueTrend(data.revenueTrend);
    if (data.fleetStatus) setFleetStatusData(data.fleetStatus);
    if (data.bookingStatus) setBookingStatusData(data.bookingStatus);
    if (data.qualityScores) setQualityScores(data.qualityScores);
    if (data.revenueByMethod) setRevenueByMethod(data.revenueByMethod);
    if (data.driverPerformance) setDriverPerformance(data.driverPerformance);
    if (data.systemCoverage) setSystemCoverage(data.systemCoverage);
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.all([
        fetchAPI(API_ENDPOINTS.bookings),
        fetchAPI(API_ENDPOINTS.fleet),
        fetchAPI(API_ENDPOINTS.drivers),
        fetchAPI(API_ENDPOINTS.quality),
        fetchAPI(API_ENDPOINTS.payments),
        fetchAPI(API_ENDPOINTS.dashboard),
        fetchAPI(API_ENDPOINTS.customers),
        fetchAPI(API_ENDPOINTS.routes),
        fetchAPI(API_ENDPOINTS.alerts),
        fetchAPI(API_ENDPOINTS.daa),
      ]);

      const [bookingsRes, fleetRes, driversRes, qualityRes, paymentsRes, statsRes, customersRes, routesRes, alertsRes, daaRes] = results;

      if (bookingsRes) setBookings(Array.isArray(bookingsRes) ? bookingsRes : bookingsRes.data || bookingsRes.bookings || []);
      if (fleetRes) setFleet(Array.isArray(fleetRes) ? fleetRes : fleetRes.data || fleetRes.fleet || []);
      if (driversRes) setDrivers(Array.isArray(driversRes) ? driversRes : driversRes.data || driversRes.drivers || []);
      if (qualityRes) setQualityTests(Array.isArray(qualityRes) ? qualityRes : qualityRes.data || qualityRes.tests || []);
      if (paymentsRes) setPayments(Array.isArray(paymentsRes) ? paymentsRes : paymentsRes.data || paymentsRes.payments || []);
      if (statsRes) {
        setDashboardStats(statsRes);
        processDashboardStats(statsRes);
      }
      if (customersRes) setCustomers(Array.isArray(customersRes) ? customersRes : customersRes.data || []);
      if (routesRes) setRoutes(Array.isArray(routesRes) ? routesRes : routesRes.data || []);
      if (alertsRes) setAlerts(Array.isArray(alertsRes) ? alertsRes : alertsRes.data || []);
      if (daaRes) setDaaAlgorithms(Array.isArray(daaRes) ? daaRes : daaRes.data || daaRes.algorithms || []);

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchAPI]);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  const themeChartColors = {
    gridColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    textColor: theme.textSecondary,
    accent: theme.accent,
  };

  const StatGrid = ({ children, cols = 6 }) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 14,
        animation: 'fadeIn 0.3s ease',
      }}
    >
      {children}
    </div>
  );

  const TwoColLayout = ({ left, right, ratio = '2fr 1fr' }) => (
    <div style={{ display: 'grid', gridTemplateColumns: ratio, gap: 16 }}>
      {left}
      {right}
    </div>
  );

  const Card = ({ children, style: extraStyle = {} }) => (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        padding: 20,
        animation: 'slideUp 0.4s ease forwards',
        ...extraStyle,
      }}
    >
      {children}
    </div>
  );

  const summaryStats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === 'pending' || b.status === 'scheduled').length,
    activeDispatches: bookings.filter((b) => ['dispatched', 'en_route', 'en-route'].includes(b.status)).length,
    deliveredBookings: bookings.filter((b) => b.status === 'delivered' || b.status === 'completed').length,
    cancelledBookings: bookings.filter((b) => b.status === 'cancelled').length,
    todayRevenue: payments
      .filter((p) => {
        const today = new Date().toISOString().split('T')[0];
        return p.date && p.date.startsWith(today);
      })
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    totalRevenue: payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    driversAvailable: drivers.filter((d) => d.status === 'available' || d.status === 'active').length,
    maintenanceDue: fleet.filter((f) => f.status === 'maintenance').length,
    totalFleet: fleet.length,
    availableFleet: fleet.filter((f) => f.status === 'available').length,
    enRouteFleet: fleet.filter((f) => f.status === 'en-route' || f.status === 'en_route').length,
    loadingFleet: fleet.filter((f) => f.status === 'loading').length,
    maintenanceFleet: fleet.filter((f) => f.status === 'maintenance').length,
    totalTests: qualityTests.length,
    passedTests: qualityTests.filter((q) => q.status === 'passed' || q.status === 'pass').length,
    failedTests: qualityTests.filter((q) => q.status === 'failed' || q.status === 'fail').length,
    avgScore:
      qualityTests.length > 0
        ? (qualityTests.reduce((sum, q) => sum + (Number(q.score) || 0), 0) / qualityTests.length).toFixed(1)
        : '0.0',
    totalTransactions: payments.length,
    outstanding: payments
      .filter((p) => p.status === 'unpaid' || p.status === 'pending')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
  };

  const getRevenueChartData = () => ({
    labels: revenueTrend.labels.length > 0 ? revenueTrend.labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: revenueTrend.values.length > 0 ? revenueTrend.values : [4200, 5800, 3900, 6100, 4800, 7200, 5500],
        borderColor: themeChartColors.accent,
        backgroundColor: `${themeChartColors.accent}18`,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: themeChartColors.accent,
        borderWidth: 2,
      },
    ],
  });

  const getFleetStatusChartData = () => ({
    labels: fleetStatusData.labels.length > 0 ? fleetStatusData.labels : ['Available', 'En Route', 'Loading', 'Maintenance'],
    datasets: [
      {
        data: fleetStatusData.values.length > 0 ? fleetStatusData.values : [4, 2, 1, 1],
        backgroundColor: ['#22c55e', '#3b82f6', '#8b5cf6', '#f97316'],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  });

  const getBookingStatusChartData = () => ({
    labels: bookingStatusData.labels.length > 0 ? bookingStatusData.labels : ['Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: bookingStatusData.values.length > 0 ? bookingStatusData.values : [12, 8, 5, 25, 3],
        backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6', '#22c55e', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  });

  const getQualityBarData = () => ({
    labels: qualityScores.labels.length > 0 ? qualityScores.labels : ['pH Level', 'TDS', 'Chlorine', 'Turbidity', 'Bacteria'],
    datasets: [
      {
        label: 'Score',
        data: qualityScores.values.length > 0 ? qualityScores.values : [8.5, 7.2, 9.1, 7.8, 8.9],
        backgroundColor: ['#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b', '#06b6d4'].map((c) => `${c}80`),
        borderColor: ['#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b', '#06b6d4'],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  });

  const chartOptionsBase = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme.card,
        titleColor: theme.text,
        bodyColor: theme.textSecondary,
        borderColor: theme.border,
        borderWidth: 1,
        padding: 10,
        titleFont: { size: 12, weight: '600' },
        bodyFont: { size: 11 },
        cornerRadius: 8,
      },
    },
  };

  const lineChartOptions = {
    ...chartOptionsBase,
    scales: {
      x: {
        grid: { color: themeChartColors.gridColor },
        ticks: { color: themeChartColors.textColor, font: { size: 11 } },
      },
      y: {
        grid: { color: themeChartColors.gridColor },
        ticks: {
          color: themeChartColors.textColor,
          font: { size: 11, family: "'JetBrains Mono', monospace" },
        },
      },
    },
  };

  const doughnutOptions = {
    ...chartOptionsBase,
    cutout: '68%',
    plugins: {
      ...chartOptionsBase.plugins,
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: themeChartColors.textColor,
          padding: 14,
          font: { size: 11 },
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptionsBase,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: themeChartColors.textColor, font: { size: 11 } },
      },
      y: {
        grid: { color: themeChartColors.gridColor },
        ticks: {
          color: themeChartColors.textColor,
          font: { size: 11, family: "'JetBrains Mono', monospace" },
        },
      },
    },
  };

  const bookingTableColumns = [
    { header: 'ID', key: 'bookingId', mono: true },
    { header: 'Customer', key: 'customerName' },
    { header: 'Phone', key: 'phone' },
    { header: 'Area', key: 'areaId' },
    { header: 'Tanker', key: 'tankerSize' },
    { header: 'Date', key: 'date', mono: true },
    { header: 'Time', key: 'timeSlot' },
    { header: 'Status', key: 'status', render: (v) => <StatusBadge status={v} /> },
    { header: 'Amount', key: 'price', mono: true, render: (v) => `\u20B9${Number(v || 0).toLocaleString()}` },
  ];

  const tankerTableColumns = [
    { header: 'ID', key: 'tankerId', mono: true },
    { header: 'Driver', key: 'driverName' },
    { header: 'Type', key: 'type' },
    { header: 'Capacity', key: 'capacity', mono: true, render: (v) => `${v}L` },
    { header: 'Status', key: 'status', render: (v) => <StatusBadge status={v} /> },
    {
      header: 'Fuel',
      key: 'fuelLevel',
      align: 'center',
      render: (v) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, flexShrink: 0 }}>{v}%</span>
          <ProgressBar value={v} color={v > 50 ? '#22c55e' : v > 25 ? '#f59e0b' : '#ef4444'} />
        </div>
      ),
    },
  ];

  const qualityTableColumns = [
    { header: 'ID', key: 'testId', mono: true },
    { header: 'Date', key: 'testedDate', mono: true },
    { header: 'pH', key: 'ph', mono: true },
    { header: 'TDS (ppm)', key: 'tds', mono: true },
    { header: 'Bacteria', key: 'bacteria', render: (v) => <StatusBadge status={v === 'absent' || v === 'Safe' || v === 'safe' ? 'passed' : 'failed'} /> },
    { header: 'Score', key: 'score', mono: true, render: (v) => <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{v}</span> },
    { header: 'Status', key: 'status', render: (v) => <StatusBadge status={v} /> },
  ];

  const paymentTableColumns = [
    { header: 'ID', key: 'paymentId', mono: true },
    { header: 'Booking', key: 'bookingId', mono: true },
    { header: 'Customer', key: 'customer' },
    { header: 'Amount', key: 'amount', mono: true, render: (v) => `\u20B9${Number(v || 0).toLocaleString()}` },
    { header: 'Method', key: 'method' },
    { header: 'Date', key: 'date', mono: true },
    { header: 'Status', key: 'status', render: (v) => <StatusBadge status={v} /> },
  ];

  const recentBookingsColumns = [
    { header: 'ID', key: 'bookingId', mono: true },
    { header: 'Customer', key: 'customerName' },
    { header: 'Area', key: 'areaId' },
    { header: 'Status', key: 'status', render: (v) => <StatusBadge status={v} /> },
    { header: 'Amount', key: 'price', mono: true, render: (v) => `\u20B9${Number(v || 0).toLocaleString()}` },
  ];

  const whoStandards = [
    { parameter: 'pH Level', range: '6.5 - 8.5', icon: '\u2697\uFE0F' },
    { parameter: 'TDS', range: '< 500 ppm', icon: '\uD83E\uDDEA' },
    { parameter: 'Chlorine', range: '0.2 - 1.0 mg/L', icon: '\uD83D\uDD2C' },
    { parameter: 'Turbidity', range: '< 1 NTU', icon: '\uD83D\uDC41\uFE0F' },
    { parameter: 'E. Coli', range: '0 CFU/100ml', icon: '\uD83E\uDDA0' },
    { parameter: 'Hardness', range: '< 200 mg/L', icon: '\uD83D\uDC8E' },
  ];

  const defaultDaaAlgorithms = [
    { name: 'Dijkstra', status: 'active', desc: 'Shortest path routing' },
    { name: 'Bellman-Ford', status: 'active', desc: 'Dynamic routing' },
    { name: 'Floyd-Warshall', status: 'idle', desc: 'All-pairs paths' },
    { name: 'A* Search', status: 'active', desc: 'Heuristic routing' },
  ];
  const daaAlgorithmsList = daaAlgorithms.length > 0 ? daaAlgorithms : defaultDaaAlgorithms;

  const getRevenueByMethod = () => {
    if (revenueByMethod.length > 0) return revenueByMethod;
    const methods = {};
    payments.forEach((p) => {
      const m = p.method || 'Cash';
      methods[m] = (methods[m] || 0) + (Number(p.amount) || 0);
    });
    if (Object.keys(methods).length > 0) {
      return Object.entries(methods).map(([method, amount]) => ({ method, amount }));
    }
    return [
      { method: 'Cash', amount: 12500 },
      { method: 'UPI', amount: 18900 },
      { method: 'Card', amount: 7200 },
      { method: 'Online', amount: 9400 },
    ];
  };

  const getDriverPerformanceData = () => {
    if (driverPerformance.length > 0) return driverPerformance;
    return drivers.slice(0, 5).map((d, i) => ({
      name: d.name || d.driver || `Driver ${i + 1}`,
      rating: d.rating || (4 + Math.random()).toFixed(1),
      deliveries: d.deliveries || Math.floor(Math.random() * 40 + 10),
    }));
  };

  const getSystemCoverageData = () => {
    if (systemCoverage.length > 0) return systemCoverage;
    return [
      { area: 'North Zone', coverage: 92 },
      { area: 'South Zone', coverage: 85 },
      { area: 'East Zone', coverage: 78 },
      { area: 'West Zone', coverage: 88 },
    ];
  };

  if (loading && !dashboardStats) {
    return (
      <div style={{ background: theme.bg, minHeight: '100vh', padding: 24 }}>
        <LoadingSpinner theme={theme} />
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <StatGrid cols={6}>
        <StatCard icon={'\uD83D\uDCCB'} label="Total Bookings" value={summaryStats.totalBookings} change="+12% this week" changeType="positive" />
        <StatCard icon={'\u23F3'} label="Pending" value={summaryStats.pendingBookings} change={`${summaryStats.pendingBookings} awaiting`} changeType={summaryStats.pendingBookings > 5 ? 'negative' : 'neutral'} />
        <StatCard icon={'\uD83D\uDE9A'} label="Active Dispatches" value={summaryStats.activeDispatches} change="In progress" changeType="positive" />
        <StatCard icon={'\uD83D\uDCB0'} label="Today Revenue" value={`\u20B9${summaryStats.todayRevenue.toLocaleString()}`} change="+8.2% vs yesterday" changeType="positive" />
        <StatCard icon={'\uD83D\uDC68\u200D\uD83D\uDE80'} label="Drivers Available" value={summaryStats.driversAvailable} change={`${summaryStats.driversAvailable} ready`} changeType="positive" />
        <StatCard icon={'\uD83D\uDD27'} label="Maintenance Due" value={summaryStats.maintenanceDue} change={summaryStats.maintenanceDue > 0 ? 'Attention needed' : 'All clear'} changeType={summaryStats.maintenanceDue > 0 ? 'negative' : 'positive'} />
      </StatGrid>

      <TwoColLayout
        left={
          <Card>
            <SectionHeader title="Revenue Trend" subtitle="Daily revenue overview" theme={theme} />
            <div style={{ height: 220 }}>
              <Line data={getRevenueChartData()} options={lineChartOptions} />
            </div>
          </Card>
        }
        right={
          <Card>
            <SectionHeader title="Fleet Status" subtitle="Current fleet distribution" theme={theme} />
            <div style={{ height: 220, display: 'flex', justifyContent: 'center' }}>
              <Doughnut data={getFleetStatusChartData()} options={doughnutOptions} />
            </div>
          </Card>
        }
      />

      <TwoColLayout
        ratio="1.5fr 1fr"
        left={
          <Card>
            <SectionHeader title="Recent Bookings" subtitle="Latest customer orders" theme={theme} />
            <Table
              columns={recentBookingsColumns}
              data={bookings.slice(0, 8)}
              onRowClick={(row) => navigate('/dashboard/bookings')}
            />
          </Card>
        }
        right={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SectionHeader title="Quick Actions" theme={theme} />
            <ActionCard icon={'\u2795'} label="New Booking" description="Create a new water delivery booking" onClick={() => navigate('/dashboard/book')} />
            <ActionCard icon={'\uD83D\uDE9A'} label="Dispatch Tanker" description="Assign and dispatch tanker to booking" onClick={() => navigate('/dashboard/drivers')} />
            <ActionCard icon={'\uD83D\uDCCA'} label="View Reports" description="Access analytics and reports" onClick={() => navigate('/dashboard/analytics')} />
            <ActionCard icon={'\u2699\uFE0F'} label="Settings" description="System configuration and preferences" onClick={() => navigate('/dashboard')} />
            <div style={{ marginTop: 8 }}>
              <SectionHeader title="DAA Algorithms" subtitle="Routing optimization" theme={theme} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {daaAlgorithmsList.map((algo, i) => (
                  <div
                    key={i}
                    style={{
                      background: theme.card,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ color: theme.text, fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{algo.name}</span>
                      <Badge
                        text={algo.status}
                        color={algo.status === 'active' ? '#22c55e' : '#64748b'}
                        pulse={algo.status === 'active'}
                      />
                    </div>
                    <p style={{ color: theme.textSecondary, fontSize: 10, margin: 0 }}>{algo.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <Card>
          <SectionHeader title="Water Quality" subtitle="Latest test scores" theme={theme} />
          <div style={{ height: 200 }}>
            <Bar data={getQualityBarData()} options={barChartOptions} />
          </div>
        </Card>
        <Card>
          <SectionHeader title="Driver Performance" subtitle="Top performers" theme={theme} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {getDriverPerformanceData().map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 4 ? `1px solid ${theme.border}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: `${theme.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace" }}>
                    {i + 1}
                  </span>
                  <div>
                    <p style={{ color: theme.text, fontSize: 12, fontWeight: 600, margin: 0 }}>{d.name}</p>
                    <p style={{ color: theme.textSecondary, fontSize: 10, margin: '2px 0 0' }}>{d.deliveries} deliveries</p>
                  </div>
                </div>
                <span style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  {'\u2605'} {d.rating}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="System Coverage" subtitle="Area service coverage" theme={theme} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {getSystemCoverageData().map((c, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: theme.text, fontSize: 12, fontWeight: 500 }}>{c.area}</span>
                  <span style={{ color: theme.textSecondary, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>{c.coverage}%</span>
                </div>
                <ProgressBar value={c.coverage} color={c.coverage > 85 ? '#22c55e' : c.coverage > 70 ? '#f59e0b' : '#ef4444'} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderBookingsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <StatGrid cols={4}>
          <StatCard icon={'\uD83D\uDCCB'} label="Total Bookings" value={summaryStats.totalBookings} change="+12% this week" changeType="positive" />
          <StatCard icon={'\u23F3'} label="Pending" value={summaryStats.pendingBookings} change="Awaiting dispatch" changeType="negative" />
          <StatCard icon={'\u2705'} label="Delivered" value={summaryStats.deliveredBookings} change="Completed" changeType="positive" />
          <StatCard icon={'\u274C'} label="Cancelled" value={summaryStats.cancelledBookings} change="Refunds pending" changeType="negative" />
        </StatGrid>
        <button
          onClick={() => navigate('/dashboard/book')}
          style={{
            background: theme.accent,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
          onMouseEnter={(e) => (e.target.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.target.style.opacity = '1')}
        >
          {'\u2795'} New Booking
        </button>
      </div>

      <Card>
        <SectionHeader title="All Bookings" subtitle={`${bookings.length} total records`} theme={theme} />
        <Table
          columns={bookingTableColumns}
          data={bookings}
          onRowClick={(row) => navigate('/dashboard/bookings')}
        />
      </Card>

      <TwoColLayout
        left={
          <Card>
            <SectionHeader title="Booking Status" subtitle="Distribution overview" theme={theme} />
            <div style={{ height: 240, display: 'flex', justifyContent: 'center' }}>
              <Doughnut data={getBookingStatusChartData()} options={doughnutOptions} />
            </div>
          </Card>
        }
        right={
          <Card>
            <SectionHeader title="Booking Details" subtitle="Recent activity" theme={theme} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bookings.slice(0, 6).map((b, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 5 ? `1px solid ${theme.border}` : 'none' }}>
                  <div>
                    <p style={{ color: theme.text, fontSize: 12, fontWeight: 600, margin: 0 }}>
                      #{b.bookingId || `BK${String(i + 1).padStart(4, '0')}`}
                    </p>
                    <p style={{ color: theme.textSecondary, fontSize: 11, margin: '3px 0 0' }}>{b.customerName || 'Customer'}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={b.status} />
                    <p style={{ color: theme.text, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", margin: '4px 0 0', fontWeight: 600 }}>
                      {'\u20B9'}{Number(b.price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <p style={{ color: theme.textSecondary, fontSize: 13, textAlign: 'center', padding: 20 }}>No bookings found</p>
              )}
            </div>
          </Card>
        }
      />
    </div>
  );

  const renderFleetTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <StatGrid cols={5}>
        <StatCard icon={'\uD83D\uDE9B'} label="Total Tankers" value={summaryStats.totalFleet} change="In fleet" changeType="positive" />
        <StatCard icon={'\u2705'} label="Available" value={summaryStats.availableFleet} change="Ready" changeType="positive" />
        <StatCard icon={'\uD83D\uDEE4\uFE0F'} label="En Route" value={summaryStats.enRouteFleet} change="On delivery" changeType="neutral" />
        <StatCard icon={'\uD83D\uDCE6'} label="Loading" value={summaryStats.loadingFleet} change="Being filled" changeType="neutral" />
        <StatCard icon={'\uD83D\uDD27'} label="Maintenance" value={summaryStats.maintenanceFleet} change="Needs attention" changeType="negative" />
      </StatGrid>

      <Card>
        <SectionHeader title="Tanker Fleet" subtitle={`${fleet.length} vehicles`} theme={theme} />
        <Table
          columns={tankerTableColumns}
          data={fleet}
          onRowClick={(row) => navigate('/dashboard/drivers')}
        />
      </Card>

      <TwoColLayout
        left={
          <Card>
            <SectionHeader title="Tanker Status" subtitle="Fleet distribution" theme={theme} />
            <div style={{ height: 260, display: 'flex', justifyContent: 'center' }}>
              <Doughnut data={getFleetStatusChartData()} options={doughnutOptions} />
            </div>
          </Card>
        }
        right={
          <Card>
            <SectionHeader title="Maintenance Alerts" subtitle="Requires attention" theme={theme} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {alerts.filter((a) => a.type === 'maintenance' || a.priority === 'high').length > 0
                ? alerts.filter((a) => a.type === 'maintenance' || a.priority === 'high').map((alert, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1px solid ${theme.border}` }}>
                      <span style={{ fontSize: 18 }}>{'\u26A0\uFE0F'}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: theme.text, fontSize: 12, fontWeight: 600, margin: 0 }}>{alert.message || alert.title || 'Maintenance Alert'}</p>
                        <p style={{ color: theme.textSecondary, fontSize: 11, margin: '2px 0 0' }}>{alert.description || alert.details || ''}</p>
                      </div>
                      <Badge text={alert.severity || 'High'} color="#f97316" />
                    </div>
                  ))
                : fleet.filter((f) => f.status === 'maintenance').map((tanker, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1px solid ${theme.border}` }}>
                      <span style={{ fontSize: 18 }}>{'\uD83D\uDD27'}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: theme.text, fontSize: 12, fontWeight: 600, margin: 0 }}>Tanker #{tanker.tankerId || `TK${String(i + 1).padStart(3, '0')}`}</p>
                        <p style={{ color: theme.textSecondary, fontSize: 11, margin: '2px 0 0' }}>Service required - Last maintained: {tanker.lastMaintenance || 'N/A'}</p>
                      </div>
                      <Badge text="Urgent" color="#ef4444" pulse />
                    </div>
                  ))
              }
              {alerts.filter((a) => a.type === 'maintenance' || a.priority === 'high').length === 0 && fleet.filter((f) => f.status === 'maintenance').length === 0 && (
                <div style={{ textAlign: 'center', padding: 30 }}>
                  <span style={{ fontSize: 32 }}>{'\u2705'}</span>
                  <p style={{ color: theme.textSecondary, fontSize: 12, marginTop: 8 }}>All systems running smoothly</p>
                </div>
              )}
            </div>
          </Card>
        }
      />
    </div>
  );

  const renderQualityTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <StatGrid cols={4}>
        <StatCard icon={'\uD83D\uDCA7'} label="Total Tests" value={summaryStats.totalTests} change="All time" changeType="positive" />
        <StatCard icon={'\u2705'} label="Passed" value={summaryStats.passedTests} change="Compliant" changeType="positive" />
        <StatCard icon={'\u274C'} label="Failed" value={summaryStats.failedTests} change="Non-compliant" changeType={summaryStats.failedTests > 0 ? 'negative' : 'positive'} />
        <StatCard icon={'\uD83C\uDFAF'} label="Avg Score" value={summaryStats.avgScore} change="Quality index" changeType="positive" />
      </StatGrid>

      <Card>
        <SectionHeader title="Quality Test Results" subtitle={`${qualityTests.length} test records`} theme={theme} />
        <Table
          columns={qualityTableColumns}
          data={qualityTests}
        />
      </Card>

      <TwoColLayout
        left={
          <Card>
            <SectionHeader title="Quality Scores" subtitle="Parameter performance" theme={theme} />
            <div style={{ height: 240 }}>
              <Bar data={getQualityBarData()} options={barChartOptions} />
            </div>
          </Card>
        }
        right={
          <Card>
            <SectionHeader title="WHO Standards" subtitle="Reference guidelines" theme={theme} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {whoStandards.map((std, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    background: `${theme.textSecondary}08`,
                    borderRadius: 8,
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{std.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: theme.text, fontSize: 12, fontWeight: 600, margin: 0 }}>{std.parameter}</p>
                    <p style={{ color: theme.textSecondary, fontSize: 11, margin: '2px 0 0', fontFamily: "'JetBrains Mono', monospace" }}>{std.range}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        }
      />
    </div>
  );

  const renderFinanceTab = () => {
    const revByMethod = getRevenueByMethod();
    const totalRev = revByMethod.reduce((s, m) => s + m.amount, 0);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <StatGrid cols={4}>
          <StatCard icon={'\uD83D\uDCB0'} label="Total Revenue" value={`\u20B9${summaryStats.totalRevenue.toLocaleString()}`} change="All time" changeType="positive" />
          <StatCard icon={'\uD83D\uDCB5'} label="Today Revenue" value={`\u20B9${summaryStats.todayRevenue.toLocaleString()}`} change="+8.2% vs yesterday" changeType="positive" />
          <StatCard icon={'\u26A0\uFE0F'} label="Outstanding" value={`\u20B9${summaryStats.outstanding.toLocaleString()}`} change="Pending collection" changeType="negative" />
          <StatCard icon={'\uD83D\uDCCB'} label="Transactions" value={summaryStats.totalTransactions} change="Total processed" changeType="neutral" />
        </StatGrid>

        <Card>
          <SectionHeader title="Payment History" subtitle={`${payments.length} transactions`} theme={theme} />
          <Table
            columns={paymentTableColumns}
            data={payments}
          />
        </Card>

        <TwoColLayout
          left={
            <Card>
              <SectionHeader title="Revenue by Method" subtitle="Payment breakdown" theme={theme} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {revByMethod.map((item, i) => {
                  const pct = totalRev > 0 ? (item.amount / totalRev) * 100 : 0;
                  const colors = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4', '#f97316'];
                  const color = colors[i % colors.length];
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ color: theme.text, fontSize: 13, fontWeight: 600 }}>{item.method}</span>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <span style={{ color: theme.text, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                            {'\u20B9'}{item.amount.toLocaleString()}
                          </span>
                          <span style={{ color: theme.textSecondary, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                            {pct.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <ProgressBar value={pct} color={color} />
                    </div>
                  );
                })}
              </div>
            </Card>
          }
          right={
            <Card>
              <SectionHeader title="Recent Transactions" subtitle="Latest payments" theme={theme} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {payments.slice(0, 8).map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: i < 7 ? `1px solid ${theme.border}` : 'none',
                    }}
                  >
                    <div>
                      <p style={{ color: theme.text, fontSize: 12, fontWeight: 600, margin: 0 }}>
                        {p.customer || p.customerName || 'Customer'}
                      </p>
                      <p style={{ color: theme.textSecondary, fontSize: 11, margin: '2px 0 0' }}>
                        {p.method || 'Cash'} - {p.date || 'N/A'}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: theme.text, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, margin: 0 }}>
                        {'\u20B9'}{Number(p.amount || 0).toLocaleString()}
                      </p>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                ))}
                {payments.length === 0 && (
                  <p style={{ color: theme.textSecondary, fontSize: 13, textAlign: 'center', padding: 20 }}>No transactions found</p>
                )}
              </div>
            </Card>
          }
        />
      </div>
    );
  };

  const tabContent = {
    overview: renderOverviewTab,
    bookings: renderBookingsTab,
    fleet: renderFleetTab,
    quality: renderQualityTab,
    finance: renderFinanceTab,
  };

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', padding: 24 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: 0 }}>
              Water Tanker Dashboard
            </h1>
            <p style={{ color: theme.textSecondary, fontSize: 13, margin: '4px 0 0' }}>
              Real-time monitoring and management system
              {lastUpdated && (
                <span style={{ marginLeft: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={fetchAllData}
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              color: theme.text,
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = theme.accent;
              e.target.style.background = `${theme.accent}10`;
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = theme.border;
              e.target.style.background = theme.card;
            }}
          >
            {'\uD83D\uDD04'} Refresh
          </button>
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: theme.card, borderRadius: 10, padding: 4, border: `1px solid ${theme.border}` }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === tab.key ? theme.accent : 'transparent',
                color: activeTab === tab.key ? '#fff' : theme.textSecondary,
                fontSize: 13,
                fontWeight: activeTab === tab.key ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {tabContent[activeTab] && tabContent[activeTab]()}
      </div>
    </div>
  );
}
