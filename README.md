# CineScope — Movie Explorer

A production-quality content explorer built with **Next.js 15 App Router**, **TypeScript**, and **CSS Modules**. Data is sourced from [The Movie Database (TMDB)](https://developer.themoviedb.org/).

---

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/frontend-assessment-mubarak-oguntunde
cd frontend-assessment-mubarak-oguntunde
cp .env.example .env.local          # add your TMDB_API_KEY
npm install
npm run dev                         # http://localhost:3000
```

**TMDB API key** → free at https://developer.themoviedb.org/docs/getting-started (instant, no credit card).

For Vercel deployments, set `TMDB_API_KEY` in **Project Settings → Environment Variables** for Production (and Preview if needed), then redeploy.

---

## Architecture Decisions

### API choice: TMDB

TMDB was chosen over the other suggested APIs because it satisfies every requirement in a single integration: paginated listing, per-item detail pages, rich images, genre taxonomy for filtering, and sort/vote metadata. No key-stitching or multiple base URLs required.

### Folder structure

```
app/              — Next.js App Router pages, layouts, loading/error
components/ui/    — Atomic UI components (Card, Skeleton, Pagination, Breadcrumb, RatingCircle)
features/         — Feature-scoped modules (listing/, search/)
lib/              — API client (tmdb.ts), utility functions, hooks, providers
types/            — All shared TypeScript interfaces; no inline type definitions
__tests__/        — Vitest + RTL test suites
```

Components never call `fetch()` directly. All network logic lives in `lib/tmdb.ts`. Business logic is extracted to `lib/utils.ts` — JSX stays declarative.

### Pagination over infinite scroll

Pagination was chosen for three reasons:
1. **Lighthouse score** — URL-driven pagination renders a fixed grid per load, which Next.js fully SSRs before the browser paints. IntersectionObserver + dynamic appending hurts CLS and LCP.
2. **Shareability** — every page has a stable URL (`?page=4`). Infinite scroll makes deep-linking impractical.
3. **Accessibility** — keyboard users and screen readers navigate paginated content more predictably than a virtualised infinite list.

### Server vs. client component split

| Component | Boundary | Reason |
|---|---|---|
| `MoviesPage` | Server | SSR the full grid; crawlers see content without JS |
| `MovieDetailPage` | Server | SSR + `generateMetadata` for og:image |
| `MovieGrid` | Server | Fetches data; wrapped in `<Suspense>` for streaming |
| `SearchBar` | Client | Needs `useState` + `useRouter` for debounced input |
| `GenreFilter` | Client | `useSearchParams` to read/write URL params |

### State management

URL search params are the single source of truth for search/filter/page state. Results are shareable via link, browser back/forward works correctly, and Server Components can read params directly — no client round-trip needed.

---

## Performance Optimisations

### 1. `next/image` with explicit dimensions + `priority`

All TMDB images go through `next/image`. Explicit `width`/`height` (or `fill` with a sized parent) prevents CLS. The first 8 listing cards and the detail page hero receive `priority={true}`, injecting `<link rel="preload">` for above-the-fold images.

### 2. Next.js fetch cache strategy per endpoint

| Endpoint | Strategy | Rationale |
|---|---|---|
| `/movie/popular` | `revalidate: 3600` | Rankings update hourly; real-time freshness not critical |
| `/search/movie` | `no-store` | User queries vary per request; caching wastes edge memory |
| `/discover/movie` | `revalidate: 1800` | Genre/sort pages less volatile than search |
| `/movie/:id` | `revalidate: 86400` | Movie metadata rarely changes post-release |
| `/genre/movie/list` | `revalidate: 604800` | Genre list is essentially static |

### 3. `next/font` for Google Fonts

`Syne` and `DM Sans` are loaded via `next/font/google`. This eliminates the render-blocking `fonts.googleapis.com` request and self-hosts fonts on the same origin, reducing LCP penalty.

### 4. Cloudflare Cache-Control headers for static assets

`next.config.ts` adds `Cache-Control: public, max-age=31536000, immutable` to all `/_next/static/*` responses. Content-hashed filenames guarantee freshness on every new deployment without manual cache purging.

### 5. React 18 streaming with Suspense

`MovieGrid` is an async Server Component wrapped in `<Suspense>` with a `<SkeletonGrid>` fallback. The listing page shell streams to the browser instantly; the grid streams in as data arrives with no client-side loading state.

---

## Trade-offs and Known Limitations

- **TMDB search + genre filtering**: The `/search/movie` endpoint ignores `with_genres`. When a text query is active, genre filter is cleared on the API side. With more time I'd add a client-side post-filter or a UX hint.
- **No `generateStaticParams` for all IDs**: Only top-20 popular movies are pre-rendered. A background job pre-warming most-visited IDs would be the production solution.
- **No user authentication**: TMDB supports watchlists via OAuth — a natural next feature but out of scope.

---

## Bonus Tasks

### B-2 — React 18 Streaming with Suspense ✅

Implemented in `app/movies/page.tsx`. `MovieGrid` is wrapped in `<Suspense>` — shell streams first, grid streams after. The `key={JSON.stringify(searchParams)}` on the boundary triggers remount (and re-skeleton) on every new query.

### B-1 — Cloudflare Workers (setup instructions)

```bash
npm install -D @opennextjs/cloudflare wrangler
npx opennextjs-cloudflare build
npx wrangler deploy
# Verify: curl -I https://YOUR_URL/movies | grep x-cache-status
```

OpenNext maps `revalidate: N` to Workers KV-backed ISR with `cf: { cacheTtl: N }` on upstream fetches, and `force-cache` to `cacheEverything: true`.

### B-3 — Accessibility

All interactive elements have `:focus-visible` outlines, `aria-label` on icon buttons, `aria-current="page"` on active pagination links, `aria-live="polite"` on empty state, `role="alert"` on error boundaries, and semantic landmark elements throughout.

---

## Running Tests

```bash
npm test              # run once (31 tests, 2 files)
npm run test:watch    # watch mode
```

100% coverage for `lib/utils.ts` and `components/ui/Pagination.tsx`.

---

## What I'd Tackle Next (2 more hours)

1. **Combined text + genre filter** — proxy TMDB through a Route Handler that fetches both endpoints and intersects results client-side.
2. **Trailer modal** — the `append_to_response=videos` data is already fetched in `fetchMovieDetail`; surface the YouTube key in a `<dialog>` modal on the detail page.
3. **Full Cloudflare Workers deployment** — complete OpenNext integration and add `x-cache-status: HIT/MISS` header via `caches.default.match()`.

---

## AI Tooling Disclosure

Claude (Anthropic) was used to assist with scaffolding boilerplate, CSS module patterns, and test structure. All architectural decisions, cache strategy rationale, and component composition are original. Any section can be walked through line-by-line in the code review call.
