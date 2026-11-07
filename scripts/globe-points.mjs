// Builds public/globe/land.bin: Float32 [lat, lng] pairs for evenly spaced dots on land.
// Run once (pnpm globe:points); the output is committed.
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { geoContains } from "d3-geo";
import { feature } from "topojson-client";

const topo = JSON.parse(readFileSync(new URL("../node_modules/world-atlas/land-110m.json", import.meta.url)));
const land = feature(topo, topo.objects.land);
const N = 42000; // samples over the whole sphere (Fibonacci lattice = even spacing)
const golden = Math.PI * (3 - Math.sqrt(5));
const out = [];
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2;
  const theta = golden * i;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lng = ((((theta * 180) / Math.PI) % 360) + 540) % 360 - 180;
  if (lat < -60) continue; // skip Antarctica: cleaner silhouette
  if (geoContains(land, [lng, lat])) out.push(lat, lng);
}
mkdirSync(new URL("../public/globe/", import.meta.url), { recursive: true });
writeFileSync(new URL("../public/globe/land.bin", import.meta.url), Buffer.from(new Float32Array(out).buffer));
console.log(`${out.length / 2} land dots`);
