import { expect, test } from "@playwright/test";
import { prepareVisualSnapshot } from "@sharadox/test-web-library/visual-snapshot";

// The default style (Black) in both languages, White once (as a visitor who picked it), and the license page.
for (const [path, style, name] of [
  ["/en", undefined, "home-en"],
  ["/pt", undefined, "home-pt"],
  ["/en", "white", "home-en-white"],
  ["/pt/license", undefined, "license-pt"],
  ["/en/off-the-map", undefined, "not-found-en"],
] as const) {
  test(`${name} looks right`, async ({ page }) => {
    if (style) await page.addInitScript((chosen) => localStorage.setItem("style", chosen), style);
    await prepareVisualSnapshot(page, path);
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [page.locator("canvas")],
      timeout: 40000,
    });
  });
}
