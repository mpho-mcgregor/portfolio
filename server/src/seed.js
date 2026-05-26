import { db, initSchema } from './db.js';
import { CATEGORIES, CREATIVES } from './seedData.js';

/**
 * Populates the database with sample categories and creatives. Safe to run more
 * than once: it only seeds when the creatives table is empty.
 */
export function seedIfEmpty() {
  initSchema();
  const count = db.prepare('SELECT COUNT(*) AS n FROM creatives').get().n;
  if (count > 0) return false;

  const insertCategory = db.prepare(
    'INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)'
  );
  const insertCreative = db.prepare(
    `INSERT INTO creatives (id, name, tagline, category_id, province, city, avatar, starting_price, bio)
     VALUES (@id, @name, @tagline, @categoryId, @province, @city, @avatar, @startingPrice, @bio)`
  );
  const insertService = db.prepare(
    `INSERT INTO services (id, creative_id, title, description, price)
     VALUES (?, ?, ?, ?, ?)`
  );
  const insertReview = db.prepare(
    `INSERT INTO reviews (id, creative_id, user_id, author, rating, comment, date)
     VALUES (?, ?, NULL, ?, ?, ?, ?)`
  );
  const insertBaseLikes = db.prepare(
    'INSERT INTO creative_likes (creative_id, base_likes) VALUES (?, ?)'
  );

  const seed = db.transaction(() => {
    for (const cat of CATEGORIES) insertCategory.run(cat.id, cat.name, cat.icon);

    for (const c of CREATIVES) {
      insertCreative.run(c);
      insertBaseLikes.run(c.id, c.likes);
      for (const s of c.services) {
        insertService.run(`${c.id}-${s.id}`, c.id, s.title, s.description, s.price);
      }
      for (const r of c.reviews) {
        insertReview.run(`${c.id}-${r.id}`, c.id, r.author, r.rating, r.comment, r.date);
      }
    }
  });

  seed();
  return true;
}

// Allow running directly: `npm run seed`
if (import.meta.url === `file://${process.argv[1]}`) {
  const seeded = seedIfEmpty();
  console.log(seeded ? 'Database seeded.' : 'Database already has data, skipped.');
}
