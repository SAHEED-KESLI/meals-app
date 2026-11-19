import fs from 'node:fs/promises';
import path from 'path';

import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

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
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  // Handle duplicate slugs
  const existing = db.prepare('SELECT slug FROM meals WHERE slug = ?').get(meal.slug);
  if (existing) {
    meal.slug = `${meal.slug}-${Date.now()}`;
  }

  let filename;
  if (meal.image && meal.image.size > 0) {
    const extension = meal.image.name.split('.').pop();
    filename = `${meal.slug}.${extension}`;
    const filepath = path.join(process.cwd(), 'public', 'images', filename);
    const buffer = Buffer.from(await meal.image.arrayBuffer());
    await fs.writeFile(filepath, buffer);
    meal.image = `/images/${filename}`;
  } else {
    meal.image = '';
  }

  db.prepare(`
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
  `).run(meal);
}