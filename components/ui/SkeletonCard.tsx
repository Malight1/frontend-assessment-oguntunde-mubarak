/**
 * SkeletonCard renders an animated placeholder for a MovieCard.
 *
 * - Matches the exact dimensions of MovieCard to prevent CLS during hydration.
 * - Uses a CSS shimmer animation — zero JS required.
 * - Rendered by the listing feature's loading.tsx, not by MovieCard itself.
 */

import styles from "./SkeletonCard.module.css";

export function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.poster} />
      <div className={styles.meta}>
        <div className={styles.titleLine} />
        <div className={styles.titleLineShort} />
        <div className={styles.detailLine} />
      </div>
    </div>
  );
}

/**
 * Renders a full grid of SkeletonCards matching the listing grid layout.
 *
 * @param count - Number of skeleton cards to render (default 20).
 */
export function SkeletonGrid({ count = 20 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
}
