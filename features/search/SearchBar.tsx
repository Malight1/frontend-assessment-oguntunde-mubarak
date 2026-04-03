"use client";

/**
 * SearchBar is a controlled client component that manages the search query input.
 *
 * - Reads initial value from URL search params so the field is pre-populated on
 *   page load (e.g. when sharing a link or navigating back).
 * - Debounces input at 300 ms before pushing to the URL, preventing an API call
 *   on every keystroke while staying within the spec requirement.
 * - Uses `router.replace` rather than `router.push` so typing doesn't pollute
 *   the browser history stack.
 */

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "@/lib/hooks/useDebounce";
import styles from "./SearchBar.module.css";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(
    searchParams.get("query") ?? ""
  );
  const debouncedValue = useDebounce(inputValue, 300);

  /**
   * Whenever the debounced query value settles, rebuild the URL params and
   * navigate. Genre and sort filters are preserved; page resets to 1.
   */
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedValue) {
      params.set("query", debouncedValue);
    } else {
      params.delete("query");
    }

    params.delete("page"); // reset to page 1 on new search

    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon} aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </span>
      <input
        type="search"
        className={styles.input}
        placeholder="Search movies…"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        aria-label="Search movies"
      />
      {inputValue && (
        <button
          className={styles.clear}
          onClick={() => setInputValue("")}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
