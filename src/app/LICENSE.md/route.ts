import { fileRoute } from "@sharadox/metadata-web-library/route";

export const dynamic = "force-static";

/** The raw license text, as published in the repository. */
export const { GET } = fileRoute("LICENSE.md");
