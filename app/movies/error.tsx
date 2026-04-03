"use client";

/**
 * error.tsx — Next.js route-level error boundary.
 *
 * - Must be a Client Component (`"use client"`) because it receives the
 *   `error` and `reset` props from the React error boundary runtime.
 * - Renders a friendly, actionable message rather than an empty page.
 * - The `reset` callback re-triggers the failed data fetch so users can
 *   recover without a full page reload.
 */

import { useEffect } from "react";
import styles from "./error.module.css";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MoviesError({ error, reset }: ErrorPageProps) {
  const isTmdbAuthError = /TMDB\s+\/.+\sfailed:\s401/i.test(error.message);

  /**
   * Log the error to the console in development so it's visible in DevTools.
   * In production you would send this to an observability service (e.g. Sentry).
   */
  useEffect(() => {
    console.error("[MoviesError]", error);
  }, [error]);

  return (
    <div className={styles.container} role="alert">
      <span className={styles.icon} aria-hidden="true">⚡</span>
      <h2 className={styles.heading}>Something went wrong</h2>
      <p className={styles.body}>
        {isTmdbAuthError
          ? "TMDB credentials are missing or invalid. Set TMDB_API_KEY in your environment variables and redeploy."
          : "We couldn&apos;t load the movie list. This is usually a temporary network issue."}
      </p>
      <div className={styles.actions}>
        <button className={styles.retryBtn} onClick={reset}>
          Try again
        </button>
        <a href="/movies" className={styles.homeLink}>
          Back to home
        </a>
      </div>
      {process.env.NODE_ENV === "development" && (
        <pre className={styles.debugInfo}>{error.message}</pre>
      )}
    </div>
  );
}
