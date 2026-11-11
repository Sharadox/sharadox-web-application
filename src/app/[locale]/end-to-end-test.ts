import { expect, test } from "@playwright/test";
import { describeInstallability } from "@sharadox/test-web-library/installability-suite";
import {
  describeConsent,
  describeLocaleMemory,
  describeStyleMemory,
} from "@sharadox/test-web-library/preference-suite";
import { describeSearchEngine } from "@sharadox/test-web-library/search-engine-suite";

describeSearchEngine({
  origin: "https://sharadox.com",
  structuredDataTypes: ["Organization", "WebSite"],
  pages: [
    { path: "/en", language: "en", heading: "Technologies" },
    { path: "/pt", language: "pt-PT", heading: "Tecnologias" },
  ],
  routes: ["/en/opengraph-image", "/pt/twitter-image"],
});
describeInstallability("/en");
describeLocaleMemory({
  browserLocale: "pt-PT",
  automaticPath: "/pt",
  switchName: "Idioma",
  pick: { link: "EN", path: "/en" },
});
describeStyleMemory({
  path: "/en",
  attribute: "data-style-color",
  switchName: "Style",
  colorScheme: "light",
  initial: "black",
  pick: { radio: "White", style: "white" },
});
describeConsent({
  path: "/en",
  dialogName: "Cookies",
  deny: "Deny",
  customize: "Customize",
  save: "Save Choices",
  preferences: "Cookie Preferences",
  category: "Analytics",
  storageKey: "consent",
  expectedGranted: { required: true, analytics: true, marketing: false },
});

test("the five services are in the search engine offer catalog", async ({ page }) => {
  await page.goto("/en");
  const data = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "{}");
  expect(data["@graph"][0].hasOfferCatalog.itemListElement).toHaveLength(5);
});

test("the contact form falls back to the email address when sending is unavailable", async ({ page }) => {
  // No email server in tests, so a valid message must surface the direct email instead of failing silently.
  await page.goto("/en#contact");
  const form = page.locator("form");
  await form.getByLabel("Name").fill("Test Person");
  await form.getByLabel("Email").fill("test@example.com");
  await form.getByLabel("Logo").check();
  await form.getByLabel("Tell us about your project").fill("A website.");
  await page.waitForTimeout(2600); // humans take longer than the bot threshold
  await form.getByRole("button", { name: /Send Message/ }).click();
  await expect(form.getByRole("alert")).toContainText("contact@sharadox.com");
});
