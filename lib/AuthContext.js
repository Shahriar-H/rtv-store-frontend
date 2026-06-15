'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('robo_token');
    if (token) {
      api.getMe().then(setUser).catch(() => localStorage.removeItem('robo_token')).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('robo_token', res.token);
    setUser(res.user);
    return res;
  }, []);

  const register = useCallback(async (data) => {
    const res = await api.register(data);
    localStorage.setItem('robo_token', res.token);
    setUser(res.user);
    return res;
  }, []);

  const logout = useCallback(async () => {
    try { await api.logout(); } catch {}
    localStorage.removeItem('robo_token');
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data) => {
    const updated = await api.updateProfile(data);
    setUser(updated);
    return updated;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
