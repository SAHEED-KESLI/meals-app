import fs from 'node:fs/promises';
import path from 'path';
import slugify from 'slugify';
import xss from 'xss';
import sql from './db.js';

export async function getMeals() {
  try {
    const meals = await sql`SELECT * FROM meals`;
    return meals;
  } catch (error) {
    console.error('getMeals error:', error);
    throw new Error('Failed to fetch meals');
  }
}

export async function getMeal(slug) {
  try {
    const meals = await sql`SELECT * FROM meals WHERE slug = ${slug}`;
    return meals[0] || null;
  } catch (error) {
    console.error('getMeal error:', error);
    throw new Error('Failed to fetch meal');
  }
}

export async function saveMeal(meal) {
  try {
    meal.slug = slugify(meal.title, { lower: true });
    meal.instructions = xss(meal.instructions);

    // Handle duplicate slugs
    const existing = await sql`SELECT slug FROM meals WHERE slug = ${meal.slug}`;
    if (existing.length > 0) {
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

    await sql`
      INSERT INTO meals
        (title, summary, instructions, creator, creator_email, image, slug)
      VALUES
        (${meal.title}, ${meal.summary}, ${meal.instructions}, ${meal.creator}, ${meal.creator_email}, ${meal.image}, ${meal.slug})
    `;
  } catch (error) {
    console.error('saveMeal error:', error);
    throw error;
  }
}

export async function deleteMeal(slug) {
  try {
    const meals = await sql`SELECT image FROM meals WHERE slug = ${slug}`;
    if (meals.length > 0 && meals[0].image) {
      const filepath = path.join(process.cwd(), 'public', meals[0].image);
      await fs.unlink(filepath).catch(() => {});
    }
    await sql`DELETE FROM meals WHERE slug = ${slug}`;
  } catch (error) {
    console.error('deleteMeal error:', error);
    throw error;
  }
}