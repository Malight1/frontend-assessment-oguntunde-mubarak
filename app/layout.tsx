/**
 * Root layout — wraps every page in the app.
 *
 * - Registers the Google Fonts (Syne + DM Sans) via `next/font` for zero CLS
 *   and automatic font preloading. Syne's geometric weight feels cinematic.
 * - Injects the TanStack Query provider so client-side queries are available
 *   throughout the tree without prop-drilling.
 * - Sets base metadata that individual pages can override via their own
 *   `export const metadata` export.
 */

import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import "./globals.css";

/**
 * Display font — Syne (geometric, cinematic).
 * next/font/google automatically self-hosts the font at build time,
 * eliminating the render-blocking request to fonts.googleapis.com.
 * The `display: "swap"` ensures text is visible immediately with the
 * system fallback while Syne loads.
 */
const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

/**
 * Body font — DM Sans (neutral, legible at small sizes).
 * Keeps Syne as the personality driver without visual competition.
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CineScope — Movie Explorer",
    template: "%s | CineScope",
  },
  description:
    "Browse, search, and filter thousands of movies powered by The Movie Database.",
  openGraph: {
    siteName: "CineScope",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        <QueryProvider>
          <div className="app-shell">
            <header className="site-header">
              <a href="/movies" className="site-logo">
                <span className="logo-mark">◈</span>
                CineScope
              </a>
            </header>
            <main className="site-main">{children}</main>
            <footer className="site-footer">
              <p>
                Data provided by{" "}
                <a
                  href="https://www.themoviedb.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  The Movie Database (TMDB)
                </a>
              </p>
            </footer>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
