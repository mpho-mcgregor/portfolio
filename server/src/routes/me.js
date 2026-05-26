import express from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

export const meRouter = express.Router();

const statsFor = (creativeId) => {
  const rating = db
    .prepare('SELECT AVG(rating) AS avg, COUNT(*) AS n FROM reviews WHERE creative_id = ?')
    .get(creativeId);
  const base = db
    .prepare('SELECT base_likes AS n FROM creative_likes WHERE creative_id = ?')
    .get(creativeId);
  const added = db.prepare('SELECT COUNT(*) AS n FROM likes WHERE creative_id = ?').get(creativeId);
  const bookings = db
    .prepare(
      `SELECT COUNT(*) AS n,
              COALESCE(SUM(amount), 0) AS revenue,
              SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS awaiting
       FROM bookings WHERE creative_id = ?`
    )
    .get(creativeId);
  return {
    rating: rating.n ? Math.round(rating.avg * 10) / 10 : 0,
    reviewCount: rating.n,
    likes: (base?.n || 0) + added.n,
    bookingCount: bookings.n,
    revenue: bookings.revenue,
    awaitingConfirmation: bookings.awaiting,
  };
};

const ownedCreative = (userId) =>
  db.prepare('SELECT * FROM creatives WHERE owner_user_id = ?').get(userId);

// GET /api/me/creative — the profile owned by the current user (404 if none)
meRouter.get('/creative', requireAuth, (req, res) => {
  const c = ownedCreative(req.userId);
  if (!c) return res.status(404).json({ error: 'No creative profile yet' });

  const services = db
    .prepare('SELECT id, title, description, price FROM services WHERE creative_id = ?')
    .all(c.id);

  res.json({
    id: c.id,
    name: c.name,
    tagline: c.tagline,
    categoryId: c.category_id,
    province: c.province,
    city: c.city,
    avatar: c.avatar,
    startingPrice: c.starting_price,
    bio: c.bio,
    services,
    ...statsFor(c.id),
  });
});

// POST /api/me/creative — create the current user's creative profile
meRouter.post('/creative', requireAuth, (req, res) => {
  if (ownedCreative(req.userId)) {
    return res.status(409).json({ error: 'You already have a creative profile' });
  }

  const name = String(req.body.name || '').trim();
  const tagline = String(req.body.tagline || '').trim();
  const categoryId = String(req.body.categoryId || '');
  const province = String(req.body.province || '').trim();
  const city = String(req.body.city || '').trim();
  const bio = String(req.body.bio || '').trim();
  const services = Array.isArray(req.body.services) ? req.body.services : [];

  if (!name || !tagline || !categoryId || !province || !city || !bio) {
    return res.status(400).json({ error: 'All profile fields are required' });
  }
  if (!db.prepare('SELECT 1 FROM categories WHERE id = ?').get(categoryId)) {
    return res.status(400).json({ error: 'Unknown category' });
  }

  const cleanServices = services
    .map((s) => ({
      title: String(s.title || '').trim(),
      description: String(s.description || '').trim(),
      price: Number(s.price),
    }))
    .filter((s) => s.title && s.description && Number.isFinite(s.price) && s.price > 0);

  if (cleanServices.length === 0) {
    return res.status(400).json({ error: 'Add at least one service with a price' });
  }

  const creativeId = randomUUID();
  const startingPrice = Math.min(...cleanServices.map((s) => s.price));
  const avatar = `https://i.pravatar.cc/400?u=${creativeId}`;

  const create = db.transaction(() => {
    db.prepare(
      `INSERT INTO creatives (id, owner_user_id, name, tagline, category_id, province, city, avatar, starting_price, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(creativeId, req.userId, name, tagline, categoryId, province, city, avatar, startingPrice, bio);
    db.prepare('INSERT INTO creative_likes (creative_id, base_likes) VALUES (?, 0)').run(creativeId);
    const insertService = db.prepare(
      'INSERT INTO services (id, creative_id, title, description, price) VALUES (?, ?, ?, ?, ?)'
    );
    for (const s of cleanServices) {
      insertService.run(randomUUID(), creativeId, s.title, s.description, s.price);
    }
  });
  create();

  res.status(201).json({ id: creativeId });
});

// GET /api/me/creative/bookings — bookings made for the owned profile
meRouter.get('/creative/bookings', requireAuth, (req, res) => {
  const c = ownedCreative(req.userId);
  if (!c) return res.status(404).json({ error: 'No creative profile yet' });

  const rows = db
    .prepare(
      `SELECT b.id, b.date, b.name, b.amount, b.status, b.reference, b.created_at AS createdAt,
              s.title AS serviceTitle
       FROM bookings b JOIN services s ON s.id = b.service_id
       WHERE b.creative_id = ?
       ORDER BY b.created_at DESC`
    )
    .all(c.id);
  res.json(rows);
});
