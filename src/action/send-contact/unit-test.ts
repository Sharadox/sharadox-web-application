import { beforeEach, expect, test, vi } from "vitest";

const sendContact = vi.fn(async () => ({ status: "sent" as const }));
const forwarded = { value: null as string | null };
vi.mock("@sharadox/sharadox-web-library/action/send-contact", () => ({ sendContact }));
vi.mock("next/headers", () => ({ headers: async () => ({ get: () => forwarded.value }) }));
const { sendContactAction } = await import("@sharadox/sharadox-web-application/action/send-contact");

beforeEach(() => sendContact.mockClear());

test("sends with the visitor's address, the first one of a proxied request", async () => {
  forwarded.value = " 1.2.3.4 , 10.0.0.1";
  const form = new FormData();
  expect(await sendContactAction({ status: "idle" }, form)).toEqual({ status: "sent" });
  expect(sendContact).toHaveBeenCalledWith(form, "1.2.3.4");
});

test("uses 'unknown' when the address is missing", async () => {
  forwarded.value = null;
  await sendContactAction({ status: "idle" }, new FormData());
  expect(sendContact).toHaveBeenLastCalledWith(expect.any(FormData), "unknown");
});
