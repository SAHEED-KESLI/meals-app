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

  if (isInvalidText(meal.title)) {
    return { message: 'Please provide a title for your meal.' };
  }
  if (isInvalidText(meal.summary)) {
    return { message: 'Please provide a short summary.' };
  }
  if (isInvalidText(meal.instructions)) {
    return { message: 'Please provide the cooking instructions.' };
  }
  if (isInvalidText(meal.creator)) {
    return { message: 'Please provide your name.' };
  }
  if (isInvalidText(meal.creator_email) || !meal.creator_email.includes('@')) {
    return { message: 'Please provide a valid email address.' };
  }
  if (!meal.image || meal.image.size === 0) {
    return { message: 'Please pick an image for your meal.' };
  }

  try {
    await saveMeal(meal);
    revalidatePath('/meals');
  } catch (error) {
    console.error('shareMeal error:', error);
    return {
      message: 'Failed to add your meal. Please try again.',
    };
  }

  // redirect() throws internally to perform the navigation, so it must live
  // OUTSIDE the try/catch block. Keeping it inside swallowed the redirect and
  // left users stuck on the form even after a successful save.
  redirect('/meals?shared=1');
}

export async function deleteMealAction(prevState, formData) {
  const slug = formData.get('slug');
  if (!slug) {
    return { message: 'Invalid meal.' };
  }
  try {
    await deleteMeal(slug);
    revalidatePath('/meals');
  } catch (error) {
    console.error('deleteMealAction error:', error);
    return {
      message: error.message || 'Failed to delete meal.',
    };
  }

  redirect('/meals?deleted=1');
}
