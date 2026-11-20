import { expect, test } from "@playwright/test";
import { describeConsumerNotices } from "@sharadox/test-web-library/consumer-notice-suite";
import { describeSocialImages } from "@sharadox/test-web-library/social-image-suite";
import { SOCIAL_IMAGES } from "@sharadox/metadata-web-library/social-image";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";
import { describeInstallability } from "@sharadox/test-web-library/installability-suite";
import { describeLocaleMemory, describeStyleMemory } from "@sharadox/test-web-library/preference-suite";
import { describeSearchEngine } from "@sharadox/test-web-library/search-engine-suite";

describeSearchEngine({
  origin: "https://sharadox.com",
  structuredDataTypes: ["Organization", "WebSite"],
  pages: [
    { path: "/en", language: "en", heading: "Technologies" },
    { path: "/pt", language: "pt-PT", heading: "Tecnologias" },
    { path: "/en/license", language: "en", heading: "Sharadox Verifiable Source License" },
    { path: "/en/privacy", language: "en", heading: "Privacy Policy" },
    { path: "/pt/privacy", language: "pt-PT", heading: "Política de Privacidade" },
  ],
  routes: [
    "/en/opengraph-image",
    "/pt/twitter-image",
    "/llms.txt",
    "/.well-known/security.txt",
    // Every app icon, made from the one master (src/app/icon.svg).
    "/icon.svg",
    "/favicon.ico",
    "/apple-icon.png",
    "/icon-192.png",
    "/icon-512.png",
    "/icon-maskable-512.png",
    "/profile-picture.png",
  ],
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

test("page titles carry the whole slogan, full stop included", async ({ page }) => {
  for (const [path, title] of [
    ["/en", "Sharadox · Technologies that simplify the world."],
    ["/pt", "Sharadox · Tecnologias que simplificam o mundo."],
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

test("switching language happens in place: no reload, no replayed entrance", async ({ page }) => {
  await page.goto("/en");
  await page.evaluate(() => Object.assign(window, { samePage: true }));
  await page.mouse.wheel(0, 1200);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(1000);
  await page.getByRole("group", { name: "Language" }).getByRole("link", { name: "PT" }).click();
  await expect(page).toHaveURL(/\/pt$/);
  await expect(page.locator("html")).toHaveAttribute("data-soft-navigation", "");
  expect(await page.evaluate(() => (window as unknown as { samePage?: boolean }).samePage)).toBe(true);
  const heroLine = page.locator("#home h1 span span").first();
  await expect(heroLine).not.toHaveAttribute("style", /110%/);
  // Once the skipped entrances would have finished, the page animates normally again.
  await expect(page.locator("html")).not.toHaveAttribute("data-soft-navigation", "", { timeout: 8000 });
});

test("switching language keeps the reader on the same section", async ({ page }) => {
  await page.goto("/en");
  await page.locator("#process h2").scrollIntoViewIfNeeded();
  await page
    .locator("#process")
    .evaluate((section) => scrollTo({ top: section.getBoundingClientRect().top + scrollY - 80, behavior: "instant" }));
  await page.getByRole("group", { name: "Language" }).getByRole("link", { name: "PT" }).click();
  await expect(page).toHaveURL(/\/pt$/);
  await expect(page.locator("#process h2")).toBeInViewport();
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

test("the footer leads to the privacy policy", async ({ page }) => {
  await page.goto("/pt");
  await page.getByRole("contentinfo").getByRole("link", { name: "Política de Privacidade" }).click();
  await expect(page).toHaveURL(/\/pt\/privacy$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Política de Privacidade");
});

test("the cookie panel only tells, once, and Cookie Preferences shows the details", async ({ browser }) => {
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const page = await context.newPage();
  await page.goto("/en");
  const panel = page.getByRole("dialog", { name: "Cookies" });
  await expect(panel.getByRole("button", { name: "Deny" })).toHaveCount(0);
  await panel.getByRole("button", { name: "Got It" }).click();
  await expect(panel).toBeHidden();
  await page.reload();
  await expect(panel).toBeHidden();
  await page.getByRole("contentinfo").getByRole("button", { name: "Cookie Preferences" }).click();
  await expect(panel.getByText(/Your language/)).toBeVisible();
  await context.close();
});

describeSocialImages({ locales: LOCALES.locales, images: SOCIAL_IMAGES });

test("links that leave the site open in a new tab, and the footer's networks are centered", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const footer = page.getByRole("contentinfo");
  for (const name of ["Review us on Google", "contact@sharadox.com", "Livro de Reclamações (Complaints Book)"])
    await expect(footer.getByRole("link", { name }).first()).toHaveAttribute("target", "_blank");
  const networks = footer.getByRole("navigation", { name: "Sharadox elsewhere" });
  const [box, first, last] = await Promise.all([
    networks.boundingBox(),
    networks.getByRole("link").first().boundingBox(),
    networks.getByRole("link").last().boundingBox(),
  ]);
  const left = first!.x - box!.x;
  const right = box!.x + box!.width - (last!.x + last!.width);
  expect(Math.abs(left - right)).toBeLessThanOrEqual(2);
  // The legal links two to a row, the last one alone centered under both.
  const legal = footer.getByRole("navigation", { name: "Legal" });
  const [area, lone] = await Promise.all([legal.boundingBox(), legal.locator("> *").last().boundingBox()]);
  expect(Math.abs(lone!.x - area!.x - (area!.x + area!.width - (lone!.x + lone!.width)))).toBeLessThanOrEqual(2);
});

describeConsumerNotices("/pt");
