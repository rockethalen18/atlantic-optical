'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: { name?: string; email?: string; phone?: string; password?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authAPI.me();
      if (res.success && res.data) {
        setUser(res.data as User);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password);
    if (res.success && res.data) {
      setUser(res.data as User);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authAPI.register(name, email, password);
    if (res.success && res.data) {
      setUser(res.data as User);
    }
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  const updateUser = async (data: { name?: string; email?: string; phone?: string; password?: string }) => {
    const res = await authAPI.update(data);
    if (res.success) {
      await refreshUser();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
