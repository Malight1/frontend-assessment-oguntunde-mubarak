"use client";

/**
 * GenreFilter renders a genre dropdown and a sort-order dropdown.
 *
 * - Both filters are URL-driven: selections are written to search params
 *   immediately so the state is shareable and survives page refresh.
 * - Genre and sort values are not debounced — they are discrete selections,
 *   not free-text, so there is no need to delay the URL update.
 * - The genre list is passed as a prop from the parent Server Component so
 *   this Client Component never fetches data itself.
 */

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { TMDBGenre } from "@/types";
import styles from "./GenreFilter.module.css";

interface GenreFilterProps {
  genres: TMDBGenre[];
}

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "release_date.desc", label: "Newest First" },
  { value: "release_date.asc", label: "Oldest First" },
];

export function GenreFilter({ genres }: GenreFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeGenre = searchParams.get("genre") ?? "";
  const activeSort = searchParams.get("sort") ?? "popularity.desc";

  /**
   * Applies a new filter value to the URL, resetting the page to 1.
   *
   * @param key   - The search param key to update (`genre` or `sort`).
   * @param value - The new value to set, or empty string to remove the param.
   */
  function applyFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className={styles.filters}>
      <select
        className={styles.select}
        value={activeGenre}
        onChange={(e) => applyFilter("genre", e.target.value)}
        aria-label="Filter by genre"
      >
        <option value="">All Genres</option>
        {genres.map((g) => (
          <option key={g.id} value={String(g.id)}>
            {g.name}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        value={activeSort}
        onChange={(e) => applyFilter("sort", e.target.value)}
        aria-label="Sort movies"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
