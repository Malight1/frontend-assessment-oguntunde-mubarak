/**
 * RatingCircle renders a circular SVG progress indicator for a movie's vote average.
 *
 * - Uses an SVG `stroke-dashoffset` technique — no JS animation library required.
 * - The coloured arc transitions on mount via a CSS animation.
 * - Accessible: the container has `role="img"` and a descriptive `aria-label`.
 */

import { ratingToPercent } from "@/lib/utils";
import styles from "./RatingCircle.module.css";

interface RatingCircleProps {
  average: number;
}

const RADIUS = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Returns a colour token based on the rating value.
 *
 * @param average - Vote average on a 0–10 scale.
 * @returns A CSS colour string.
 */
function ratingColor(average: number): string {
  if (average >= 7) return "#4ade80"; // green
  if (average >= 5) return "#fbbf24"; // amber
  return "#f87171"; // red
}

export function RatingCircle({ average }: RatingCircleProps) {
  const percent = ratingToPercent(average);
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
  const color = ratingColor(average);

  return (
    <div
      className={styles.wrapper}
      role="img"
      aria-label={`Rating: ${average.toFixed(1)} out of 10`}
    >
      <svg
        className={styles.svg}
        width="64"
        height="64"
        viewBox="0 0 64 64"
      >
        {/* Track */}
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="5"
        />
        {/* Progress arc */}
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 32 32)"
          className={styles.arc}
        />
      </svg>
      <div className={styles.label}>
        <span className={styles.score} style={{ color }}>
          {average.toFixed(1)}
        </span>
        <span className={styles.max}>/10</span>
      </div>
    </div>
  );
}
