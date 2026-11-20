import { expect, test } from "@playwright/test";

test("a service card button opens the form with its choice ticked", async ({ page }) => {
  await page.goto("/en#services");
  // The buttons tick their choice once the page's scripts are running; before that they only scroll.
  await page.waitForLoadState("networkidle");
  await page.getByRole("link", { name: "Build a Platform" }).click();
  await expect(page.locator("#contact")).toBeInViewport();
  await expect(page.locator("form").getByRole("checkbox", { name: "Platform" })).toBeChecked();
  await expect(page.locator("form").getByRole("checkbox", { name: "Website" })).not.toBeChecked();
  await page.goto("/en#marketing");
  await page.waitForLoadState("networkidle");
  await page.getByRole("link", { name: "Plan My Growth" }).click();
  await expect(page.locator("form").getByRole("checkbox", { name: "Social Media Strategy" })).toBeChecked();
  // After the services, ideas none of them name.
  await page.getByRole("link", { name: "Let's Talk" }).click();
  await expect(page.locator("form").getByRole("checkbox", { name: "What I need is not listed" })).toBeChecked();
});

test("the services come in four groups, each card with its own 3D object", async ({ page }) => {
  await page.goto("/en#services");
  for (const name of ["Web", "Desktop & Mobile", "Creative", "Marketing"])
    await expect(page.locator("#services").getByRole("heading", { level: 3, name, exact: true })).toBeVisible();
  await expect(page.locator("#services article")).toHaveCount(18);
  await expect(page.locator("#services").getByText("Didn't find the service you were looking for?")).toHaveCount(0);
});

test("the contact form says what's missing before sending, and takes a phone instead of an email", async ({ page }) => {
  await page.goto("/en#contact");
  const form = page.locator("form");
  await form.getByRole("button", { name: /Send Message/ }).click();
  await expect(form.getByLabel("Name")).toBeFocused();
  for (const text of ["Please tell us your name.", "Leave an email or a phone number", "Choose at least one option."])
    await expect(form.getByText(text)).toBeVisible();
  await form.getByLabel("Name").fill("Test Person");
  await form.getByLabel("Phone").fill("+351 912 345 678");
  await form.getByLabel("I don't know what I need").check();
  await form.getByLabel("Tell us about your project").fill("Too short.");
  await expect(form.getByText("at least 20 characters")).toBeVisible();
  await form.getByLabel("Tell us about your project").fill("We'd like to sell our cakes online.");
  await expect(form.getByText("Please tell us your name.")).toHaveCount(0);
  await expect(form.getByText("at least 20 characters")).toHaveCount(0);
});

test("the process line starts empty on phones too, and fills as you scroll", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/en");
  const line = page.locator("#process [aria-hidden] > span").first();
  const drawn = () => line.evaluate((element) => element.getBoundingClientRect().height);
  // Nothing is drawn before the reader gets there; it fills once they scroll through the steps.
  expect(await drawn()).toBeLessThan(2);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect.poll(drawn).toBeGreaterThan(200);
});

test("every service card is in the search engine offer catalog", async ({ page }) => {
  await page.goto("/en");
  const data = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "{}");
  expect(data["@graph"][0].hasOfferCatalog.itemListElement).toHaveLength(18);
});

test("the contact form falls back to the email address when sending is unavailable", async ({ page }) => {
  // No email server in tests, so a valid message must surface the direct email instead of failing silently.
  await page.goto("/en#contact");
  const form = page.locator("form");
  await form.getByLabel("Name").fill("Test Person");
  await form.getByLabel("Email", { exact: true }).fill("test@example.com");
  await form.getByLabel("Branding Design").check();
  await form.getByLabel("Tell us about your project").fill("A website for our bakery.");
  await page.waitForTimeout(2600); // humans take longer than the bot threshold
  await form.getByRole("button", { name: /Send Message/ }).click();
  await expect(form.getByRole("alert")).toContainText("contact@sharadox.com");
});

test("on a wide screen, the four service shortcuts show at the bottom of the first screen", async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1280, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/en");
    const shortcuts = page.getByRole("navigation", { name: "Services" }).first();
    await expect(shortcuts).toBeInViewport({ ratio: 1 });
  }
});

test("the About section replaces One System, and the services and groups have short addresses", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("#about")).toContainText("Your business, run from anywhere.");
  for (const id of [
    "about",
    "services",
    "web",
    "desktop-and-mobile",
    "creative",
    "marketing",
    "capabilities",
    "process",
    "contact",
  ])
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  await expect(page.locator("#touchpoints")).toHaveCount(0);
});

test("typing in the project message starts on its first line, at the top", async ({ page }) => {
  await page.goto("/en#contact");
  const message = page.getByLabel("Tell us about your project");
  await message.fill("A booking platform for three clinics.");
  const [alignment, padding] = await message.evaluate((element) => {
    const style = getComputedStyle(element);
    return [style.alignContent, style.paddingTop];
  });
  expect(alignment).toBe("start");
  expect(padding).toBe("13px");
});

test("the questions open to their answers, and are given to search engines on the home page only", async ({ page }) => {
  await page.goto("/en#faq");
  const question = page.locator("#faq details").filter({ hasText: "manual work" });
  await expect(question.getByText("That's where it helps most.")).toBeHidden();
  await question.locator("summary").click();
  await expect(question.getByText("That's where it helps most.")).toBeVisible();
  const faqPage = (texts: string[]) => texts.some((text) => text.includes('"FAQPage"'));
  expect(faqPage(await page.locator('script[type="application/ld+json"]').allTextContents())).toBe(true);
  await page.goto("/en/privacy");
  expect(faqPage(await page.locator('script[type="application/ld+json"]').allTextContents())).toBe(false);
});

test("the sections come in order, the invitation for unlisted ideas after the capabilities", async ({ page }) => {
  await page.goto("/en");
  const order = await page.evaluate(() =>
    [...document.querySelectorAll("main > section")].map(
      (section) => section.id || section.querySelector("h2")?.textContent,
    ),
  );
  expect(order).toEqual([
    "home",
    "about",
    "services",
    "capabilities",
    "Didn't find the service you were looking for?",
    "portfolio",
    "process",
    "faq",
    "contact",
  ]);
});

test("on a wide screen, the hero's copy sits in the middle of the space under the bar, the globe beside it", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  // Once the entrance has played (the globe grows in), measure.
  await page.waitForFunction(() => document.getAnimations().every((animation) => animation.playState !== "running"));
  await page.waitForTimeout(2000);
  const box = async (selector: string) => (await page.locator(selector).first().boundingBox())!;
  const copy = await box("#home > div[class*='copy']");
  const shortcuts = await box("nav[aria-label='Services']");
  const globe = await box("#home > div[class*='globe']");
  expect(Math.abs(copy.y - 64 - (shortcuts.y - copy.y - copy.height))).toBeLessThanOrEqual(2);
  expect(Math.abs(copy.y + copy.height / 2 - (globe.y + globe.height / 2))).toBeLessThanOrEqual(2);
});
