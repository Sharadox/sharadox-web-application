import { expect, test } from "@playwright/test";
import { prepareVisualSnapshot } from "@sharadox/test-web-library/visual-snapshot";

// The default style (Black) in both languages, and White once, as a visitor who picked it.
for (const [locale, style, name] of [
  ["en", undefined, "home-en"],
  ["pt", undefined, "home-pt"],
  ["en", "white", "home-en-white"],
] as const) {
  test(`${name} looks right`, async ({ page }) => {
    if (style) await page.addInitScript((chosen) => localStorage.setItem("style", chosen), style);
    await prepareVisualSnapshot(page, `/${locale}`);
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [page.locator("canvas")],
      timeout: 40000,
    });
  });
}
