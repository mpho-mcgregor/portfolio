import express from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';
import { notifyUser } from '../push.js';

export const bookingsRouter = express.Router();

const makeReference = () =>
  `CC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

// GET /api/bookings — current user's bookings (as a client)
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

  // Notify the creative's owner that a new booking has come in.
  const creative = db
    .prepare('SELECT name, owner_user_id FROM creatives WHERE id = ?')
    .get(creativeId);
  if (creative?.owner_user_id) {
    notifyUser(
      creative.owner_user_id,
      'New booking received 🎉',
      `${name} booked you for ${date}.`,
      { type: 'new_booking', bookingId: booking.id }
    );
  }

  res.status(201).json({
    id: booking.id,
    date: booking.date,
    name: booking.name,
    amount: booking.amount,
    status: booking.status,
    reference: booking.reference,
  });
});

// POST /api/bookings/:id/confirm — creative confirms a booking made for them
bookingsRouter.post('/:id/confirm', requireAuth, (req, res) => {
  const booking = db
    .prepare(
      `SELECT b.*, c.owner_user_id AS ownerId, c.name AS creativeName
       FROM bookings b JOIN creatives c ON c.id = b.creative_id
       WHERE b.id = ?`
    )
    .get(req.params.id);

  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.ownerId !== req.userId) {
    return res.status(403).json({ error: 'You can only confirm bookings for your own profile' });
  }

  db.prepare("UPDATE bookings SET status = 'confirmed' WHERE id = ?").run(booking.id);

  // Notify the client that their booking is confirmed.
  notifyUser(
    booking.user_id,
    'Booking confirmed ✅',
    `${booking.creativeName} confirmed your booking for ${booking.date}.`,
    { type: 'booking_confirmed', bookingId: booking.id }
  );

  res.json({ id: booking.id, status: 'confirmed' });
});
