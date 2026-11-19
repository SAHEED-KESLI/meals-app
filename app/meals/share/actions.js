'use server';

import { saveMeal } from '@/lib/meals';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function shareMeal(formData) {
  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    creator: formData.get('name'),
    creator_email: formData.get('email')
  }

  const image = formData.get('image');
  if (image && image.size > 0) {
    const buffer = Buffer.from(await image.arrayBuffer());
    const filename = `${Date.now()}-${image.name.replace(/\s+/g, '-')}`;
    const filepath = path.join(process.cwd(), 'public', 'images', filename);
    await writeFile(filepath, buffer);
    meal.image = `/images/${filename}`;
  } else {
    meal.image = '';
  }

  await saveMeal(meal);
}