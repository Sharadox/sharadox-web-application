import { expect, test } from "vitest";
import { latLngToVector } from ".";

/** The globe converts ~11,000 land dots on load; it must fit well inside one 60 fps frame. */
test("converts the globe's land dots within one frame", async ({ bench }) => {
  const result = await bench("convert 11,000 land dots", () => {
    for (let i = 0; i < 11_000; i++) latLngToVector((i % 150) - 60, (i % 360) - 180, 1.001);
  }).run();
  expect(result.latency.mean).toBeLessThan(16);
});
