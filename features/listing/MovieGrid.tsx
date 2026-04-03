/**
 * MovieGrid renders the full listing page content as a Server Component.
 *
 * - Data is fetched at the server level — no client-side loading state for
 *   this component. Suspense in the parent handles the loading fallback.
 * - The first 8 cards (above-the-fold on most viewports) receive the
 *   `priority` prop so Next.js preloads their images.
 * - When the API returns zero results, an accessible empty-state is rendered
 *   rather than an empty grid.
 */

import { MovieCard } from "@/components/ui/MovieCard";
import { EmptyState } from "@/features/listing/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { searchMovies } from "@/lib/tmdb";
import type { SearchParams } from "@/types";
import styles from "./MovieGrid.module.css";

interface MovieGridProps {
  searchParams: SearchParams;
}

/**
 * Builds the href for a pagination link, preserving all current filters.
 *
 * @param searchParams - The current URL search params.
 * @param page         - The target page number.
 * @returns A relative URL string with updated `page` param.
 */
function buildPageHref(searchParams: SearchParams, page: number): string {
  const params = new URLSearchParams();
  if (searchParams.query) params.set("query", searchParams.query);
  if (searchParams.genre) params.set("genre", searchParams.genre);
  if (searchParams.sort) params.set("sort", searchParams.sort);
  params.set("page", String(page));
  return `/movies?${params.toString()}`;
}

export async function MovieGrid({ searchParams }: MovieGridProps) {
  const page = Number(searchParams.page ?? 1);
  const data = await searchMovies({ ...searchParams, page: String(page) });

  if (data.results.length === 0) {
    return <EmptyState query={searchParams.query} />;
  }

  return (
    <div>
      <p className={styles.resultCount}>
        {data.total_results.toLocaleString()} result
        {data.total_results !== 1 ? "s" : ""}
        {searchParams.query ? ` for "${searchParams.query}"` : ""}
      </p>

      <div className={styles.grid}>
        {data.results.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            priority={index < 8}
          />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={Math.min(data.total_pages, 500)} // TMDB caps at 500
        buildHref={(p) => buildPageHref(searchParams, p)}
      />
    </div>
  );
}
