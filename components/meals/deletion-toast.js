'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import classes from './deletion-toast.module.css';

export default function DeletionToast() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(searchParams.get('deleted') === '1');

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setVisible(false);
      // Clean up the query string without triggering another data fetch.
      window.history.replaceState({}, '', '/meals');
    }, 4000);

    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div className={classes.toast} role="status" aria-live="polite">
      <span className={classes.check} aria-hidden="true">
        ✓
      </span>
      <span>Meal deleted successfully</span>
    </div>
  );
}
