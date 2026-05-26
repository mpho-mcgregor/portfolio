export type Province =
  | 'Gauteng'
  | 'Western Cape'
  | 'KwaZulu-Natal'
  | 'Eastern Cape'
  | 'Free State'
  | 'Limpopo'
  | 'Mpumalanga'
  | 'North West'
  | 'Northern Cape';

export interface Category {
  id: string;
  name: string;
  /** Ionicons name used for the category badge. */
  icon: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  /** Price in South African Rand (ZAR). */
  price: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

/** List/preview shape returned by GET /api/creatives. */
export interface CreativeSummary {
  id: string;
  name: string;
  tagline: string;
  categoryId: string;
  province: Province;
  city: string;
  avatar: string;
  /** Starting price in ZAR, used for list previews. */
  startingPrice: number;
  rating: number;
  reviewCount: number;
  likes: number;
  bio: string;
}

/** Full profile returned by GET /api/creatives/:id. */
export interface CreativeDetail extends CreativeSummary {
  services: Service[];
  reviews: Review[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export type BookingStatus = 'pending' | 'paid' | 'confirmed';

export interface Booking {
  id: string;
  date: string;
  name: string;
  amount: number;
  status: BookingStatus;
  reference: string;
  creativeId: string;
  creativeName: string;
  city: string;
  province: string;
  serviceId: string;
  serviceTitle: string;
  servicePrice: number;
}

/** A creative's view of a booking made for them (the dashboard). */
export interface OwnerBooking {
  id: string;
  date: string;
  name: string;
  amount: number;
  status: BookingStatus;
  reference: string;
  serviceTitle: string;
  createdAt: string;
}

/** The signed-in user's own creative profile, with dashboard stats. */
export interface OwnerProfile extends CreativeDetail {
  bookingCount: number;
  revenue: number;
  awaitingConfirmation: number;
}

export interface NewCreativeInput {
  name: string;
  tagline: string;
  categoryId: string;
  province: string;
  city: string;
  bio: string;
  services: { title: string; description: string; price: number }[];
}
