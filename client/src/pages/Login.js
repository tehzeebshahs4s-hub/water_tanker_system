import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { themeName, toggleTheme } = useTheme();
  const isDark = themeName === 'dark';
  const navigate = useNavigate();

  const demoAccounts = [
    { role: 'Admin', email: 'admin@aqua.com', password: 'admin123', color: '#06b6d4', icon: '👑', bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.3)' },
    { role: 'Dispatcher', email: 'dispatcher@aqua.com', password: 'dispatch123', color: '#a855f7', icon: '🚛', bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.3)' },
    { role: 'Driver', email: 'driver@aqua.com', password: 'driver123', color: '#22c55e', icon: '👨‍✈️', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)' },
    { role: 'Customer', email: 'customer@aqua.com', password: 'customer123', color: '#f59e0b', icon: '🛒', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = login(email, password);
    if (result.success) {
      const role = result.user?.role || 'admin';
      navigate(role === 'admin' ? '/dashboard' : '/dashboard');
    } else {
      setError(result.error || 'Invalid email or password');
    }
    setLoading(false);
  };

  const handleDemoClick = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
    setLoading(true);
    const result = login(account.email, account.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Failed to sign in with demo credentials');
    }
    setLoading(false);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
      background: isDark ? '#0a0f1e' : '#f0f4f8',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    bgOrb1: {
      position: 'absolute',
      top: '-20%',
      right: '-10%',
      width: '600px',
      height: '600px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
      filter: 'blur(80px)',
      pointerEvents: 'none',
    },
    bgOrb2: {
      position: 'absolute',
      bottom: '-20%',
      left: '-10%',
      width: '600px',
      height: '600px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
      filter: 'blur(80px)',
      pointerEvents: 'none',
    },
    themeToggle: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 10,
      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      borderRadius: '12px',
      padding: '10px 14px',
      cursor: 'pointer',
      fontSize: '18px',
      color: isDark ? '#e2e8f0' : '#475569',
      transition: 'all 0.2s ease',
    },
    leftPanel: {
      flex: '1 1 50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      position: 'relative',
      zIndex: 1,
    },
    rightPanel: {
      flex: '1 1 50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      position: 'relative',
      zIndex: 1,
    },
    loginCard: {
      width: '100%',
      maxWidth: '420px',
      background: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '40px',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
      boxShadow: isDark
        ? '0 25px 60px rgba(0,0,0,0.5), 0 0 120px rgba(20, 184, 166, 0.05)'
        : '0 25px 60px rgba(0,0,0,0.08), 0 0 120px rgba(20, 184, 166, 0.05)',
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '32px',
    },
    logoIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      boxShadow: '0 4px 16px rgba(20, 184, 166, 0.3)',
    },
    logoText: {
      fontSize: '22px',
      fontWeight: '700',
      color: isDark ? '#e2e8f0' : '#1e293b',
      letterSpacing: '-0.5px',
    },
    proBadge: {
      background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
      color: '#fff',
      fontSize: '10px',
      fontWeight: '700',
      padding: '2px 8px',
      borderRadius: '6px',
      letterSpacing: '1px',
    },
    heading: {
      fontSize: '26px',
      fontWeight: '700',
      color: isDark ? '#f1f5f9' : '#0f172a',
      marginBottom: '6px',
    },
    subtitle: {
      fontSize: '14px',
      color: isDark ? '#94a3b8' : '#64748b',
      marginBottom: '28px',
    },
    errorAlert: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '12px',
      padding: '12px 16px',
      marginBottom: '20px',
      color: '#ef4444',
      fontSize: '13px',
      fontWeight: '500',
    },
    errorIcon: {
      fontSize: '16px',
      flexShrink: 0,
    },
    inputGroup: {
      marginBottom: '20px',
    },
    inputLabel: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      color: isDark ? '#cbd5e1' : '#475569',
      marginBottom: '8px',
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    inputIcon: {
      position: 'absolute',
      left: '14px',
      fontSize: '16px',
      color: isDark ? '#64748b' : '#94a3b8',
      pointerEvents: 'none',
    },
    input: {
      width: '100%',
      padding: '12px 14px 12px 44px',
      borderRadius: '12px',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      color: isDark ? '#e2e8f0' : '#1e293b',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s ease',
      fontFamily: "'Inter', sans-serif",
    },
    submitButton: {
      width: '100%',
      padding: '14px',
      borderRadius: '12px',
      border: 'none',
      background: loading
        ? 'linear-gradient(135deg, #94a3b8, #94a3b8)'
        : 'linear-gradient(135deg, #14b8a6, #0891b2)',
      color: '#fff',
      fontSize: '15px',
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: loading ? 'none' : '0 4px 16px rgba(20, 184, 166, 0.3)',
      marginTop: '8px',
    },
    spinner: {
      width: '18px',
      height: '18px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: '#fff',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    },
    dividerSection: {
      display: 'flex',
      justifyContent: 'center',
      gap: '6px',
      marginTop: '24px',
      marginBottom: '24px',
    },
    linkCenter: {
      display: 'flex',
      justifyContent: 'center',
    },
    link: {
      color: '#14b8a6',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'color 0.2s ease',
    },
    backLink: {
      color: isDark ? '#64748b' : '#94a3b8',
      textDecoration: 'none',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'color 0.2s ease',
    },
    demoCard: (account) => ({
      background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.7)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      borderRadius: '14px',
      padding: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    }),
    demoIcon: (color) => ({
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      background: `${color}15`,
      border: `1px solid ${color}30`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      flexShrink: 0,
    }),
    demoRole: {
      fontSize: '14px',
      fontWeight: '600',
      color: isDark ? '#e2e8f0' : '#1e293b',
      marginBottom: '4px',
    },
    demoCreds: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '12px',
      color: isDark ? '#94a3b8' : '#64748b',
      lineHeight: '1.5',
    },
    demoBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(8, 145, 178, 0.1))',
      border: '1px solid rgba(20, 184, 166, 0.2)',
      borderRadius: '100px',
      padding: '6px 16px',
      marginBottom: '20px',
    },
    pulseDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#14b8a6',
      animation: 'pulse 2s ease-in-out infinite',
    },
    demoBadgeText: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#14b8a6',
      letterSpacing: '0.5px',
    },
    demoHeading: {
      fontSize: '22px',
      fontWeight: '700',
      color: isDark ? '#f1f5f9' : '#0f172a',
      marginBottom: '6px',
    },
    demoSubtitle: {
      fontSize: '14px',
      color: isDark ? '#94a3b8' : '#64748b',
      marginBottom: '24px',
    },
    demoCardsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    divider: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    },
    dividerLine: {
      width: '1px',
      height: '60px',
      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    },
  };

  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }
        .demo-card:hover { transform: translateX(6px); }
        .input-focus:focus { border-color: #14b8a6 !important; box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1) !important; }
        .submit-hover:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(20, 184, 166, 0.4) !important; }
        .link-hover:hover { color: #0d9488 !important; }
        .back-hover:hover { color: #475569 !important; }
        @media (max-width: 900px) {
          .login-split { flex-direction: column !important; }
          .login-split > div { flex: 1 1 100% !important; }
        }
      `}</style>
      <div style={styles.container} className="login-split">
        <div style={styles.bgOrb1} />
        <div style={styles.bgOrb2} />

        <button
          style={styles.themeToggle}
          onClick={toggleTheme}
          title="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        <div style={styles.leftPanel}>
          <div style={styles.loginCard}>
            <div style={styles.logoSection}>
              <div style={styles.logoIcon}>💧</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={styles.logoText}>AquaManager</span>
                <span style={styles.proBadge}>PRO</span>
              </div>
            </div>

            <h1 style={styles.heading}>Welcome back</h1>
            <p style={styles.subtitle}>Sign in to your account</p>

            {error && (
              <div style={styles.errorAlert}>
                <span style={styles.errorIcon}>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Email address</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={styles.input}
                    className="input-focus"
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Password</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    style={styles.input}
                    className="input-focus"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={styles.submitButton}
                className="submit-hover"
              >
                {loading ? (
                  <>
                    <div style={styles.spinner} />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div style={{ marginTop: '28px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b' }}>
                Don't have an account?{' '}
                <Link to="/register" className="link-hover" style={styles.link}>
                  Register
                </Link>
              </p>
            </div>

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Link to="/" className="back-hover" style={styles.backLink}>
                ← Back to home
              </Link>
            </div>
          </div>
        </div>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={{
            fontSize: '11px',
            color: isDark ? '#475569' : '#94a3b8',
            fontWeight: '500',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            padding: '8px 0',
          }}>OR</span>
          <div style={styles.dividerLine} />
        </div>

        <div style={styles.rightPanel}>
          <div style={{ width: '100%', maxWidth: '440px' }}>
            <div style={styles.demoBadge}>
              <div style={styles.pulseDot} />
              <span style={styles.demoBadgeText}>Demo Access</span>
            </div>

            <h2 style={styles.demoHeading}>Try with demo credentials</h2>
            <p style={styles.demoSubtitle}>Click any account below to auto-fill and sign in instantly.</p>

            <div style={styles.demoCardsContainer}>
              {demoAccounts.map((account) => (
                <div
                  key={account.role}
                  style={{
                    ...styles.demoCard(account),
                    borderColor: hoveredCard === account.role ? account.border : undefined,
                    transform: hoveredCard === account.role ? 'translateX(6px)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                  className="demo-card"
                  onMouseEnter={() => setHoveredCard(account.role)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleDemoClick(account)}
                >
                  <div style={styles.demoIcon(account.color)}>
                    {account.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={styles.demoRole}>{account.role}</div>
                    <div style={styles.demoCreds}>
                      {account.email}<br />
                      {account.password}
                    </div>
                  </div>
                  <span style={{
                    color: isDark ? '#475569' : '#94a3b8',
                    fontSize: '16px',
                    transition: 'color 0.2s',
                    color: hoveredCard === account.role ? account.color : undefined,
                  }}>→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
