import express from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';
import { notify } from '../notify.js';

export const creativesRouter = express.Router();

const ratingFor = (creativeId) => {
  const row = db
    .prepare('SELECT AVG(rating) AS avg, COUNT(*) AS n FROM reviews WHERE creative_id = ?')
    .get(creativeId);
  return {
    rating: row.n ? Math.round(row.avg * 10) / 10 : 0,
    reviewCount: row.n,
  };
};

const likesFor = (creativeId) => {
  const base = db
    .prepare('SELECT base_likes AS n FROM creative_likes WHERE creative_id = ?')
    .get(creativeId);
  const added = db
    .prepare('SELECT COUNT(*) AS n FROM likes WHERE creative_id = ?')
    .get(creativeId);
  return (base?.n || 0) + added.n;
};

const toSummary = (row) => {
  const { rating, reviewCount } = ratingFor(row.id);
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    categoryId: row.category_id,
    province: row.province,
    city: row.city,
    avatar: row.avatar,
    startingPrice: row.starting_price,
    bio: row.bio,
    rating,
    reviewCount,
    likes: likesFor(row.id),
  };
};

// GET /api/creatives?category=&province=&q=
creativesRouter.get('/', (req, res) => {
  const { category, province, q } = req.query;
  const clauses = [];
  const params = [];
  if (category) { clauses.push('category_id = ?'); params.push(category); }
  if (province) { clauses.push('province = ?'); params.push(province); }
  if (q) {
    clauses.push('(LOWER(name) LIKE ? OR LOWER(tagline) LIKE ? OR LOWER(city) LIKE ?)');
    const like = `%${String(q).toLowerCase()}%`;
    params.push(like, like, like);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const rows = db.prepare(`SELECT * FROM creatives ${where}`).all(...params);
  res.json(rows.map(toSummary));
});

// GET /api/creatives/:id  (full profile with services + reviews)
creativesRouter.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM creatives WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Creative not found' });

  const services = db
    .prepare('SELECT id, title, description, price FROM services WHERE creative_id = ?')
    .all(row.id);
  const reviews = db
    .prepare('SELECT id, author, rating, comment, date FROM reviews WHERE creative_id = ? ORDER BY date DESC')
    .all(row.id);

  res.json({ ...toSummary(row), services, reviews });
});

// POST /api/creatives/:id/reviews   (auth)
creativesRouter.post('/:id/reviews', requireAuth, (req, res) => {
  const creative = db
    .prepare('SELECT id, name, owner_user_id FROM creatives WHERE id = ?')
    .get(req.params.id);
  if (!creative) return res.status(404).json({ error: 'Creative not found' });

  const rating = Number(req.body.rating);
  const comment = String(req.body.comment || '').trim();
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be 1-5' });
  }
  if (!comment) return res.status(400).json({ error: 'Comment is required' });

  const user = db.prepare('SELECT name FROM users WHERE id = ?').get(req.userId);
  const review = {
    id: randomUUID(),
    creative_id: creative.id,
    user_id: req.userId,
    author: user?.name || 'Anonymous',
    rating,
    comment,
    date: new Date().toISOString().slice(0, 10),
  };
  db.prepare(
    `INSERT INTO reviews (id, creative_id, user_id, author, rating, comment, date)
     VALUES (@id, @creative_id, @user_id, @author, @rating, @comment, @date)`
  ).run(review);

  // Don't notify the creative about reviewing themselves.
  if (creative.owner_user_id && creative.owner_user_id !== req.userId) {
    notify(creative.owner_user_id, {
      type: 'new_review',
      title: 'New review ⭐',
      body: `${review.author} rated you ${rating}/5.`,
      data: { creativeId: creative.id },
    });
  }

  res.status(201).json({
    id: review.id,
    author: review.author,
    rating: review.rating,
    comment: review.comment,
    date: review.date,
  });
});

// POST /api/creatives/:id/like   (auth) — toggles like
creativesRouter.post('/:id/like', requireAuth, (req, res) => {
  const creative = db.prepare('SELECT id FROM creatives WHERE id = ?').get(req.params.id);
  if (!creative) return res.status(404).json({ error: 'Creative not found' });

  const existing = db
    .prepare('SELECT 1 FROM likes WHERE user_id = ? AND creative_id = ?')
    .get(req.userId, creative.id);

  if (existing) {
    db.prepare('DELETE FROM likes WHERE user_id = ? AND creative_id = ?').run(req.userId, creative.id);
  } else {
    db.prepare('INSERT INTO likes (user_id, creative_id) VALUES (?, ?)').run(req.userId, creative.id);
  }

  res.json({ liked: !existing, likes: likesFor(creative.id) });
});
