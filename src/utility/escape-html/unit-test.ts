import { expect, it } from "vitest";
import { escapeHtml } from ".";

it("escapes every HTML-significant character", () => {
  expect(escapeHtml(`<a href="link">Tom & 'Jerry'</a>`)).toBe(
    "&lt;a href=&quot;link&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/a&gt;",
  );
});
