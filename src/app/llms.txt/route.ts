import { llmsText } from "@sharadox/sharadox-web-library/utility/llms-text";

export const dynamic = "force-static";

/** A plain summary of Sharadox for AI assistants (llmstxt.org). */
export function GET() {
  return new Response(llmsText(), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
