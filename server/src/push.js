import { db } from './db.js';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

/**
 * Sends an Expo push notification to a user, if they have registered a token.
 * Best-effort: failures (offline, no token, invalid token) are swallowed so a
 * notification never blocks the request that triggered it.
 */
export async function notifyUser(userId, title, body, data = {}) {
  try {
    const row = db.prepare('SELECT push_token FROM users WHERE id = ?').get(userId);
    const token = row?.push_token;
    if (!token || !token.startsWith('ExponentPushToken')) return;

    await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify([{ to: token, title, body, data, sound: 'default' }]),
    });
  } catch (err) {
    console.warn('Push notification failed:', err.message);
  }
}
