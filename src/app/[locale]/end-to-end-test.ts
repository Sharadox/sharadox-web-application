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

test("language switch moves between /en and /pt", async ({ page }) => {
  test.setTimeout(20_000);
  await page.goto("/en");
  await page.getByRole("group", { name: "Language" }).getByRole("link", { name: "PT" }).click();
  await expect(page).toHaveURL(/\/pt$/);
});

test("contact form falls back to the email address when sending is unavailable", async ({ page }) => {
  // No email server in tests, so a valid message must surface the direct email instead of failing silently.
  await page.goto("/en#contact");
  const form = page.locator("form");
  await form.getByLabel("Name").fill("Test Person");
  await form.getByLabel("Email").fill("test@example.com");
  await form.getByLabel("What are you building?").fill("A website.");
  await page.waitForTimeout(2600); // humans take longer than the bot threshold
  await form.getByRole("button", { name: /Send message/ }).click();
  await expect(form.getByRole("alert")).toContainText("email@sharadox.com");
});
