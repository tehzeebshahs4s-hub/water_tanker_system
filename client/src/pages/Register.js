import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { themeName, toggleTheme } = useTheme();
  const isDark = themeName === 'dark';
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const th = isDark
    ? { bg: '#031220', card: '#0d2536', border: 'rgba(34,211,238,0.12)', text: '#e6f2f8', muted: '#94a3b8', dim: '#64748b', cyan: '#22d3ee', teal: '#06b6d4', green: '#10b981', red: '#ef4444', inputBg: '#031220' }
    : { bg: '#f0f4f8', card: '#ffffff', border: 'rgba(15,23,41,0.1)', text: '#0f1729', muted: '#64748b', dim: '#94a3b8', cyan: '#0891b2', teal: '#0e7490', green: '#059669', red: '#dc2626', inputBg: '#ffffff' };

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = register(form.name, form.email, form.password, form.phone);
      if (result.success) navigate('/dashboard/');
      else setError(result.error);
      setLoading(false);
    }, 500);
  };

  const inputStyle = { width: '100%', padding: '12px 14px 12px 42px', borderRadius: 10, border: `1px solid ${th.border}`, background: th.inputBg, color: th.text, fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'inherit' };

  return (
    <div style={{ minHeight: '100vh', background: th.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -200, left: -200, width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${th.teal}20, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -150, right: -150, width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${th.green}15, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 100 }}>
        <button onClick={toggleTheme} style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${th.border}`, background: th.card, color: th.muted, cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: '1rem' }}>
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 20, padding: '40px 36px', maxWidth: 480, width: '100%', boxShadow: '0 30px 80px rgba(0,0,0,0.4)', position: 'relative', zIndex: 1 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, textDecoration: 'none' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${th.teal}, ${th.cyan})`, display: 'grid', placeItems: 'center', fontSize: '1.2rem' }}>💧</div>
          <div>
            <span style={{ fontWeight: 900, fontSize: '1.1rem', color: th.text }}>AquaManager</span>
            <span style={{ color: th.cyan, fontWeight: 500, fontSize: '0.7rem', marginLeft: 6 }}>PRO</span>
          </div>
        </Link>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: th.text, marginBottom: 6 }}>Create Account</h1>
        <p style={{ color: th.muted, fontSize: '0.88rem', marginBottom: 24 }}>Join AquaManager to book water tankers</p>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: 10, background: `${th.red}15`, border: `1px solid ${th.red}30`, color: th.red, fontSize: '0.85rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fas fa-exclamation-circle" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { key: 'name', label: 'Full Name', icon: 'fa-user', type: 'text', placeholder: 'Enter your full name' },
            { key: 'email', label: 'Email', icon: 'fa-envelope', type: 'email', placeholder: 'Enter your email' },
            { key: 'phone', label: 'Phone', icon: 'fa-phone', type: 'tel', placeholder: '03XX-XXXXXXX' },
            { key: 'password', label: 'Password', icon: 'fa-lock', type: 'password', placeholder: 'Min 6 characters' },
            { key: 'confirm', label: 'Confirm Password', icon: 'fa-lock', type: 'password', placeholder: 'Repeat password' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: th.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{field.label}</label>
              <div style={{ position: 'relative' }}>
                <i className={`fas ${field.icon}`} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: th.dim, fontSize: '0.85rem' }} />
                <input type={field.type} value={form[field.key]} onChange={e => update(field.key, e.target.value)} placeholder={field.placeholder} required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = th.cyan}
                  onBlur={e => e.target.style.borderColor = th.border} />
              </div>
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${th.teal}, ${th.cyan})`, color: '#fff', fontWeight: 700, fontSize: '0.92rem',
            boxShadow: `0 10px 25px ${th.teal}30`, transition: 'all 0.2s', marginTop: 8,
            opacity: loading ? 0.7 : 1, fontFamily: 'inherit'
          }}>
            {loading ? <><i className="fas fa-spinner fa-spin" /> Creating account...</> : <><i className="fas fa-user-plus" /> Create Account</>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, color: th.muted, fontSize: '0.85rem' }}>
          Already have an account? <Link to="/login" style={{ color: th.cyan, fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <Link to="/" style={{ color: th.muted, fontSize: '0.8rem', textDecoration: 'none' }}><i className="fas fa-arrow-left" /> Back to home</Link>
        </div>
      </div>

      <style>{`input::placeholder { color: #475569 !important; }`}</style>
    </div>
  );
}

export default Register;
