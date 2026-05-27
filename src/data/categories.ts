import { Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'photography', name: 'Photography', icon: 'camera' },
  { id: 'videography', name: 'Videography', icon: 'videocam' },
  { id: 'music-dj', name: 'Music & DJ', icon: 'musical-notes' },
  { id: 'makeup', name: 'Makeup & Beauty', icon: 'color-palette' },
  { id: 'design', name: 'Graphic Design', icon: 'brush' },
  { id: 'fashion', name: 'Fashion & Styling', icon: 'shirt' },
  { id: 'events', name: 'Event Planning', icon: 'sparkles' },
  { id: 'art', name: 'Painting & Art', icon: 'image' },
  { id: 'content', name: 'Content Creation', icon: 'phone-portrait' },
  { id: 'dance', name: 'Dance & Performance', icon: 'body' },
];

export const getCategory = (id: string): Category | undefined =>
  CATEGORIES.find((c) => c.id === id);
