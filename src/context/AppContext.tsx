import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CREATIVES } from '../data/creatives';
import { Creative, Review } from '../types';

interface Booking {
  id: string;
  creativeId: string;
  serviceId: string;
  date: string;
  name: string;
}

interface AppState {
  creatives: Creative[];
  likedIds: string[];
  bookings: Booking[];
  toggleLike: (creativeId: string) => void;
  isLiked: (creativeId: string) => boolean;
  addReview: (creativeId: string, review: Omit<Review, 'id' | 'date'>) => void;
  addBooking: (booking: Omit<Booking, 'id'>) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const averageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [creatives, setCreatives] = useState<Creative[]>(CREATIVES);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const isLiked = useCallback((id: string) => likedIds.includes(id), [likedIds]);

  const toggleLike = useCallback((creativeId: string) => {
    setLikedIds((prev) =>
      prev.includes(creativeId)
        ? prev.filter((id) => id !== creativeId)
        : [...prev, creativeId]
    );
    setCreatives((prev) =>
      prev.map((c) =>
        c.id === creativeId
          ? { ...c, likes: c.likes + (likedIds.includes(creativeId) ? -1 : 1) }
          : c
      )
    );
  }, [likedIds]);

  const addReview = useCallback(
    (creativeId: string, review: Omit<Review, 'id' | 'date'>) => {
      setCreatives((prev) =>
        prev.map((c) => {
          if (c.id !== creativeId) return c;
          const newReview: Review = {
            ...review,
            id: `rv-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
          };
          const reviews = [newReview, ...c.reviews];
          return { ...c, reviews, rating: averageRating(reviews) };
        })
      );
    },
    []
  );

  const addBooking = useCallback((booking: Omit<Booking, 'id'>) => {
    setBookings((prev) => [{ ...booking, id: `bk-${Date.now()}` }, ...prev]);
  }, []);

  const value = useMemo(
    () => ({ creatives, likedIds, bookings, toggleLike, isLiked, addReview, addBooking }),
    [creatives, likedIds, bookings, toggleLike, isLiked, addReview, addBooking]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppState => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
