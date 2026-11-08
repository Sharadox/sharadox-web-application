import { expect, test, type Page } from "@playwright/test";

/** Scrolls through the page so every reveal-on-scroll fires, then returns to the top with time frozen. */
async function settle(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 400) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(60);
    await page.clock.runFor(400);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(60);
  await page.clock.runFor(4000);
}

for (const locale of ["en", "pt"]) {
  test(`home (${locale}) looks right`, async ({ page }) => {
    // Freeze time: timers and animations only move when the test advances the clock.
    await page.clock.install({ time: new Date("2026-11-08T12:00:00Z") });
    await page.clock.pauseAt(new Date("2026-11-08T12:00:01Z"));
    await page.goto(`/${locale}`);
    await page.evaluate(() => document.fonts.ready);
    await settle(page);
    await expect(page).toHaveScreenshot(`home-${locale}.png`, {
      fullPage: true,
      mask: [page.locator("canvas")],
      timeout: 20000,
    });
  });
}
