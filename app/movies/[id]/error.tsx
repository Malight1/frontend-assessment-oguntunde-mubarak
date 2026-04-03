"use client";

/**
 * Detail page error boundary.
 *
 * - Catches errors thrown by `fetchMovieDetail` (network failures, 404s).
 * - Provides a direct link back to the listing so users are never stranded.
 */

import { useEffect } from "react";
import Link from "next/link";
import styles from "./error.module.css";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MovieDetailError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[MovieDetailError]", error);
  }, [error]);

  return (
    <div className={styles.container} role="alert">
      <span className={styles.icon} aria-hidden="true">🎬</span>
      <h2 className={styles.heading}>Movie unavailable</h2>
      <p className={styles.body}>
        We couldn&apos;t load this movie. It may have been removed from TMDB
        or there was a temporary network issue.
      </p>
      <div className={styles.actions}>
        <button className={styles.retryBtn} onClick={reset}>
          Try again
        </button>
        <Link href="/movies" className={styles.backLink}>
          ← Browse all movies
        </Link>
      </div>
    </div>
  );
}
