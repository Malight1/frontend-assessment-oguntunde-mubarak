"use client";

/**
 * QueryProvider wraps the application in TanStack Query's context.
 *
 * - Must be a Client Component because `QueryClient` requires a browser runtime.
 * - The `QueryClientProvider` is placed here so all Server Components in the
 *   tree remain pure — only this thin wrapper opts into the client bundle.
 * - Devtools are included only in development; they are tree-shaken from production.
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  /**
   * `useState` ensures a single `QueryClient` instance per component tree.
   * Creating it outside the component would cause it to be shared across
   * requests on the server, leaking state between users.
   */
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute — reduces unnecessary refetches
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
