import express from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

export const bookingsRouter = express.Router();

const makeReference = () =>
  `CC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

// GET /api/bookings — current user's bookings
bookingsRouter.get('/', requireAuth, (req, res) => {
  const rows = db
    .prepare(
      `SELECT b.id, b.date, b.name, b.amount, b.status, b.reference, b.created_at AS createdAt,
              c.id AS creativeId, c.name AS creativeName, c.city, c.province,
              s.id AS serviceId, s.title AS serviceTitle, s.price AS servicePrice
       FROM bookings b
       JOIN creatives c ON c.id = b.creative_id
       JOIN services s ON s.id = b.service_id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`
    )
    .all(req.userId);
  res.json(rows);
});

// POST /api/bookings — create a booking and record its (mock) payment
bookingsRouter.post('/', requireAuth, (req, res) => {
  const creativeId = String(req.body.creativeId || '');
  const serviceId = String(req.body.serviceId || '');
  const date = String(req.body.date || '').trim();
  const name = String(req.body.name || '').trim();
  const paid = req.body.paid === true;

  if (!creativeId || !serviceId || !date || !name) {
    return res.status(400).json({ error: 'creativeId, serviceId, date and name are required' });
  }

  const service = db
    .prepare('SELECT id, price FROM services WHERE id = ? AND creative_id = ?')
    .get(serviceId, creativeId);
  if (!service) return res.status(400).json({ error: 'Invalid service for this creative' });

  const booking = {
    id: randomUUID(),
    user_id: req.userId,
    creative_id: creativeId,
    service_id: serviceId,
    name,
    date,
    amount: service.price,
    status: paid ? 'paid' : 'pending',
    reference: makeReference(),
    created_at: new Date().toISOString(),
  };
  db.prepare(
    `INSERT INTO bookings (id, user_id, creative_id, service_id, name, date, amount, status, reference, created_at)
     VALUES (@id, @user_id, @creative_id, @service_id, @name, @date, @amount, @status, @reference, @created_at)`
  ).run(booking);

  res.status(201).json({
    id: booking.id,
    date: booking.date,
    name: booking.name,
    amount: booking.amount,
    status: booking.status,
    reference: booking.reference,
  });
});
