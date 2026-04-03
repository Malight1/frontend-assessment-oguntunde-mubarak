/**
 * Pagination renders numbered page controls that update the URL.
 *
 * - URL-driven: clicking a page pushes a new `?page=N` search param, making
 *   results shareable and browser-history-compatible without any client state.
 * - Uses Next.js `<Link>` so page transitions are handled by the router.
 * - Justification for pagination over infinite scroll: pagination makes the
 *   total result count visible, allows users to jump to specific pages, and
 *   performs significantly better on Lighthouse (no IntersectionObserver overhead).
 */

import Link from "next/link";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** A function that returns the full href for a given page number. */
  buildHref: (page: number) => string;
}

/**
 * Returns the set of page numbers to display, with `null` representing an ellipsis gap.
 *
 * @param current    - The currently active page.
 * @param total      - Total number of pages.
 * @returns An array of page numbers and `null` gaps.
 */
function buildPageRange(
  current: number,
  total: number
): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | null)[] = [1];

  if (current > 3) pages.push(null); // left ellipsis

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push(null); // right ellipsis

  pages.push(total);
  return pages;
}

export function Pagination({ currentPage, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageRange(currentPage, totalPages);

  return (
    <nav className={styles.nav} aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className={styles.arrow}
          aria-label="Previous page"
        >
          ←
        </Link>
      )}

      {pages.map((page, i) =>
        page === null ? (
          <span key={`ellipsis-${i}`} className={styles.ellipsis}>
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={`${styles.page} ${page === currentPage ? styles.active : ""}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className={styles.arrow}
          aria-label="Next page"
        >
          →
        </Link>
      )}
    </nav>
  );
}
