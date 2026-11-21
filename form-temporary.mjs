import { chromium } from "@playwright/test";
const [url, shot, language] = process.argv.slice(2);
const words =
  language === "pt"
    ? {
        company: "Teste Sharadox",
        message: "Mensagem de teste: sem fundo, texto e botão na cor do tema.\nSegunda linha.",
      }
    : {
        company: "Sharadox Test",
        message: "Test message: no background, text and button in the theme's color.\nSecond line.",
      };
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  extraHTTPHeaders: { "x-vercel-trusted-oidc-idp-token": process.env.VERCEL_OIDC_TOKEN },
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
const form = page.locator("form").filter({ has: page.locator("textarea[name=message]") });
await form.scrollIntoViewIfNeeded();
await form.locator('[name="name"]').fill("Micael Pires");
await form.locator('[name="company"]').fill(words.company);
await form.locator('[name="email"]').fill("micaelpires@sharadox.com");
await form.locator('input[type="tel"]').fill("919002911");
if (await form.locator('[name="place"]').count()) await form.locator('[name="place"]').fill("Almancil");
const choices = form.locator('input[type="checkbox"]');
for (const i of [0, 1]) await choices.nth(i).check({ force: true });
await form.locator('[name="message"]').fill(words.message);
await page.waitForTimeout(8000);
await form.getByRole("button", { name: /send|enviar/i }).click();
await page.waitForTimeout(12000);
const body = await page.locator("body").innerText();
console.log(shot, /Thank you|Obrigado/.test(body) ? "sent" : "NOT CONFIRMED");
await browser.close();
