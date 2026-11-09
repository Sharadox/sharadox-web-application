import { expect, test } from "@playwright/test";
import { prepareVisualSnapshot } from "@sharadox/web-library/test/visual-snapshot";

for (const locale of ["en", "pt"]) {
  test(`home (${locale}) looks right`, async ({ page }) => {
    await prepareVisualSnapshot(page, `/${locale}`);
    await expect(page).toHaveScreenshot(`home-${locale}.png`, {
      fullPage: true,
      mask: [page.locator("canvas")],
      timeout: 40000,
    });
  });
}
