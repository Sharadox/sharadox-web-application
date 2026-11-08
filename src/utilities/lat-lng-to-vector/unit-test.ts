import { expect, it } from "vitest";
import { latLngToVector } from ".";

it("puts (0,0) in front, the north pole on top and 90°E to the right", () => {
  const close = (v: { x: number; y: number; z: number }, x: number, y: number, z: number) =>
    [v.x - x, v.y - y, v.z - z].every((d) => Math.abs(d) < 1e-9);
  expect(close(latLngToVector(0, 0), 0, 0, 1)).toBe(true);
  expect(close(latLngToVector(90, 0), 0, 1, 0)).toBe(true);
  expect(close(latLngToVector(0, 90, 2), 2, 0, 0)).toBe(true);
});
