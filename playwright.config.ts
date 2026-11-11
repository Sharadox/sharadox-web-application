import { definePlaywrightConfiguration } from "@sharadox/playwright-configuration-web-library/playwright-configuration";

// Tests visit as someone who already answered the cookie panel; the consent suite starts from a fresh browser.
export default definePlaywrightConfiguration({
  localStorage: {
    consent: JSON.stringify({ version: 1, granted: { required: true }, date: "2026-11-10T00:00:00Z" }),
  },
});
