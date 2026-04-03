/**
 * Shared TypeScript interfaces for the Content Explorer app.
 *
 * - All reused data shapes live here — no inline type definitions in components.
 * - API response wrappers, domain models, and UI state types are all co-located here.
 */

// ─── TMDB API Response Shapes ─────────────────────────────────────────────────

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
}

export interface TMDBMovieDetail extends TMDBMovie {
  genres: { id: number; name: string }[];
  runtime: number | null;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
}

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBGenreListResponse {
  genres: TMDBGenre[];
}

export interface SearchParams {
  query?: string;
  genre?: string;
  page?: string;
  sort?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalResults: number;
}
