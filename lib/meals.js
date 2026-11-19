import sql from 'better-sqlite3';
import path from 'path';

const db = sql(path.join(process.cwd(), 'meals.db'));

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // throw new Error('Loading meals failed');
  return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
  let slug = meal.title.toLowerCase().replace(/ /g, '-');
  const existing = db.prepare('SELECT slug FROM meals WHERE slug = ?').get(slug);
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }
  meal.slug = slug;
  const stmt = db.prepare(`
    INSERT INTO meals (title, summary, instructions, image, creator, creator_email, slug)
    VALUES (@title, @summary, @instructions, @image, @creator, @creator_email, @slug)
  `);
  stmt.run(meal);
}