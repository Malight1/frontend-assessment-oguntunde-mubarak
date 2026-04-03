/**
 * loading.tsx — Next.js route-level loading UI.
 *
 * - Rendered instantly by Next.js during SSR before the page's async data
 *   resolves, providing immediate visual feedback with no bare spinners.
 * - Mirrors the grid layout of the listing page to prevent CLS on load.
 */

import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import styles from "./loading.module.css";

export default function MoviesLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.headingPlaceholder} />
      <div className={styles.controlsPlaceholder} />
      <div className={styles.grid}>
        <SkeletonGrid count={20} />
      </div>
    </div>
  );
}
