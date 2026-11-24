'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteMealAction } from '@/lib/actions';

import classes from './page.module.css';

export default function DeleteMealButton({ slug }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(deleteMealAction, {
    message: null,
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const formRef = useRef(null);
  const cancelRef = useRef(null);

  // Once the server action reports success, leave this page and return to the
  // list of all meals so the user isn't stranded on a deleted-meal page.
  useEffect(() => {
    if (state.success) {
      router.replace('/meals?deleted=1');
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
    <>
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="slug" value={slug} />
        <button
          type="submit"
          className={classes.deleteButton}
          onClick={handleDeleteClick}
          disabled={isPending}
        >
          {isPending ? 'Deleting...' : 'Delete Meal'}
        </button>
        {state.message && (
          <p className={classes.error} role="alert">
            {state.message}
          </p>
        )}
      </form>

      {showConfirm && (
        <div className={classes.modalOverlay} onClick={() => setShowConfirm(false)}>
          <div
            className={classes.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="delete-dialog-title">Delete this meal?</h3>
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
    </>
  );
}