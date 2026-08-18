'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '../types/user';
import { fetchApi } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginAsGuest: () => Promise<void>;
  loginWithGoogle: (payload: { email: string; name: string; avatar?: string; googleId?: string }) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('taskly_token');
    if (!token) {
      setIsLoading(false);
      if (pathname !== '/login') {
        router.replace('/login');
      }
      return;
    }

    try {
      const data = await fetchApi<User>('/auth/me');
      setUser(data);
    } catch (err) {
      console.warn('Session expired, logging out', err);
      localStorage.removeItem('taskly_token');
      setUser(null);
      if (pathname !== '/login') {
        router.replace('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (token: string, userData: User) => {
    localStorage.setItem('taskly_token', token);
    setUser(userData);
    router.push('/tasks');
  };

  const loginAsGuest = async () => {
    setIsLoading(true);
    try {
      let guestId = localStorage.getItem('taskly_guest_id');
      if (!guestId) {
        guestId = Math.random().toString(36).substring(2, 9);
        localStorage.setItem('taskly_guest_id', guestId);
      }

      const res = await fetchApi<{ accessToken: string; user: User }>('/auth/guest', {
        method: 'POST',
        body: JSON.stringify({ guestId, name: 'Dexter' }),
      });

      handleAuthSuccess(res.accessToken, res.user);
    } catch (err) {
      console.error('Guest login failed', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (payload: { email: string; name: string; avatar?: string; googleId?: string }) => {
    setIsLoading(true);
    try {
      const res = await fetchApi<{ accessToken: string; user: User }>('/auth/google', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      handleAuthSuccess(res.accessToken, res.user);
    } catch (err) {
      console.error('Google login failed', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetchApi<{ accessToken: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      handleAuthSuccess(res.accessToken, res.user);
    } catch (err) {
      console.error('Email login failed', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmail = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetchApi<{ accessToken: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      handleAuthSuccess(res.accessToken, res.user);
    } catch (err) {
      console.error('Email registration failed', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      const updated = await fetchApi<User>('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      setUser(prev => (prev ? { ...prev, ...updated } : updated));
    } catch (err) {
      console.error('Profile update failed', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('taskly_token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginAsGuest,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
