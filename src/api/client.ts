import {
  Booking,
  Category,
  CreativeDetail,
  CreativeSummary,
  Province,
  Review,
  User,
} from '../types';

/**
 * Base URL of the CreativeConnect API.
 *
 * Defaults to localhost for simulators and web. When running on a physical
 * device via Expo Go, set EXPO_PUBLIC_API_URL to your computer's LAN IP, e.g.
 * `EXPO_PUBLIC_API_URL=http://192.168.0.10:4000 npm start`.
 */
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

let authToken: string | null = null;
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('Could not reach the server. Is the backend running?', 0);
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(body?.error || `Request failed (${res.status})`, res.status);
  }
  return body as T;
}

const qs = (params: Record<string, string | undefined>) => {
  const entries = Object.entries(params).filter(([, v]) => v) as [string, string][];
  return entries.length ? `?${new URLSearchParams(entries).toString()}` : '';
};

export const api = {
  // Reference data
  getCategories: () => request<Category[]>('/api/categories'),
  getProvinces: () => request<Province[]>('/api/provinces'),

  // Creatives
  getCreatives: (filters: { category?: string; province?: string; q?: string } = {}) =>
    request<CreativeSummary[]>(`/api/creatives${qs(filters)}`),
  getCreative: (id: string) => request<CreativeDetail>(`/api/creatives/${id}`),
  toggleLike: (id: string) =>
    request<{ liked: boolean; likes: number }>(`/api/creatives/${id}/like`, { method: 'POST' }),
  addReview: (id: string, review: { rating: number; comment: string }) =>
    request<Review>(`/api/creatives/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    }),

  // Auth
  register: (data: { name: string; email: string; password: string }) =>
    request<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  me: () => request<{ user: User }>('/api/auth/me'),
  getLikedIds: () => request<{ likedIds: string[] }>('/api/auth/likes'),

  // Bookings
  getBookings: () => request<Booking[]>('/api/bookings'),
  createBooking: (data: { creativeId: string; serviceId: string; date: string; name: string }) =>
    request<{ id: string; date: string; name: string }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export { ApiError };
