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

async function fileToDataUrl(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString('base64');
  return `data:${file.type};base64,${base64}`;
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

    let imageDataUrl = '';
    if (meal.image && meal.image.size > 0) {
      imageDataUrl = await fileToDataUrl(meal.image);
    }

    await sql`
      INSERT INTO meals
        (title, summary, instructions, creator, creator_email, image, slug)
      VALUES
        (${meal.title}, ${meal.summary}, ${meal.instructions}, ${meal.creator}, ${meal.creator_email}, ${imageDataUrl}, ${meal.slug})
    `;
  } catch (error) {
    console.error('saveMeal error:', error);
    throw error;
  }
}

export async function deleteMeal(slug) {
  try {
    await sql`DELETE FROM meals WHERE slug = ${slug}`;
  } catch (error) {
    console.error('deleteMeal error:', error);
    throw error;
  }
}
