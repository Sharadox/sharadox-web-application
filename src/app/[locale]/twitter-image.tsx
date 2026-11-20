import { localizedShareImage } from "@sharadox/metadata-web-library/route";
import { renderShareImage } from "@sharadox/sharadox-web-library/component/share-image";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";

const share = localizedShareImage({ locales: LOCALES, alt: "Sharadox", render: renderShareImage });
export const { size, contentType, alt, generateStaticParams } = share;
export default share.image;
