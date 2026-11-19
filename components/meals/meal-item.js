'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useActionState } from 'react';
import { deleteMealAction } from '@/lib/actions';

import classes from './meal-item.module.css';

export default function MealItem({ title, slug, image, summary, creator }) {
  const [state, formAction] = useActionState(deleteMealAction, { message: null });

  return (
    <article className={classes.meal}>
      <header>
        <div className={classes.image}>
          <Image src={image} alt={title} fill />
        </div>
        <div className={classes.headerText}>
          <h2>{title}</h2>
          <p>by {creator}</p>
        </div>
      </header>
      <div className={classes.content}>
        <p className={classes.summary}>{summary}</p>
        <div className={classes.actions}>
          <Link href={`/meals/${slug}`}>View Details</Link>
          <form action={formAction}>
            <input type="hidden" name="slug" value={slug} />
            <button type="submit" className={classes.deleteButton}>
              Delete
            </button>
            {state.message && <p className={classes.error}>{state.message}</p>}
          </form>
        </div>
      </div>
    </article>
  );
}
