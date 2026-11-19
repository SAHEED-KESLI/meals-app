import fs from 'node:fs/promises';
import path from 'path';
import slugify from 'slugify';
import xss from 'xss';
import pool from './db.js';

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const { rows } = await pool.query('SELECT * FROM meals');
  return rows;
}

export async function getMeal(slug) {
  const { rows } = await pool.query('SELECT * FROM meals WHERE slug = $1', [slug]);
  return rows[0];
}

export async function saveMeal(meal) {
  try {
    meal.slug = slugify(meal.title, { lower: true });
    meal.instructions = xss(meal.instructions);

    // Handle duplicate slugs
    const existing = await pool.query('SELECT slug FROM meals WHERE slug = $1', [meal.slug]);
    if (existing.rows.length > 0) {
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

    await pool.query(`
      INSERT INTO meals
        (title, summary, instructions, creator, creator_email, image, slug)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
    `, [meal.title, meal.summary, meal.instructions, meal.creator, meal.creator_email, meal.image, meal.slug]);
  } catch (error) {
    console.error('saveMeal error:', error);
    throw error;
  }
}

export async function deleteMeal(slug) {
  const { rows } = await pool.query('SELECT image FROM meals WHERE slug = $1', [slug]);
  if (rows.length > 0 && rows[0].image) {
    const filepath = path.join(process.cwd(), 'public', rows[0].image);
    await fs.unlink(filepath).catch(() => {});
  }
  await pool.query('DELETE FROM meals WHERE slug = $1', [slug]);
}