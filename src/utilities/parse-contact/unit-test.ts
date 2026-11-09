import { describe, expect, it } from "vitest";
import { parseContact } from ".";

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) data.set(name, value);
  return data;
};
const valid = { name: " Ana ", email: "ana@example.com", message: "Hello", "started-at": "1000", locale: "pt" };

describe("parseContact", () => {
  it("accepts and trims a valid message", () => {
    expect(parseContact(form(valid), 10_000)).toEqual({
      kind: "valid",
      value: { name: "Ana", email: "ana@example.com", company: "", message: "Hello", locale: "pt" },
    });
  });
  it("flags the honeypot and too-fast submissions as bots", () => {
    expect(parseContact(form({ ...valid, website: "spam" }), 10_000).kind).toBe("bot");
    expect(parseContact(form(valid), 2000).kind).toBe("bot");
  });
  it("rejects missing fields and bad emails", () => {
    expect(parseContact(form({ ...valid, name: "" }), 10_000).kind).toBe("invalid");
    expect(parseContact(form({ ...valid, email: "ana@example" }), 10_000).kind).toBe("invalid");
  });
  it("caps field lengths", () => {
    const parsed = parseContact(form({ ...valid, message: "a".repeat(6000) }), 10_000);
    expect(parsed.kind === "valid" && parsed.value.message.length).toBe(5000);
  });
});
