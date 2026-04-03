/**
 * Tests for lib/utils.ts
 *
 * - Full coverage for all exported utility functions.
 * - Pure functions with no side effects; no mocking required.
 */

import { describe, it, expect } from "vitest";
import {
  formatRating,
  extractYear,
  formatRuntime,
  clamp,
  ratingToPercent,
} from "@/lib/utils";

describe("formatRating", () => {
  it("formats an integer rating to one decimal place", () => {
    expect(formatRating(8)).toBe("8.0");
  });

  it("formats a float rating to one decimal place", () => {
    expect(formatRating(7.45)).toBe("7.5");
  });

  it("handles a zero rating", () => {
    expect(formatRating(0)).toBe("0.0");
  });

  it("handles the maximum rating of 10", () => {
    expect(formatRating(10)).toBe("10.0");
  });
});

describe("extractYear", () => {
  it("extracts the year from a standard ISO date string", () => {
    expect(extractYear("2023-07-14")).toBe("2023");
  });

  it("returns an em dash for an empty string", () => {
    expect(extractYear("")).toBe("—");
  });

  it("handles a date with only a year component", () => {
    expect(extractYear("1999")).toBe("1999");
  });
});

describe("formatRuntime", () => {
  it("formats a runtime with both hours and minutes", () => {
    expect(formatRuntime(135)).toBe("2h 15m");
  });

  it("formats a runtime with minutes only", () => {
    expect(formatRuntime(45)).toBe("45m");
  });

  it("formats an exact hour with zero minutes", () => {
    expect(formatRuntime(120)).toBe("2h 0m");
  });

  it("returns an em dash for null", () => {
    expect(formatRuntime(null)).toBe("—");
  });

  it("returns an em dash for undefined", () => {
    expect(formatRuntime(undefined)).toBe("—");
  });

  it("returns an em dash for zero", () => {
    expect(formatRuntime(0)).toBe("—");
  });
});

describe("clamp", () => {
  it("returns the value when within bounds", () => {
    expect(clamp(5, 1, 10)).toBe(5);
  });

  it("clamps to the minimum when value is below lower bound", () => {
    expect(clamp(-3, 0, 100)).toBe(0);
  });

  it("clamps to the maximum when value exceeds upper bound", () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });

  it("returns min when value equals min", () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it("returns max when value equals max", () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });
});

describe("ratingToPercent", () => {
  it("converts a 10/10 rating to 100%", () => {
    expect(ratingToPercent(10)).toBe(100);
  });

  it("converts a 7.5/10 rating to 75%", () => {
    expect(ratingToPercent(7.5)).toBe(75);
  });

  it("converts a 0/10 rating to 0%", () => {
    expect(ratingToPercent(0)).toBe(0);
  });

  it("rounds a fractional percent to the nearest integer", () => {
    expect(ratingToPercent(6.66)).toBe(67);
  });
});
