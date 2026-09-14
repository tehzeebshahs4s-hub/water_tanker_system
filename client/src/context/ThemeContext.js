import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const themes = {
  dark: {
    bg: '#031220',
    bg2: '#061826',
    bg3: '#0a2030',
    card: '#0d2536',
    border: 'rgba(34,211,238,0.12)',
    text: '#e6f2f8',
    textSecondary: '#94a3b8',
    muted: '#94a3b8',
    dim: '#64748b',
    inputBg: '#031220',
    accent: '#22d3ee',
    accentRgb: '34,211,238',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    hover: 'rgba(255,255,255,0.05)',
    mode: 'dark',
  },
  light: {
    bg: '#f0f4f8',
    bg2: '#ffffff',
    bg3: '#f8fafc',
    card: '#ffffff',
    border: 'rgba(15,23,41,0.08)',
    text: '#0f1729',
    textSecondary: '#64748b',
    muted: '#64748b',
    dim: '#94a3b8',
    inputBg: '#ffffff',
    accent: '#0891b2',
    accentRgb: '8,145,178',
    success: '#16a34a',
    warning: '#d97706',
    error: '#dc2626',
    info: '#2563eb',
    hover: 'rgba(0,0,0,0.04)',
    mode: 'light',
  },
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem('aqua_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch(e) {}
    return 'dark';
  });

  const toggleTheme = () => {
    setMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('aqua_theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    document.body.style.background = themes[mode].bg;
    document.body.style.color = themes[mode].text;
    const root = document.getElementById('root');
    if (root) root.style.background = themes[mode].bg;
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ theme: themes[mode], themeName: mode, colors: themes[mode], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
