"use client";

/**
 * Custom hook that debounces a value by the specified delay.
 *
 * - Delays propagating the latest value until the user has stopped updating it
 *   for at least `delay` milliseconds — prevents hammering the API on every keystroke.
 * - The timer is cleared on component unmount to avoid state updates on dead components.
 *
 * @param value - The value to debounce (typically a search query string).
 * @param delay - Debounce delay in milliseconds (minimum 300ms per spec).
 * @returns The debounced value, updated only after the delay has elapsed.
 */

import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
