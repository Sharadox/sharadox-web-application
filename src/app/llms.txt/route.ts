import { textRoute } from "@sharadox/metadata-web-library/route";
import { llmsText } from "@sharadox/sharadox-web-library/utility/llms-text";

export const dynamic = "force-static";

/** A plain summary of Sharadox for AI assistants (llmstxt.org). */
export const { GET } = textRoute(llmsText);
