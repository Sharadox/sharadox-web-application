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

test("the license page shows the Portuguese original and the English translation, and links back home", async ({
  page,
  request,
}) => {
  await page.goto("/pt");
  await page.getByRole("contentinfo").getByRole("link", { name: "Licença" }).click();
  await expect(page).toHaveURL(/\/pt\/license$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Licença Sharadox de Código Verificável");
  await page.getByRole("contentinfo").getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/license$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sharadox Verifiable Source License");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Web Applications" })).toHaveAttribute(
    "href",
    "/en#web-application",
  );
  for (const path of ["/LICENCA.md", "/LICENSE.md"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(await response.text()).toContain("Sharadox");
  }
});

test("page titles carry the whole slogan, full stop included", async ({ page }) => {
  for (const [path, title] of [
    ["/en", "Sharadox • Technologies that simplify the world."],
    ["/pt", "Sharadox • Tecnologias que simplificam o mundo."],
  ] as const) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
  }
});

test("every redirect is temporary", async ({ request }) => {
  for (const path of ["/", "/license"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(307);
  }
});

test("a chosen style stays when the language changes", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("radiogroup", { name: "Style" }).first().getByRole("radio", { name: "White" }).click();
  await page.getByRole("group", { name: "Language" }).getByRole("link", { name: "PT" }).click();
  await expect(page).toHaveURL(/\/pt$/);
  await expect(page.locator("html")).toHaveAttribute("data-style-color", "white");
});

test("addresses without a language get the remembered one, or the default", async ({ page, context }) => {
  await page.goto("/license");
  await expect(page).toHaveURL(/\/en\/license$/);
  await context.addCookies([{ name: "locale", value: "pt", url: new URL(page.url()).origin }]);
  await page.goto("/license");
  await expect(page).toHaveURL(/\/pt\/license$/);
});

test("missing pages answer 404 with the site's own page, in their language", async ({ page, request }) => {
  for (const [path, heading] of [
    ["/pt/nada-aqui", "Esta página está fora do mapa."],
    ["/report.pdf", "This page is off the map."],
  ] as const) {
    expect((await request.get(path)).status(), path).toBe(404);
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(page.getByText(path, { exact: true })).toBeVisible();
  }
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
