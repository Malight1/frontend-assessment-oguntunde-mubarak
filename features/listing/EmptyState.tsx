/**
 * EmptyState renders a friendly, actionable UI when a search or filter
 * returns zero results.
 *
 * - Provides a direct link back to the unfiltered listing so users are
 *   never stuck in a dead end.
 * - Conditionally shows the user's query so the message is specific, not generic.
 */

import Link from "next/link";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  query?: string;
}

export function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <span className={styles.icon} aria-hidden="true">🔭</span>
      <h2 className={styles.heading}>No movies found</h2>
      <p className={styles.body}>
        {query
          ? `We couldn't find anything matching "${query}". Try a different title or remove your filters.`
          : "No movies match the current filters. Try adjusting your selection."}
      </p>
      <Link href="/movies" className={styles.resetLink}>
        ← Back to all movies
      </Link>
    </div>
  );
}
