'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import classes from './feedback-toast.module.css';

function resolveMessage(searchParams) {
  if (searchParams.get('deleted') === '1') return 'Meal deleted successfully';
  if (searchParams.get('shared') === '1') return 'Meal added successfully';
  return null;
}

export default function FeedbackToast() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState(() => resolveMessage(searchParams));

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(null);
      // Clean up the query string without triggering another data fetch.
      window.history.replaceState({}, '', '/meals');
    }, 4000);

    return () => clearTimeout(timer);
  }, [message]);

  if (!message) {
    return null;
  }

  return (
    <div className={classes.toast} role="status" aria-live="polite">
      <span className={classes.check} aria-hidden="true">
        ✓
      </span>
      <span>{message}</span>
    </div>
  );
}
