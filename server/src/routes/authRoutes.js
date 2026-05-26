import express from 'express';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { db } from '../db.js';
import { signToken, requireAuth } from '../auth.js';

export const authRouter = express.Router();

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });

// POST /api/auth/register
authRouter.post('/register', (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const exists = db.prepare('SELECT 1 FROM users WHERE email = ?').get(email);
  if (exists) return res.status(409).json({ error: 'An account with that email already exists' });

  const user = {
    id: randomUUID(),
    name,
    email,
    password_hash: bcrypt.hashSync(password, 10),
    created_at: new Date().toISOString(),
  };
  db.prepare(
    'INSERT INTO users (id, name, email, password_hash, created_at) VALUES (@id, @name, @email, @password_hash, @created_at)'
  ).run(user);

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

// POST /api/auth/login
authRouter.post('/login', (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({ token: signToken(user), user: publicUser(user) });
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

// GET /api/auth/likes — ids the current user has liked
authRouter.get('/likes', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT creative_id FROM likes WHERE user_id = ?').all(req.userId);
  res.json({ likedIds: rows.map((r) => r.creative_id) });
});

// POST /api/auth/push-token — register/clear the device's Expo push token
authRouter.post('/push-token', requireAuth, (req, res) => {
  const token = req.body.token ? String(req.body.token) : null;
  db.prepare('UPDATE users SET push_token = ? WHERE id = ?').run(token, req.userId);
  res.json({ ok: true });
});
