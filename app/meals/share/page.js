import ShareMealForm from '@/components/meals/share-meal-form';
import classes from './share.module.css';

export default function ShareMealPage() {
  return (
    <main className={classes.main}>
      <h1>Share Your Meal</h1>
      <ShareMealForm />
    </main>
  );
}