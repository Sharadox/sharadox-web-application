import { expect, test } from "@sharadox/test-web-library/end-to-end-test";
import { describeLogoBackToTop } from "@sharadox/test-web-library/logo-suite";

test("Back to top stays on the page it is on, and section links glide on every page", async ({ page }) => {
  await page.goto("/en/privacy");
  await page.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: /Back to top/ })
    .click();
  await expect(page).toHaveURL(/\/en\/privacy(#top)?$/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(5);
});

test("on a phone the menu lists every section and scrolls when held sideways", async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/en");
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.locator("#menu");
    await expect(menu.getByRole("link", { name: /About/ })).toBeVisible();
    const [scrollHeight, clientHeight] = await menu.evaluate((element) => [element.scrollHeight, element.clientHeight]);
    if (viewport.width > viewport.height) expect(scrollHeight).toBeGreaterThan(clientHeight!);
    await menu.evaluate((element) => element.scrollTo(0, element.scrollHeight));
    await expect(menu.getByRole("link", { name: "Start a Project" })).toBeInViewport();
    await menu.getByRole("link", { name: /Process/ }).click();
    await expect(menu).toBeHidden();
  }
});

test("tapping the logo closes the phone menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.locator("#menu")).toBeVisible();
  await page.getByRole("banner").getByRole("link").first().click();
  await expect(page.locator("#menu")).toHaveCount(0);
});

test("the section indicator stays outside the grid frame's right line", async ({ page }) => {
  for (const width of [1440, 1280, 1200]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en");
    const frame = (await page.locator("#home").boundingBox())!;
    const sections = page.getByRole("navigation", { name: "Sections" });
    // Once it has slid in, its whole box sits between the frame's right line and the window's edge.
    await sections.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
    const indicator = (await sections.boundingBox())!;
    expect(indicator.x, `at ${width}px`).toBeGreaterThanOrEqual(frame.x + frame.width);
    expect(indicator.x + indicator.width, `at ${width}px`).toBeLessThanOrEqual(width);
  }
});

test("the section indicator holds still when the section changes, and its names stay beside the frame", async ({
  page,
}) => {
  for (const width of [1440, 1600]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en");
    const sections = page.getByRole("navigation", { name: "Sections" });
    await sections.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
    const places = () =>
      sections.evaluate((element) =>
        [...element.querySelectorAll("a > span:not(:last-child)")].map((part) =>
          Math.round(part.getBoundingClientRect().x),
        ),
      );
    const before = await places();
    await page.evaluate(() => window.scrollTo(0, document.getElementById("services")!.offsetTop + 50));
    await expect(sections.locator('[aria-current="location"]')).toHaveAttribute("title", "Services");
    expect(await places()).toEqual(before);
    await sections.hover();
    const frame = (await page.locator("#home").boundingBox())!;
    for (const name of await sections.locator("a > span:last-child > span").all()) {
      await expect(name).toHaveCSS("opacity", "1");
      const box = (await name.boundingBox())!;
      expect(box.x, `at ${width}px`).toBeGreaterThanOrEqual(frame.x + frame.width);
      expect(box.x + box.width, `at ${width}px`).toBeLessThanOrEqual(width);
    }
  }
});

test("the open phone menu and the bar are one surface, from the top of the screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await page.getByRole("button", { name: "Open menu" }).click();
  expect((await page.locator("#menu").boundingBox())!.y).toBe(0);
  // Only the bar's hairline stands between them.
  await expect(page.getByRole("banner")).not.toHaveCSS("border-bottom-color", "rgba(0, 0, 0, 0)");
});

test("the top bar fits its links at every width, and the menu takes over below 1200 pixels", async ({ page }) => {
  for (const width of [1201, 1280, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/pt");
    const right = await page
      .getByRole("banner")
      .evaluate((banner) =>
        Math.max(...[...banner.querySelectorAll("*")].map((element) => element.getBoundingClientRect().right)),
      );
    expect(right, `at ${width}px`).toBeLessThanOrEqual(width);
    await expect(page.getByRole("banner").getByRole("link", { name: "Portefólio" })).toBeVisible();
  }
  await page.setViewportSize({ width: 1200, height: 800 });
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeVisible();
});

describeLogoBackToTop({ path: "/en" });
