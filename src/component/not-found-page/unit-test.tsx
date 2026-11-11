import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { installBrowserEnvironment } from "@sharadox/test-web-library/browser-environment";

const pathname = { value: "/pt/old-page" as string | null };
vi.mock("next/navigation", () => ({ usePathname: () => pathname.value }));
vi.mock("@sharadox/globe-web-library/globe", () => ({ Globe: () => null }));
const { NotFoundPage } = await import("@sharadox/sharadox-web-application/component/not-found-page");

beforeEach(() => installBrowserEnvironment());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test("speaks the address's language and keeps the rest of the address when switching", () => {
  render(<NotFoundPage />);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Esta página está fora do mapa.");
  expect(screen.getByRole("contentinfo").querySelector('a[hreflang="en"]')!.getAttribute("href")).toBe("/en/old-page");
});

test.each([
  ["/", "/"],
  ["/en", "/en"],
  [null, "/"],
])("falls back to the default language and home for %s", (current, shown) => {
  pathname.value = current;
  render(<NotFoundPage />);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("This page is off the map.");
  expect(screen.getByText(shown, { selector: "span" })).toBeTruthy();
});

test("takes the address from outside, for the global 404", () => {
  render(<NotFoundPage path="/report.pdf" />);
  expect(screen.getByText("/report.pdf")).toBeTruthy();
  expect(screen.getByRole("contentinfo").querySelector('a[hreflang="pt"]')!.getAttribute("href")).toBe("/pt");
});
