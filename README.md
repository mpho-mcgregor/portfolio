# CreativeConnect SA

A cross-platform mobile app that brings South Africa's creatives together in one
place. Browse photographers, videographers, DJs, makeup artists, designers and
more across all **9 provinces**, view their services and prices, like your
favourites, read reviews, and request a booking.

Built with **React Native + Expo** so the same codebase runs on **iOS, Android
and the web**.

## Features

- **10 creative categories** – Photography, Videography, Music & DJ, Makeup &
  Beauty, Graphic Design, Fashion & Styling, Event Planning, Painting & Art,
  Content Creation, and Dance & Performance.
- **All 9 SA provinces** – filter creatives by Gauteng, Western Cape,
  KwaZulu-Natal, Eastern Cape, Free State, Limpopo, Mpumalanga, North West and
  Northern Cape.
- **Search & filters** – combine free-text search with category and province
  filters.
- **Profiles with pricing** – each creative lists their services and prices in
  Rand (ZAR).
- **Likes** – tap the heart to like a creative; saved to your Favourites tab.
- **Reviews** – read ratings and reviews, and add your own.
- **Booking flow** – pick a service, choose a date, and send a booking request.
- **Responsive layout** – adapts to phones, tablets and the web (responsive
  category grid, safe-area handling, keyboard-aware forms).

## Project structure

```
App.tsx                  App entry (providers + navigation)
src/
  data/                  Sample data: provinces, categories, creatives
  context/AppContext.tsx App state: likes, reviews, bookings
  navigation/            Bottom tabs + stack navigation
  screens/               Home, Browse, Favourites, Detail, Booking
  components/            Reusable UI (cards, chips, stars, like button)
  theme.ts               Colours, spacing, radii
```

## Getting started

You need [Node.js](https://nodejs.org/) (18+) installed.

```bash
# 1. Install dependencies
npm install

# 2. Start the Expo dev server
npm start
```

Then open the app in any of these ways:

- **On your phone:** install the **Expo Go** app (iOS App Store / Google Play),
  then scan the QR code shown in the terminal.
- **Android emulator:** press `a` in the terminal (or run `npm run android`).
- **iOS simulator (macOS):** press `i` (or run `npm run ios`).
- **Web browser:** press `w` (or run `npm run web`).

> The sample data lives in `src/data/`. Replace it with calls to a real backend
> to take the app to production.
