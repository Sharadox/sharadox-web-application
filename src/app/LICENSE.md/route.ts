import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";

/** The raw licence text, as published in the repository. */
export async function GET() {
  const text = await readFile(join(process.cwd(), "LICENSE.md"), "utf8");
  return new Response(text, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
