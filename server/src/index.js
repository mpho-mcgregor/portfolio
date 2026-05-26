import express from 'express';
import cors from 'cors';
import { db } from './db.js';
import { seedIfEmpty } from './seed.js';
import { authRouter } from './routes/authRoutes.js';
import { creativesRouter } from './routes/creatives.js';
import { bookingsRouter } from './routes/bookings.js';
import { CATEGORIES, PROVINCES } from './seedData.js';

const PORT = process.env.PORT || 4000;

seedIfEmpty();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/categories', (req, res) => res.json(CATEGORIES));
app.get('/api/provinces', (req, res) => res.json(PROVINCES));

app.use('/api/auth', authRouter);
app.use('/api/creatives', creativesRouter);
app.use('/api/bookings', bookingsRouter);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  const n = db.prepare('SELECT COUNT(*) AS n FROM creatives').get().n;
  console.log(`CreativeConnect API running on http://localhost:${PORT} (${n} creatives seeded)`);
});
