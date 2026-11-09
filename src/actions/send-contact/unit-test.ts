import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-forwarded-for": "1.2.3.4" }) }));
vi.mock("@sharadox/email-web-library", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@sharadox/email-web-library")>()),
  createEmailSender: () => ({ send }),
}));

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) data.set(name, value);
  return data;
};
const valid = {
  name: "Ana",
  email: "ana@example.com",
  message: "<b>Hi</b>",
  company: "Café",
  "started-at": "1",
  locale: "pt",
};

describe("sendContact", () => {
  beforeEach(() => {
    vi.resetModules();
    send.mockReset();
    send.mockResolvedValue({ messageId: "<id@example.com>", accepted: ["email@sharadox.com"], rejected: [] });
    vi.stubEnv("EMAIL_SERVER_HOST", "smtp.example.com");
    vi.stubEnv("EMAIL_SERVER_USERNAME", "AKIAEXAMPLE");
    vi.stubEnv("EMAIL_SENDER_ADDRESS", "web@email.sharadox.com");
    vi.stubEnv("EMAIL_SERVER_PASSWORD", "secret");
  });
  const load = async () => (await import(".")).sendContact;

  it("sends from the sender address to the inbox, with the visitor as reply-to and escaped html", async () => {
    const sendContact = await load();
    expect(await sendContact({ status: "idle" }, form(valid))).toEqual({ status: "sent" });
    const message = send.mock.calls[0]![0];
    expect(message.from).toEqual({ name: "Sharadox Website", address: "web@email.sharadox.com" });
    expect(message.to).toBe("email@sharadox.com");
    expect(message.replyTo).toEqual({ name: "Ana", address: "ana@example.com" });
    expect(message.html).toContain("&lt;b&gt;Hi&lt;/b&gt;");
  });
  it("fakes success for bots without sending", async () => {
    const sendContact = await load();
    expect(await sendContact({ status: "idle" }, form({ ...valid, website: "spam" }))).toEqual({ status: "sent" });
    expect(send).not.toHaveBeenCalled();
  });
  it("reports invalid input, missing configuration, delivery failures and the rate limit", async () => {
    const sendContact = await load();
    expect((await sendContact({ status: "idle" }, form({ ...valid, email: "ana" }))).status).toBe("invalid");
    send.mockRejectedValueOnce(new Error("connection refused"));
    expect((await sendContact({ status: "idle" }, form(valid))).status).toBe("failed");
    for (let attempt = 0; attempt < 4; attempt++) await sendContact({ status: "idle" }, form(valid));
    expect((await sendContact({ status: "idle" }, form(valid))).status).toBe("rate-limited");
    vi.resetModules();
    vi.stubEnv("EMAIL_SERVER_HOST", "");
    expect((await (await load())({ status: "idle" }, form(valid))).status).toBe("failed");
  });
});
