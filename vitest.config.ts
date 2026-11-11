import { defineApplicationTest } from "@sharadox/vitest-configuration-web-library/application-test";

export default defineApplicationTest({ root: new URL("./", import.meta.url) });
