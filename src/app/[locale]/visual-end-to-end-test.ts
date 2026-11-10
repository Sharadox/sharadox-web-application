import { expect, test } from "@playwright/test";
import { prepareVisualSnapshot } from "@sharadox/web-library/test/visual-snapshot";

// Black (dark devices) in both languages, and White (light devices) once.
for (const [locale, colorScheme, name] of [
  ["en", "dark", "home-en"],
  ["pt", "dark", "home-pt"],
  ["en", "light", "home-en-white"],
] as const) {
  test(`${name} looks right`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await prepareVisualSnapshot(page, `/${locale}`);
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [page.locator("canvas")],
      timeout: 40000,
    });
  });
}
