/**
 * Shared utility functions used across features.
 *
 * - Pure functions only — no side-effects, no imports from React or Next.js.
 * - Each function is independently testable.
 */

/**
 * Formats a decimal vote average (0–10) into a rounded one-decimal string.
 *
 * @param average - The raw vote average from TMDB.
 * @returns A formatted string like `"8.4"`.
 */
export function formatRating(average: number): string {
  return average.toFixed(1);
}

/**
 * Extracts the four-digit year from a TMDB release date string.
 *
 * @param dateStr - An ISO date string like `"2023-07-12"`.
 * @returns The year portion, e.g. `"2023"`, or `"—"` if the string is empty.
 */
export function extractYear(dateStr: string): string {
  if (!dateStr) return "—";
  return dateStr.slice(0, 4);
}

/**
 * Formats a runtime in minutes into a human-readable `"Xh Ym"` string.
 *
 * @param minutes - Total runtime in minutes.
 * @returns A formatted string like `"2h 15m"`, or `"—"` if runtime is falsy.
 */
export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/**
 * Clamps a number between an inclusive minimum and maximum.
 *
 * @param value - The number to clamp.
 * @param min   - Lower bound (inclusive).
 * @param max   - Upper bound (inclusive).
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Converts a TMDB vote average (0–10) to a 0–100 percentage for progress bars.
 *
 * @param average - Raw vote average.
 * @returns An integer percentage.
 */
export function ratingToPercent(average: number): number {
  return Math.round(average * 10);
}
