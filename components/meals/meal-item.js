'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteMealAction } from '@/lib/actions';

import classes from './meal-item.module.css';

export default function MealItem({ title, slug, image, summary, creator }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(deleteMealAction, {
    message: null,
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const formRef = useRef(null);
  const cancelRef = useRef(null);

  // Refresh the list once the deletion completes so the card disappears.
  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  // Close the confirmation dialog with the Escape key.
  useEffect(() => {
    if (!showConfirm) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowConfirm(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showConfirm]);

  // Move focus into the dialog when it opens.
  useEffect(() => {
    if (showConfirm) {
      cancelRef.current?.focus();
    }
  }, [showConfirm]);

  const handleDeleteClick = (event) => {
    event.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <article className={classes.meal}>
      <header>
        <div className={classes.image}>
          <img
            src={image}
            alt={title}
            className={classes.mealImage}
            loading="lazy"
            decoding="async"
          />
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
          <form ref={formRef} action={formAction}>
            <input type="hidden" name="slug" value={slug} />
            <button
              type="submit"
              className={classes.deleteButton}
              onClick={handleDeleteClick}
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </button>
            {state.message && (
              <p className={classes.error} role="alert">
                {state.message}
              </p>
            )}
          </form>
        </div>
      </div>

      {showConfirm && (
        <div className={classes.modalOverlay} onClick={() => setShowConfirm(false)}>
          <div
            className={classes.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-dialog-title-${slug}`}
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id={`delete-dialog-title-${slug}`}>Delete &quot;{title}&quot;?</h3>
            <p>This action cannot be undone. The meal will be permanently removed.</p>
            <div className={classes.modalActions}>
              <button
                type="button"
                ref={cancelRef}
                className={classes.cancelButton}
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className={classes.confirmButton}
                onClick={handleConfirmDelete}
                disabled={isPending}
              >
                {isPending ? 'Deleting...' : 'Delete Meal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
