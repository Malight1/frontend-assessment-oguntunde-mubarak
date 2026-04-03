/**
 * MovieCard renders a single movie entry in the listing grid.
 *
 * - Uses `next/image` with explicit `width`/`height` for CLS prevention.
 * - Falls back to a gradient placeholder when TMDB has no poster on file.
 * - All layout and hover transitions are CSS-only to avoid JS bundle cost.
 */

import Image from "next/image";
import Link from "next/link";
import { getPosterUrl } from "@/lib/tmdb";
import { formatRating, extractYear } from "@/lib/utils";
import type { TMDBMovie } from "@/types";
import styles from "./MovieCard.module.css";

interface MovieCardProps {
  movie: TMDBMovie;
  /** When `true`, the poster image is loaded with `priority` — use for above-the-fold cards. */
  priority?: boolean;
}

export function MovieCard({ movie, priority = false }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.poster_path);
  const year = extractYear(movie.release_date);
  const rating = formatRating(movie.vote_average);

  return (
    <Link href={`/movies/${movie.id}`} className={styles.card}>
      <div className={styles.posterWrapper}>
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${movie.title} poster`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={styles.poster}
            priority={priority}
          />
        ) : (
          <div className={styles.posterFallback} aria-label="No poster available">
            <span className={styles.fallbackIcon}>🎬</span>
          </div>
        )}

        <div className={styles.ratingBadge} aria-label={`Rating: ${rating}`}>
          <span className={styles.ratingStar}>★</span>
          {rating}
        </div>
      </div>

      <div className={styles.meta}>
        <h2 className={styles.title}>{movie.title}</h2>
        <div className={styles.details}>
          <span className={styles.year}>{year}</span>
          <span className={styles.lang}>{movie.original_language.toUpperCase()}</span>
        </div>
      </div>
    </Link>
  );
}
