import { randomUUID } from 'crypto';
import { db } from './db.js';
import { notifyUser } from './push.js';

/**
 * Records an in-app notification for a user and sends a best-effort push.
 * The in-app row always persists; push delivery may be skipped (no token,
 * offline) without affecting the caller.
 */
export function notify(userId, { type, title, body, data = {} }) {
  if (!userId) return;
  db.prepare(
    `INSERT INTO notifications (id, user_id, type, title, body, data, read, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 0, ?)`
  ).run(randomUUID(), userId, type, title, body, JSON.stringify(data), new Date().toISOString());

  notifyUser(userId, title, body, data);
}
