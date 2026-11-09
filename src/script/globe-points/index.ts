/**
 * Builds public/globe/land.bin: Float32 [latitude, longitude] pairs for evenly spaced dots on land.
 * Run once with `pnpm globe-points`; the output is committed.
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
const points: number[] = [];
for (let index = 0; index < SAMPLES; index++) {
  const y = 1 - (index / (SAMPLES - 1)) * 2;
  const latitude = (Math.asin(y) * 180) / Math.PI;
  const longitude = (((((golden * index * 180) / Math.PI) % 360) + 540) % 360) - 180;
  if (latitude < -60) continue; // skip Antarctica: cleaner silhouette
  if (geoContains(land, [longitude, latitude])) points.push(latitude, longitude);
}
const directory = new URL("../../../public/globe/", import.meta.url);
mkdirSync(directory, { recursive: true });
writeFileSync(new URL("land.bin", directory), Buffer.from(new Float32Array(points).buffer));
console.log(`${points.length / 2} land dots`);
