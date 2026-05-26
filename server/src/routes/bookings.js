import express from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';
import { notify } from '../notify.js';

export const bookingsRouter = express.Router();

const makeReference = () =>
  `CC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

const fetchBooking = (id) =>
  db
    .prepare(
      `SELECT b.*, c.owner_user_id AS ownerId, c.name AS creativeName
       FROM bookings b JOIN creatives c ON c.id = b.creative_id
       WHERE b.id = ?`
    )
    .get(id);

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

  const creative = db
    .prepare('SELECT name, owner_user_id FROM creatives WHERE id = ?')
    .get(creativeId);
  if (creative?.owner_user_id) {
    notify(creative.owner_user_id, {
      type: 'new_booking',
      title: 'New booking received 🎉',
      body: `${name} booked you for ${date}.`,
      data: { bookingId: booking.id, creativeId },
    });
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

/** Shared handler for owner-driven status changes (confirm/decline/complete). */
const ownerTransition = (from, to, notifyType, makeMessage) => (req, res) => {
  const booking = fetchBooking(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.ownerId !== req.userId) {
    return res.status(403).json({ error: 'You can only manage bookings for your own profile' });
  }
  if (!from.includes(booking.status)) {
    return res.status(409).json({ error: `Cannot ${to} a booking that is ${booking.status}` });
  }

  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(to, booking.id);
  notify(booking.user_id, {
    type: notifyType,
    title: makeMessage(booking).title,
    body: makeMessage(booking).body,
    data: { bookingId: booking.id, creativeId: booking.creative_id },
  });
  res.json({ id: booking.id, status: to });
};

// POST /api/bookings/:id/confirm — creative confirms a paid booking
bookingsRouter.post(
  '/:id/confirm',
  requireAuth,
  ownerTransition(['paid'], 'confirmed', 'booking_confirmed', (b) => ({
    title: 'Booking confirmed ✅',
    body: `${b.creativeName} confirmed your booking for ${b.date}.`,
  }))
);

// POST /api/bookings/:id/decline — creative declines a paid booking
bookingsRouter.post(
  '/:id/decline',
  requireAuth,
  ownerTransition(['paid'], 'declined', 'booking_declined', (b) => ({
    title: 'Booking declined',
    body: `${b.creativeName} can't take your booking for ${b.date}. A refund would follow in production.`,
  }))
);

// POST /api/bookings/:id/complete — creative marks a confirmed booking complete
bookingsRouter.post(
  '/:id/complete',
  requireAuth,
  ownerTransition(['confirmed'], 'completed', 'booking_completed', (b) => ({
    title: 'Booking completed 🎬',
    body: `${b.creativeName} marked your booking as complete. Leave a review!`,
  }))
);

// POST /api/bookings/:id/cancel — client cancels their own booking
bookingsRouter.post('/:id/cancel', requireAuth, (req, res) => {
  const booking = fetchBooking(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.user_id !== req.userId) {
    return res.status(403).json({ error: 'You can only cancel your own bookings' });
  }
  if (!['paid', 'confirmed'].includes(booking.status)) {
    return res.status(409).json({ error: `Cannot cancel a booking that is ${booking.status}` });
  }

  db.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").run(booking.id);
  if (booking.ownerId) {
    notify(booking.ownerId, {
      type: 'booking_cancelled',
      title: 'Booking cancelled',
      body: `${booking.name} cancelled their booking for ${booking.date}.`,
      data: { bookingId: booking.id, creativeId: booking.creative_id },
    });
  }
  res.json({ id: booking.id, status: 'cancelled' });
});
