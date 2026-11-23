import { expect, test } from "@sharadox/test-web-library/end-to-end-test";

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
