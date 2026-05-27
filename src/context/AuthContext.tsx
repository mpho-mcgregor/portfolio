import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../api/client';
import { registerForPushNotifications } from '../notifications';
import { User } from '../types';

const TOKEN_KEY = 'cc.token';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore a saved session on launch.
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
          setAuthToken(token);
          const { user } = await api.me();
          setUser(user);
          registerForPushNotifications().then((t) => {
            if (t) api.setPushToken(t).catch(() => {});
          });
        }
      } catch {
        await AsyncStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Register this device's push token with the backend (best-effort).
  const syncPushToken = useCallback(async () => {
    const token = await registerForPushNotifications();
    if (token) await api.setPushToken(token).catch(() => {});
  }, []);

  const persist = useCallback(async (token: string, user: User) => {
    setAuthToken(token);
    await AsyncStorage.setItem(TOKEN_KEY, token);
    setUser(user);
    syncPushToken();
  }, [syncPushToken]);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await api.login({ email, password });
    await persist(token, user);
  }, [persist]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { token, user } = await api.register({ name, email, password });
    await persist(token, user);
  }, [persist]);

  const logout = useCallback(async () => {
    await api.setPushToken(null).catch(() => {});
    setAuthToken(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: !!user, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthState => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
