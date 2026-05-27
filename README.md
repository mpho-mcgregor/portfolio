# CreativeConnect SA

A cross-platform mobile app that brings South Africa's creatives together in one
place. Browse photographers, videographers, DJs, makeup artists, designers and
more across all **9 provinces**, view their services and prices, like your
favourites, read reviews, and request a booking.

Built with **React Native + Expo** (the same codebase runs on **iOS, Android and
the web**) and a **Node + Express + SQLite** REST API backend.

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
- **User accounts** – sign up / log in with email and password (JWT auth).
- **Likes** – tap the heart to like a creative; saved per-user to your
  Favourites tab.
- **Reviews** – read ratings and reviews, and add your own (signed in).
- **Bookings & mock checkout** – pick a service, choose a date, then pay through
  a simulated card checkout (no real charge). Paid bookings, amounts and a
  reference number appear on the Account tab.
- **Creative dashboard** – any user can create their own creative profile
  (two-sided marketplace) and get a dashboard with stats (bookings, revenue,
  rating, likes), plus **edit their profile and services** at any time.
- **Full booking lifecycle** – creatives can **confirm**, **decline** or
  **mark complete**; clients can **cancel**. Status is shown on both sides.
- **Notification center** – an in-app feed (with unread badge on the home bell)
  records every booking event and new review, complemented by push.
- **Push notifications** – the client gets a confirmation notification on
  checkout, the creative is pushed when a new booking arrives, and the client is
  pushed again when the creative confirms (Expo push + local notifications).
- **Responsive layout** – adapts to phones, tablets and the web (responsive
  category grid, safe-area handling, keyboard-aware forms).

## Project structure

```
App.tsx                    App entry (providers + navigation)
src/
  api/client.ts            Typed REST client for the backend
  context/AuthContext.tsx  Auth state (login/register/logout, token storage)
  context/AppContext.tsx   Creatives list + likes, backed by the API
  notifications.ts         Push registration + local notification helpers
  data/                    Static reference data (provinces, categories)
  navigation/              Bottom tabs + stack navigation
  screens/                 Home, Browse, Favourites, Account, Detail, Booking,
                           Checkout, Dashboard, BecomeCreative, EditProfile,
                           Notifications, Auth
  components/              Reusable UI (cards, chips, stars, like button)
  theme.ts                 Colours, spacing, radii

server/                    Node + Express + SQLite REST API
  src/index.js             API entry / route wiring
  src/db.js                SQLite connection + schema
  src/seed.js + seedData.js  Sample data seeding
  src/auth.js              JWT signing + auth middleware
  src/push.js              Best-effort Expo push sending
  src/notify.js            Persist in-app notification + push
  src/routes/              auth, creatives, bookings, me (dashboard), notifications
```

## Getting started

You need [Node.js](https://nodejs.org/) (18+) installed. The app and the backend
API run together.

### Quick start (one command)

```bash
npm run setup      # installs app + server dependencies (first time only)
npm run dev        # starts the API and the Expo app together
```

`npm run dev` runs the backend (http://localhost:4000) and the Expo dev server
side by side; press `Ctrl+C` once to stop both.

### Manual (two terminals)

If you prefer to run them separately:

```bash
# Terminal 1 — backend
cd server && npm install && npm start

# Terminal 2 — app (from the project root)
npm install && npm start
```

### Opening the app

- **On your iPhone/Android:** install the **Expo Go** app, then scan the QR code
  in the terminal. A phone can't reach `localhost` on your computer, so point it
  at your computer's LAN IP (find it with `ipconfig getifaddr en0` on macOS):
  ```bash
  EXPO_PUBLIC_API_URL=http://192.168.0.10:4000 npm run dev
  ```
  (replace `192.168.0.10` with your machine's IP on the same Wi-Fi).
- **Android emulator:** press `a` (or `npm run android`).
- **iOS simulator (macOS):** press `i` (or `npm run ios`).
- **Web browser:** press `w` (or `npm run web`). `localhost` works here.

## API overview

| Method | Endpoint                       | Auth | Description                       |
| ------ | ------------------------------ | ---- | --------------------------------- |
| GET    | `/api/categories`              | –    | List categories                  |
| GET    | `/api/provinces`               | –    | List provinces                   |
| GET    | `/api/creatives`               | –    | List creatives (`?category=&province=&q=`) |
| GET    | `/api/creatives/:id`           | –    | Full profile + services + reviews |
| POST   | `/api/creatives/:id/like`      | ✓    | Toggle like                       |
| POST   | `/api/creatives/:id/reviews`   | ✓    | Add a review                      |
| POST   | `/api/auth/register`           | –    | Create account, returns JWT       |
| POST   | `/api/auth/login`              | –    | Log in, returns JWT               |
| GET    | `/api/auth/me`                 | ✓    | Current user                      |
| GET    | `/api/auth/likes`              | ✓    | IDs the user has liked            |
| POST   | `/api/auth/push-token`         | ✓    | Register device push token        |
| GET    | `/api/bookings`                | ✓    | Current user's bookings           |
| POST   | `/api/bookings`                | ✓    | Create a booking request          |
| POST   | `/api/bookings/:id/confirm`    | ✓    | Creative confirms a booking       |
| POST   | `/api/bookings/:id/decline`    | ✓    | Creative declines a booking       |
| POST   | `/api/bookings/:id/complete`   | ✓    | Creative marks booking complete   |
| POST   | `/api/bookings/:id/cancel`     | ✓    | Client cancels their booking      |
| GET    | `/api/me/creative`             | ✓    | Own creative profile + stats      |
| POST   | `/api/me/creative`             | ✓    | Create own creative profile       |
| PUT    | `/api/me/creative`             | ✓    | Edit own profile fields           |
| POST   | `/api/me/creative/services`    | ✓    | Add a service                     |
| PUT    | `/api/me/creative/services/:id`| ✓    | Edit a service                    |
| DELETE | `/api/me/creative/services/:id`| ✓    | Remove a service                  |
| GET    | `/api/me/creative/bookings`    | ✓    | Bookings for own profile          |
| GET    | `/api/notifications`           | ✓    | In-app notification feed          |
| GET    | `/api/notifications/unread-count` | ✓ | Unread notification count         |
| POST   | `/api/notifications/read`      | ✓    | Mark all notifications read       |

Data is stored in a local SQLite file (`server/data.db`), created and seeded
automatically on first run. Set `JWT_SECRET` and `PORT` env vars to configure
the server in production.

## Push notifications

Notifications use [Expo Notifications](https://docs.expo.dev/push-notifications/overview/).
The in-app confirmation on checkout is a **local** notification and works in
Expo Go on a physical device. **Remote** push (new-booking alerts to the
creative, confirmation alerts back to the client) requires a real device and an
EAS `projectId`; on simulators/web no token is issued and push sends are
skipped gracefully. Build a dev/EAS build and the wiring works end to end.
