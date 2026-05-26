import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

export const notificationsRouter = express.Router();

const serialize = (row) => ({
  id: row.id,
  type: row.type,
  title: row.title,
  body: row.body,
  data: JSON.parse(row.data || '{}'),
  read: !!row.read,
  createdAt: row.created_at,
});

// GET /api/notifications — newest first
notificationsRouter.get('/', requireAuth, (req, res) => {
  const rows = db
    .prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 100')
    .all(req.userId);
  res.json(rows.map(serialize));
});

// GET /api/notifications/unread-count
notificationsRouter.get('/unread-count', requireAuth, (req, res) => {
  const row = db
    .prepare('SELECT COUNT(*) AS n FROM notifications WHERE user_id = ? AND read = 0')
    .get(req.userId);
  res.json({ count: row.n });
});

// POST /api/notifications/read — mark all as read
notificationsRouter.post('/read', requireAuth, (req, res) => {
  db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').run(req.userId);
  res.json({ ok: true });
});
