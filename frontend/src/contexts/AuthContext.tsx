'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '@/types';
import { mockUser } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth status from HttpOnly cookie
    const savedAuth = sessionStorage.getItem('voynex_auth');
    if (savedAuth) {
      // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
      setUser(JSON.parse(savedAuth));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const role: Role = email.includes('admin') ? 'admin' : email.includes('agency') ? 'agency' : 'user';
    const loggedInUser: User = { ...mockUser, email, role, name: email.split('@')[0] };
    setUser(loggedInUser);
    sessionStorage.setItem('voynex_auth', JSON.stringify(loggedInUser));
    setLoading(false);
    return loggedInUser;
  };

  const signup = async (name: string, email: string, _password: string, role: Role) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const newUser: User = { ...mockUser, _id: `u_${Date.now()}`, name, email, role };
    setUser(newUser);
    sessionStorage.setItem('voynex_auth', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('voynex_auth');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
