import classes from './loading.module.css';

export default function MealsLoadingPage() {
  return (
    <ul className={classes.mealsSkeleton} aria-label="Loading meals" role="list">
      {[...Array(6)].map((_, i) => (
        <li key={i} className={classes.skeletonCard}>
          <div className={classes.skeletonImage} />
          <div className={classes.skeletonContent}>
            <div className={classes.skeletonTitle} />
            <div className={classes.skeletonCreator} />
            <div className={classes.skeletonSummary} />
            <div className={classes.skeletonActions}>
              <div className={classes.skeletonButton} />
              <div className={classes.skeletonButton} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}