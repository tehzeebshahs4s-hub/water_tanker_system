import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  { email: 'admin@aqua.com', password: 'admin123', name: 'Admin', role: 'admin', avatar: 'AH' },
  { email: 'dispatcher@aqua.com', password: 'dispatch123', name: 'Dispatcher', role: 'dispatcher', avatar: 'MD' },
  { email: 'driver@aqua.com', password: 'driver123', name: 'Driver', role: 'driver', avatar: 'HR' },
  { email: 'customer@aqua.com', password: 'customer123', name: 'Customer', role: 'customer', avatar: 'FK' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('aqua_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch(e) { localStorage.removeItem('aqua_user'); }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const userData = { ...found };
      delete userData.password;
      setUser(userData);
      localStorage.setItem('aqua_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (name, email, password, phone) => {
    const exists = DEMO_USERS.find(u => u.email === email);
    if (exists) return { success: false, error: 'Email already registered' };
    const newUser = { email, name, role: 'customer', avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2), phone };
    DEMO_USERS.push({ ...newUser, password });
    setUser(newUser);
    localStorage.setItem('aqua_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aqua_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, demoUsers: DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { DEMO_USERS };
