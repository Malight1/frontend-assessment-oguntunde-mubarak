/**
 * Tests for components/ui/Pagination.tsx
 *
 * - Verifies rendering, link generation, aria attributes, and edge cases.
 * - `next/link` and `next/navigation` are mocked so the component can be
 *   tested outside of the Next.js router context.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pagination } from "@/components/ui/Pagination";

// Mock next/link — render as a plain <a> so we can inspect href values
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

/**
 * Helper that builds a simple `/movies?page=N` href for tests.
 *
 * @param page - The target page number.
 * @returns A relative URL string.
 */
const buildHref = (page: number) => `/movies?page=${page}`;

describe("Pagination", () => {
  it("renders nothing when there is only one page", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} buildHref={buildHref} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders page links for a small total page count", () => {
    render(
      <Pagination currentPage={1} totalPages={5} buildHref={buildHref} />
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("marks the current page with aria-current='page'", () => {
    render(
      <Pagination currentPage={3} totalPages={10} buildHref={buildHref} />
    );
    const currentLink = screen.getByText("3");
    expect(currentLink).toHaveAttribute("aria-current", "page");
  });

  it("renders a 'Previous page' arrow link when not on the first page", () => {
    render(
      <Pagination currentPage={3} totalPages={10} buildHref={buildHref} />
    );
    const prev = screen.getByLabelText("Previous page");
    expect(prev).toHaveAttribute("href", "/movies?page=2");
  });

  it("renders a 'Next page' arrow link when not on the last page", () => {
    render(
      <Pagination currentPage={3} totalPages={10} buildHref={buildHref} />
    );
    const next = screen.getByLabelText("Next page");
    expect(next).toHaveAttribute("href", "/movies?page=4");
  });

  it("does not render a 'Previous' arrow on the first page", () => {
    render(
      <Pagination currentPage={1} totalPages={5} buildHref={buildHref} />
    );
    expect(screen.queryByLabelText("Previous page")).toBeNull();
  });

  it("does not render a 'Next' arrow on the last page", () => {
    render(
      <Pagination currentPage={5} totalPages={5} buildHref={buildHref} />
    );
    expect(screen.queryByLabelText("Next page")).toBeNull();
  });

  it("renders an ellipsis for large page ranges", () => {
    render(
      <Pagination currentPage={10} totalPages={50} buildHref={buildHref} />
    );
    const ellipses = screen.getAllByText("…");
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });

  it("has an accessible nav label", () => {
    render(
      <Pagination currentPage={2} totalPages={10} buildHref={buildHref} />
    );
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });
});
