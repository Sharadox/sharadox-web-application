import { expect, test } from "@playwright/test";
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

test("the license page shows the Portuguese original and the English translation, and links back home", async ({
  page,
  request,
}) => {
  await page.goto("/pt");
  await page.getByRole("contentinfo").getByRole("link", { name: "Licença" }).click();
  await expect(page).toHaveURL(/\/pt\/license$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Licença Sharadox de Código Verificável");
  await page.getByRole("contentinfo").getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/license$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sharadox Verifiable Source License");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Web", exact: true })).toHaveAttribute(
    "href",
    "/en#web",
  );
  for (const path of ["/LICENCA.md", "/LICENSE.md"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(await response.text()).toContain("Sharadox");
  }
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

test("on the home page the logo glides back to the top instead of reloading", async ({ page }) => {
  await page.goto("/en");
  await page.mouse.wheel(0, 2500);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(1000);
  await page.evaluate(() => ((window as unknown as { marker: boolean }).marker = true));
  await page.getByRole("banner").getByRole("link").first().click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(5);
  // The same document: nothing reloaded.
  expect(await page.evaluate(() => (window as unknown as { marker?: boolean }).marker)).toBe(true);
});

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

test("the footer leads to the privacy policy", async ({ page }) => {
  await page.goto("/pt");
  await page.getByRole("contentinfo").getByRole("link", { name: "Política de Privacidade" }).click();
  await expect(page).toHaveURL(/\/pt\/privacy$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Política de Privacidade");
});

test("the footer carries the complaints book and the consumer dispute notice", async ({ page }) => {
  await page.goto("/pt");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "Livro de Reclamações" })).toHaveAttribute(
    "href",
    "https://www.livroreclamacoes.pt/",
  );
  await expect(footer.getByRole("link", { name: /CIMAAL/ })).toHaveAttribute("href", "https://www.consumoalgarve.pt/");
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

describeSocialImages({ locales: LOCALES.locales, images: SOCIAL_IMAGES });

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

test("the open phone menu and the bar are one surface, from the top of the screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await page.getByRole("button", { name: "Open menu" }).click();
  expect((await page.locator("#menu").boundingBox())!.y).toBe(0);
  // Only the bar's hairline stands between them.
  await expect(page.getByRole("banner")).not.toHaveCSS("border-bottom-color", "rgba(0, 0, 0, 0)");
});

test("a project's earlier address leads to its current one, temporarily", async ({ request }) => {
  const response = await request.get("/pt/portfolio/luis-pires-decor", { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toBe("/pt/portfolio/luis-pires-decor-website-and-rebranding");
});

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
