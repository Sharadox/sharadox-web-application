import { expect, it } from "vitest";
import { translate } from ".";

it("returns the copy for the locale", () => {
  expect(translate({ en: "Hello", pt: "Olá" }, "pt")).toBe("Olá");
});
