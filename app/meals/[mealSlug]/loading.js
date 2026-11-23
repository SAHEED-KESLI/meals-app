import classes from './loading.module.css';

export default function MealDetailLoading() {
  return (
    <div className={classes.loading}>
      <div className={classes.headerSkeleton}>
        <div className={`${classes.skeleton} ${classes.imageSkeleton}`} />
        <div className={classes.textSkeleton}>
          <div className={`${classes.skeleton} ${classes.titleSkeleton}`} />
          <div className={`${classes.skeleton} ${classes.creatorSkeleton}`} />
          <div className={`${classes.skeleton} ${classes.summarySkeleton}`} />
        </div>
      </div>
      <div className={`${classes.skeleton} ${classes.instructionsSkeleton}`} />
    </div>
  );
}