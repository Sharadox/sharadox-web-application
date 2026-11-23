import { expect, test } from "@sharadox/test-web-library/end-to-end-test";

test("the portfolio shows Luis Pires Decor with its services and launch day, and leads to its own page", async ({
  page,
}) => {
  await page.goto("/en#portfolio");
  const project = page.getByRole("article", { name: /Luis Pires Decor/ });
  await expect(project.getByRole("img", { name: "Luis Pires Decor on a computer and on a phone" })).toBeVisible();
  await expect(project.getByRole("listitem")).toHaveText([
    "Rebranding",
    "Branding Design",
    "Website",
    "Hosting",
    "Professional Email",
    "PWA",
  ]);
  await expect(project.getByText("17 November 2026").first()).toBeVisible();
  // The computer's window is as tall as its screenshot (1440 by 900) and its bar, never stretched taller.
  const window = await project
    .locator("img")
    .first()
    .evaluate((image) => {
      const frame = image.parentElement!.parentElement!.getBoundingClientRect();
      const shown = image.parentElement!.getBoundingClientRect();
      return { frame: frame.height, screen: shown.height, width: shown.width };
    });
  expect(Math.abs(window.screen - (window.width * 900) / 1440)).toBeLessThanOrEqual(1);
  expect(window.frame - window.screen).toBeLessThan(60);
  await expect(project.getByRole("link", { name: /Visit/ })).toHaveCount(0);
  await project.getByRole("link", { name: "See the Project" }).click();
  await expect(page).toHaveURL(/\/en\/portfolio\/luis-pires-decor-website-and-rebranding$/, { timeout: 15_000 });
});

test("the project's page shows a few of the site's parts, each explained and live, a demo form, and ends with the site", async ({
  page,
}) => {
  await page.goto("/en/portfolio/luis-pires-decor-website-and-rebranding");
  await expect(page).toHaveTitle("Luis Pires Decor Website & Rebranding · Sharadox Portfolio");
  // The page's own title (the client's hero inside has its own).
  await expect(page.locator("article > section").first().getByRole("heading", { level: 1 })).toHaveText(
    "Luis Pires Decor Website & RebrandingA craft of decades, now easy to find.",
  );
  await expect(page.getByText(/A few of the parts we're proudest of/)).toBeVisible();
  // Five parts, not the whole page: each with how it works, then the part itself, live.
  // (The client's photo viewers keep their own guest layer at the end of the page, outside main.)
  await expect(page.locator("main [data-guest]")).toHaveCount(5);
  await expect(page.getByText("Live · luispiresdecor.com")).toHaveCount(5);
  await expect(page.getByText("How it works")).toHaveCount(5);
  // Each part runs across the whole page, as wide as on the client's own site.
  for (const part of await page.locator("main [data-guest]").all())
    expect((await part.boundingBox())!.width).toBe(page.viewportSize()!.width);
  // Their photos load from the client's own site.
  const photo = page.locator("[data-guest] img").first();
  await photo.scrollIntoViewIfNeeded();
  await expect(photo).toHaveAttribute("src", /luispiresdecor\.com/);
  // The booking form checks itself, then says it's a demo, sending nothing.
  const booking = page.locator("#book-a-visit");
  await booking.locator('input[name="name"]').fill("Ana");
  await booking.locator("#booking-phone").fill("912 345 678");
  await expect(booking.locator('input[name="phone"]')).toHaveValue("+351 912345678");
  await booking.getByRole("button", { name: /Send/i }).click();
  await expect(booking.getByRole("status")).toContainText("This is a demo, so nothing was sent.");
  // Its buttons keep the client's own look (dark type on gold), not this site's.
  await expect(booking.getByRole("button", { name: /Send/i })).toHaveCSS("color", "rgb(18, 13, 4)");
  // The photo viewer opens in the client's look too, its round buttons outlined, and closes with Escape.
  await page.locator("[data-guest]:has(#portfolio) button:has(img)").first().click();
  const viewer = page.getByRole("dialog");
  await expect(viewer).toBeVisible();
  await expect(viewer.locator("xpath=..")).toHaveAttribute("data-guest");
  await expect(viewer.getByRole("button", { name: "Close" })).not.toHaveCSS("border-top-width", "0px");
  await page.keyboard.press("Escape");
  await expect(viewer).toHaveCount(0);
  // It's a demo: the client's links lead nowhere (no jump to the form, no other page).
  const book = page.locator("main [data-guest]").first().getByRole("link", { name: "Book a Visit" });
  await book.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => [location.href, scrollY]);
  await book.click();
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => [location.href, scrollY])).toEqual(before);
  // The way to the site comes only at the end, in a new tab.
  await expect(page.getByRole("heading", { level: 2, name: "See it live", exact: true })).toBeVisible();
  const visit = page.getByRole("link", { name: "Visit luispiresdecor.com" });
  await expect(visit).toHaveCount(1);
  await expect(visit).toHaveAttribute("href", "https://luispiresdecor.com");
  await expect(visit).toHaveAttribute("target", "_blank");
  // The way back leads to the project's own button in the portfolio, in view.
  await page.getByRole("link", { name: "Back to the Portfolio" }).click();
  await expect(page).toHaveURL(/\/en#see-luis-pires-decor-website-and-rebranding$/, { timeout: 15_000 });
  await expect(page.getByRole("link", { name: "See the Project" })).toBeInViewport({ timeout: 10_000 });
});

test("on phones, the fabric studio's cushion sticks right under the bar, and the end's buttons are centered", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/portfolio/luis-pires-decor-website-and-rebranding");
  const studio = page.locator("main [data-guest]:has(#fabrics)");
  // Scrolled through the studio, the cushion stops at the bar's edge and stays there a while.
  const tops = await studio.evaluate(async (element) => {
    const sticky = [...element.querySelectorAll("*")].find((child) => getComputedStyle(child).position === "sticky");
    const start = element.getBoundingClientRect().top + scrollY;
    const seen: number[] = [];
    for (let y = 0; y < element.scrollHeight; y += 80) {
      scrollTo(0, start + y);
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      seen.push(Math.round(sticky!.getBoundingClientRect().top));
    }
    return seen;
  });
  expect(tops.filter((top) => top === 65).length).toBeGreaterThan(2);
  expect(Math.min(...tops.filter((top) => top > 0))).toBe(65);
  const actions = page.getByRole("link", { name: "Visit luispiresdecor.com" }).locator("xpath=..");
  const [box, first, last] = await Promise.all([
    actions.boundingBox(),
    actions.locator("a").first().boundingBox(),
    actions.locator("a").last().boundingBox(),
  ]);
  expect(
    Math.abs(first!.x - box!.x - (box!.x + box!.width - Math.max(first!.x + first!.width, last!.x + last!.width))),
  ).toBeLessThanOrEqual(2);
});

test("a project's earlier address leads to its current one, temporarily", async ({ request }) => {
  const response = await request.get("/pt/portfolio/luis-pires-decor", { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toBe("/pt/portfolio/luis-pires-decor-website-and-rebranding");
});
