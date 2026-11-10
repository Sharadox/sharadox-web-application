import { expect, test } from "@playwright/test";

test("both languages render with full SEO metadata", async ({ page }) => {
  for (const [locale, language, heading] of [
    ["en", "en", "Technologies"],
    ["pt", "pt-PT", "Tecnologias"],
  ] as const) {
    await page.goto(`/${locale}`);
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://sharadox.com/${locale}`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    const structuredData = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
    expect(structuredData["@graph"].map((node: { "@type": string }) => node["@type"])).toEqual([
      "Organization",
      "WebSite",
    ]);
    expect(structuredData["@graph"][0].hasOfferCatalog.itemListElement).toHaveLength(5);
  }
});

test("share image, sitemap and robots are served", async ({ request }) => {
  for (const path of [
    "/en/opengraph-image",
    "/pt/twitter-image",
    "/sitemap.xml",
    "/robots.txt",
    "/manifest.webmanifest",
  ]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
});

test("the language follows the browser until the visitor picks one, then is remembered", async ({ browser }) => {
  test.setTimeout(30_000);
  const context = await browser.newContext({ locale: "pt-PT" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/pt$/);
  await page.getByRole("group", { name: "Idioma" }).getByRole("link", { name: "EN" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await context.close();
});

test("the style follows the device until the visitor picks one, then is remembered", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "light" });
  const page = await context.newPage();
  const html = page.locator("html");
  await page.goto("/en");
  await expect(html).toHaveAttribute("data-style", "white");
  const picker = page.getByRole("banner").getByRole("radiogroup", { name: "Style" });
  await expect(picker.getByRole("radio", { name: "System" })).toBeChecked();
  await picker.getByRole("radio", { name: "Black" }).click();
  await expect(html).toHaveAttribute("data-style", "black");
  await page.reload();
  await expect(html).toHaveAttribute("data-style", "black");
  await expect(picker.getByRole("radio", { name: "Black" })).toBeChecked();
  await picker.getByRole("radio", { name: "System" }).click();
  await page.reload();
  await expect(html).toHaveAttribute("data-style", "white");
  await context.close();
});

test("contact form falls back to the email address when sending is unavailable", async ({ page }) => {
  // No email server in tests, so a valid message must surface the direct email instead of failing silently.
  await page.goto("/en#contact");
  const form = page.locator("form");
  await form.getByLabel("Name").fill("Test Person");
  await form.getByLabel("Email").fill("test@example.com");
  await form.getByLabel("Graphic Design").check();
  await form.getByLabel("Tell us about your project").fill("A website.");
  await page.waitForTimeout(2600); // humans take longer than the bot threshold
  await form.getByRole("button", { name: /Send message/ }).click();
  await expect(form.getByRole("alert")).toContainText("email@sharadox.com");
});
