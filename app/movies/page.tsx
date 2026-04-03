/**
 * Movies listing page — Server Component.
 *
 * - Data is fetched at request time on the server; the page is SSR so search
 *   results are always fresh and available for crawlers without client JS.
 * - The SearchBar and GenreFilter are Client Components wrapped in Suspense
 *   so they don't block the initial SSR render.
 * - The MovieGrid is also wrapped in Suspense with a skeleton fallback,
 *   enabling React 18 streaming — the shell arrives first, then the grid
 *   streams in without a full-page loading state (satisfies B-2).
 */

import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchGenres } from "@/lib/tmdb";
import { MovieGrid } from "@/features/listing/MovieGrid";
import { SearchBar } from "@/features/search/SearchBar";
import { GenreFilter } from "@/features/search/GenreFilter";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import type { SearchParams } from "@/types";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Browse Movies",
  description: "Search and filter thousands of movies from The Movie Database.",
};

interface MoviesPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const params = await searchParams;

  /**
   * Genres are fetched in parallel with the page render.
   * They are passed as a prop to GenreFilter so that component never fetches
   * data itself — keeping client components purely presentational.
   */
  const { genres } = await fetchGenres();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>
          {params.query ? `"${params.query}"` : "Discover Movies"}
        </h1>
      </div>

      {/* Controls — SearchBar requires Suspense because useSearchParams is used internally */}
      <div className={styles.controls}>
        <Suspense fallback={<div className={styles.controlsPlaceholder} />}>
          <SearchBar />
          <GenreFilter genres={genres} />
        </Suspense>
      </div>

      {/* Grid — Suspense enables streaming; skeleton renders before data arrives */}
      <Suspense
        key={JSON.stringify(params)}
        fallback={
          <div className={styles.skeletonGrid}>
            <SkeletonGrid count={20} />
          </div>
        }
      >
        <MovieGrid searchParams={params} />
      </Suspense>
    </div>
  );
}
