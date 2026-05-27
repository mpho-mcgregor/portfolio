import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api } from '../api/client';
import { CreativeSummary } from '../types';
import { useAuth } from './AuthContext';

interface AppState {
  creatives: CreativeSummary[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  likedIds: string[];
  isLiked: (id: string) => boolean;
  /** Toggles a like. Throws if the user is not authenticated. */
  toggleLike: (id: string) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [creatives, setCreatives] = useState<CreativeSummary[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCreatives();
      setCreatives(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load creatives');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Keep liked ids in sync with the signed-in user.
  useEffect(() => {
    if (!isAuthenticated) {
      setLikedIds([]);
      return;
    }
    api.getLikedIds().then((r) => setLikedIds(r.likedIds)).catch(() => setLikedIds([]));
  }, [isAuthenticated]);

  const isLiked = useCallback((id: string) => likedIds.includes(id), [likedIds]);

  const toggleLike = useCallback(async (id: string) => {
    const { liked, likes } = await api.toggleLike(id);
    setLikedIds((prev) => (liked ? [...prev, id] : prev.filter((x) => x !== id)));
    setCreatives((prev) => prev.map((c) => (c.id === id ? { ...c, likes } : c)));
  }, []);

  const value = useMemo(
    () => ({ creatives, loading, error, refresh, likedIds, isLiked, toggleLike }),
    [creatives, loading, error, refresh, likedIds, isLiked, toggleLike]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppState => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
