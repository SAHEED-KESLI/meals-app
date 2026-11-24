'use server';

import { redirect } from 'next/navigation';

import { saveMeal, deleteMeal } from './meals';
import { revalidatePath } from 'next/cache';

function isInvalidText(text) {
  return !text || text.trim() === '';
}

export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),
    creator: formData.get('name'),
    creator_email: formData.get('email'),
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes('@') ||
    !meal.image ||
    meal.image.size === 0
  ) {
    return {
      message: 'Invalid input.',
    };
  }

  try {
    await saveMeal(meal);
    revalidatePath('/meals');
    redirect('/meals');
  } catch (error) {
    console.error('shareMeal error:', error);
    return {
      message: error.message || 'Failed to share meal.',
    };
  }
}

export async function deleteMealAction(prevState, formData) {
  const slug = formData.get('slug');
  if (!slug) {
    return { message: 'Invalid meal.' };
  }
  try {
    await deleteMeal(slug);
    revalidatePath('/meals');
    return { success: true };
  } catch (error) {
    console.error('deleteMealAction error:', error);
    return {
      message: error.message || 'Failed to delete meal.',
    };
  }
}
