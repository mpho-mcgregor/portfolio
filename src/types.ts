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

export interface Creative {
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
  likes: number;
  bio: string;
  services: Service[];
  reviews: Review[];
}
