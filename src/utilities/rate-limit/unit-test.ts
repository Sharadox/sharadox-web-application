import { expect, it } from "vitest";
import { createRateLimiter } from ".";

it("allows max hits per window, per key", () => {
  const allow = createRateLimiter({ window: 1000, max: 2 });
  expect(allow("a", 0)).toBe(true);
  expect(allow("a", 10)).toBe(true);
  expect(allow("a", 20)).toBe(false);
  expect(allow("b", 20)).toBe(true);
  expect(allow("a", 1011)).toBe(true);
});
