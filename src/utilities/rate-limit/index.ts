import type { RateLimiter, RateLimitOptions } from "./type";

/** In-memory sliding-window rate limiter. Best effort: each server instance keeps its own memory. */
export function createRateLimiter({ window, max }: RateLimitOptions): RateLimiter {
  const hits = new Map<string, number[]>();
  return (key, now = Date.now()) => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < window);
    if (recent.length >= max) {
      hits.set(key, recent);
      return false;
    }
    hits.set(key, [...recent, now]);
    return true;
  };
}
