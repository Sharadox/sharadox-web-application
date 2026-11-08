import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-forwarded-for": "1.2.3.4" }) }));
vi.mock("@aws-sdk/client-sesv2", () => ({
  SESv2Client: class {
    send = send;
  },
  SendEmailCommand: class {
    constructor(public input: unknown) {}
  },
}));

const form = (fields: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
};
const valid = { name: "Ana", email: "ana@example.com", message: "<b>Hi</b>", company: "Café", t: "1", locale: "pt" };

describe("sendContact", () => {
  beforeEach(() => {
    vi.resetModules();
    send.mockReset();
    vi.stubEnv("SES_REGION", "eu-west-1");
    vi.stubEnv("SES_ACCESS_KEY_ID", "id");
    vi.stubEnv("SES_SECRET_ACCESS_KEY", "secret");
  });
  const load = async () => (await import(".")).sendContact;

  it("sends through SES with the visitor as reply-to and escaped HTML", async () => {
    const sendContact = await load();
    expect(await sendContact({ status: "idle" }, form(valid))).toEqual({ status: "ok" });
    const input = send.mock.calls[0]![0].input;
    expect(input.ReplyToAddresses).toEqual(["ana@example.com"]);
    expect(input.Destination.ToAddresses).toEqual(["email@sharadox.com"]);
    expect(input.Content.Simple.Body.Html.Data).toContain("&lt;b&gt;Hi&lt;/b&gt;");
  });
  it("fakes success for bots without sending", async () => {
    const sendContact = await load();
    expect(await sendContact({ status: "idle" }, form({ ...valid, website: "spam" }))).toEqual({ status: "ok" });
    expect(send).not.toHaveBeenCalled();
  });
  it("reports invalid input, missing configuration and the rate limit", async () => {
    const sendContact = await load();
    expect((await sendContact({ status: "idle" }, form({ ...valid, email: "x" }))).status).toBe("invalid");
    for (let i = 0; i < 5; i++) await sendContact({ status: "idle" }, form(valid));
    expect((await sendContact({ status: "idle" }, form(valid))).status).toBe("rate");
    vi.resetModules();
    vi.stubEnv("SES_REGION", "");
    expect((await (await load())({ status: "idle" }, form(valid))).status).toBe("failed");
  });
});
