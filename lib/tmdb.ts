/**
 * TMDB API client — all network calls are centralised here.
 *
 * - Components never call `fetch()` directly; they import from this module.
 * - Each function documents its Next.js cache strategy and why it was chosen.
 * - The base URL and API key are read from environment variables so secrets
 *   never land in source control.
 */

import type {
  TMDBMovie,
  TMDBMovieDetail,
  TMDBPaginatedResponse,
  TMDBGenreListResponse,
  SearchParams,
} from "@/types";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY ?? "";

/**
 * Builds a fully-qualified TMDB endpoint URL, appending the API key
 * and any additional query parameters supplied by the caller.
 *
 * @param path    - The TMDB path segment, e.g. `/movie/popular`.
 * @param params  - Optional extra query params to append.
 * @returns A complete URL string ready to pass to `fetch`.
 */
function buildUrl(path: string, params: Record<string, string> = {}): string {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", API_KEY);
  Object.entries(params).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
  });
  return url.toString();
}

/**
 * Fetches a paginated list of popular movies from TMDB.
 *
 * - Cache strategy: `revalidate: 3600` (ISR, 1 hour).
 *   Popular movies change throughout the day, but real-time freshness is not
 *   critical, so we trade a little staleness for better edge-cache hit rates.
 *
 * @param page - The page number to fetch (1-indexed).
 * @returns A paginated TMDB response containing movie summaries.
 */
export async function fetchPopularMovies(
  page = 1
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  const url = buildUrl("/movie/popular", { page: String(page) });
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`TMDB /movie/popular failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Searches TMDB for movies matching a query string, with optional genre filtering.
 *
 * - Cache strategy: `no-store` for search results.
 *   Search results depend on user-supplied input that varies per request,
 *   so caching them would waste edge memory and risk showing stale results.
 *
 * @param params - Search parameters including query, genre, and page.
 * @returns A paginated TMDB response of matching movies.
 */
export async function searchMovies(
  params: SearchParams
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  const { query, genre, page = "1", sort = "popularity.desc" } = params;

  if (query) {
    const url = buildUrl("/search/movie", {
      query,
      page,
      include_adult: "false",
    });
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) throw new Error(`TMDB /search/movie failed: ${res.status}`);
    return res.json();
  }

  // No text query — fall through to discover endpoint for genre/sort filtering.
  const discoverParams: Record<string, string> = {
    page,
    sort_by: sort,
    include_adult: "false",
  };
  if (genre) discoverParams.with_genres = genre;

  const url = buildUrl("/discover/movie", discoverParams);
  const res = await fetch(url, { next: { revalidate: 1800 } });

  if (!res.ok) throw new Error(`TMDB /discover/movie failed: ${res.status}`);
  return res.json();
}

/**
 * Fetches the full detail record for a single movie by its TMDB ID.
 *
 * - Cache strategy: `revalidate: 86400` (ISR, 24 hours).
 *   Individual movie details (cast, runtime, genres) rarely change once a film
 *   is released, so a long TTL is appropriate and reduces origin load.
 *
 * @param id - The numeric TMDB movie ID.
 * @returns The full movie detail object.
 */
export async function fetchMovieDetail(id: number): Promise<TMDBMovieDetail> {
  const url = buildUrl(`/movie/${id}`, {
    append_to_response: "credits,videos",
  });
  const res = await fetch(url, { next: { revalidate: 86400 } });

  if (!res.ok) throw new Error(`TMDB /movie/${id} failed: ${res.status}`);
  return res.json();
}

/**
 * Fetches the complete list of TMDB movie genres.
 *
 * - Cache strategy: `revalidate: 604800` (ISR, 7 days).
 *   The genre list is essentially static — TMDB rarely adds new genres.
 *   A one-week TTL is aggressive but safe for this data.
 *
 * @returns An array of genre ID/name pairs.
 */
export async function fetchGenres(): Promise<TMDBGenreListResponse> {
  const url = buildUrl("/genre/movie/list", { language: "en" });
  const res = await fetch(url, { next: { revalidate: 604800 } });

  if (!res.ok) throw new Error(`TMDB /genre/movie/list failed: ${res.status}`);
  return res.json();
}

// ─── Image URL Helpers ────────────────────────────────────────────────────────

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

/**
 * Returns a fully-qualified TMDB poster image URL.
 *
 * @param path  - The `poster_path` value from a TMDB movie object.
 * @param size  - The TMDB image size token (default `w500`).
 * @returns A complete image URL, or `null` if no path was provided.
 */
export function getPosterUrl(
  path: string | null,
  size = "w500"
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

/**
 * Returns a fully-qualified TMDB backdrop image URL.
 *
 * @param path  - The `backdrop_path` value from a TMDB movie object.
 * @param size  - The TMDB image size token (default `w1280`).
 * @returns A complete image URL, or `null` if no path was provided.
 */
export function getBackdropUrl(
  path: string | null,
  size = "w1280"
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
