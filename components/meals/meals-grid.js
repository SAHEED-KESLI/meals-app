import Link from 'next/link';

import MealItem from './meal-item';
import classes from './meals-grid.module.css';

export default function MealsGrid({ meals }) {
  if (!meals || meals.length === 0) {
    return (
      <div className={classes.empty}>
        <h2 className={classes.emptyTitle}>No meals here yet</h2>
        <p className={classes.emptyText}>
          Be the first to share a delicious recipe with the community.
        </p>
        <Link href="/meals/share" className={classes.emptyCta}>
          Share a Meal
        </Link>
      </div>
    );
  }

  return (
    <ul className={classes.meals}>
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealItem {...meal} />
        </li>
      ))}
    </ul>
  );
}
