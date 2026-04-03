/**
 * vitest.config.ts
 *
 * - Uses `@vitejs/plugin-react` for JSX transform support.
 * - Sets `jsdom` as the test environment so DOM APIs are available in tests.
 * - Maps `@/*` path aliases to match the TypeScript / Next.js config.
 */

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
