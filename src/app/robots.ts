import { robots } from "@sharadox/metadata-web-library/robots";
import { SITE } from "@sharadox/sharadox-web-library/content/site";

export default function robotRules() {
  return robots({ url: SITE.url, indexable: true });
}
