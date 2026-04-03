/**
 * Movie detail page — Server Component.
 *
 * - Data is fetched at the server level using `fetchMovieDetail`, which uses
 *   a 24-hour ISR TTL. The slug is a TMDB numeric ID.
 * - Exports `generateMetadata` for per-movie title, description, and og:image —
 *   critical for social sharing previews and SEO.
 * - Exports `generateStaticParams` for the 20 most popular movies so they are
 *   pre-rendered at build time; other IDs fall back to SSR on first request.
 */

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchMovieDetail, fetchPopularMovies, getBackdropUrl, getPosterUrl } from "@/lib/tmdb";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { RatingCircle } from "@/components/ui/RatingCircle";
import { formatRuntime, extractYear } from "@/lib/utils";
import styles from "./page.module.css";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generates page-level metadata for the detail route.
 *
 * - Sets a unique `<title>`, `<meta description>`, and Open Graph tags per movie.
 * - `og:image` points to the TMDB backdrop for rich link previews on social platforms.
 *
 * @param props - The page props containing the route `params`.
 * @returns A Next.js `Metadata` object consumed by the App Router.
 */
export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) return { title: "Movie Not Found" };

  try {
    const movie = await fetchMovieDetail(numericId);
    const ogImage = getBackdropUrl(movie.backdrop_path, "w1280");

    return {
      title: movie.title,
      description: movie.overview?.slice(0, 155) || `Details for ${movie.title}`,
      openGraph: {
        title: movie.title,
        description: movie.overview?.slice(0, 155) || "",
        images: ogImage ? [{ url: ogImage, width: 1280, height: 720 }] : [],
        type: "website",
      },
    };
  } catch {
    return { title: "Movie Not Found" };
  }
}

/**
 * Pre-renders the top 20 popular movies at build time.
 *
 * - Any movie ID not in this set is rendered on demand (SSR fallback).
 * - Keeps build times short while still providing instant loads for the
 *   most-visited detail pages.
 *
 * @returns An array of `{ id }` params objects for static generation.
 */
export async function generateStaticParams() {
  try {
    const data = await fetchPopularMovies(1);
    return data.results.slice(0, 20).map((movie) => ({ id: String(movie.id) }));
  } catch {
    return [];
  }
}

export default async function MovieDetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) notFound();

  let movie;
  try {
    movie = await fetchMovieDetail(numericId);
  } catch {
    notFound();
  }

  const posterUrl = getPosterUrl(movie.poster_path, "w500");
  const backdropUrl = getBackdropUrl(movie.backdrop_path, "w1280");
  const year = extractYear(movie.release_date);
  const runtime = formatRuntime(movie.runtime);

  return (
    <article className={styles.page}>
      {/* Backdrop hero */}
      {backdropUrl && (
        <div className={styles.backdropWrapper} aria-hidden="true">
          <Image
            src={backdropUrl}
            alt=""
            fill
            sizes="100vw"
            className={styles.backdrop}
            priority
          />
          <div className={styles.backdropScrim} />
        </div>
      )}

      <div className={styles.content}>
        <Breadcrumb
          items={[
            { label: "Movies", href: "/movies" },
            { label: movie.title },
          ]}
        />

        <div className={styles.hero}>
          {/* Poster */}
          <div className={styles.posterWrapper}>
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={`${movie.title} poster`}
                width={300}
                height={450}
                className={styles.poster}
                priority
              />
            ) : (
              <div className={styles.posterFallback}>
                <span aria-hidden="true">🎬</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className={styles.info}>
            <h1 className={styles.title}>{movie.title}</h1>

            {movie.tagline && (
              <p className={styles.tagline}>&ldquo;{movie.tagline}&rdquo;</p>
            )}

            {/* Meta row */}
            <div className={styles.metaRow}>
              <span className={styles.metaChip}>{year}</span>
              {runtime !== "—" && (
                <span className={styles.metaChip}>{runtime}</span>
              )}
              {movie.original_language && (
                <span className={styles.metaChip}>
                  {movie.original_language.toUpperCase()}
                </span>
              )}
            </div>

            {/* Genres */}
            {movie.genres.length > 0 && (
              <div className={styles.genres}>
                {movie.genres.map((g) => (
                  <a
                    key={g.id}
                    href={`/movies?genre=${g.id}`}
                    className={styles.genreTag}
                  >
                    {g.name}
                  </a>
                ))}
              </div>
            )}

            {/* Rating */}
            <div className={styles.ratingRow}>
              <RatingCircle average={movie.vote_average} />
              <span className={styles.voteCount}>
                {movie.vote_count.toLocaleString()} votes
              </span>
            </div>

            {/* Overview */}
            {movie.overview && (
              <p className={styles.overview}>{movie.overview}</p>
            )}

            {/* Production companies */}
            {movie.production_companies.length > 0 && (
              <div className={styles.companies}>
                <span className={styles.companiesLabel}>Production</span>
                <span className={styles.companiesValue}>
                  {movie.production_companies.map((c) => c.name).join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
