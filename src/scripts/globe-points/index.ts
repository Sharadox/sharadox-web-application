/**
 * Builds public/globe/land.bin: Float32 [lat, lng] pairs for evenly spaced dots on land.
 * Run once with `pnpm globe:points`; the output is committed.
 */
import { geoContains } from "d3-geo";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";

const require = createRequire(import.meta.url);
const topology = JSON.parse(readFileSync(require.resolve("world-atlas/land-110m.json"), "utf8")) as Topology;
const land = feature(topology, topology.objects.land!);

/** Samples over the whole sphere (Fibonacci lattice = even spacing). */
const SAMPLES = 42000;
const golden = Math.PI * (3 - Math.sqrt(5));
const out: number[] = [];
for (let i = 0; i < SAMPLES; i++) {
  const y = 1 - (i / (SAMPLES - 1)) * 2;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lng = (((((golden * i * 180) / Math.PI) % 360) + 540) % 360) - 180;
  if (lat < -60) continue; // skip Antarctica: cleaner silhouette
  if (geoContains(land, [lng, lat])) out.push(lat, lng);
}
const dir = new URL("../../../public/globe/", import.meta.url);
mkdirSync(dir, { recursive: true });
writeFileSync(new URL("land.bin", dir), Buffer.from(new Float32Array(out).buffer));
console.log(`${out.length / 2} land dots`);
