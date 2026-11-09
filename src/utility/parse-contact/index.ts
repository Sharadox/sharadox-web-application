import type { ParsedContact } from "./type";

/** Humans take longer than this to fill the form, in milliseconds. */
const MINIMUM_FILL_TIME = 2500;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const field = (form: FormData, name: string, maximumLength: number) =>
  String(form.get(name) ?? "")
    .trim()
    .slice(0, maximumLength);

/** Reads and validates the contact form, flagging likely bots (honeypot filled or submitted too fast). */
export function parseContact(form: FormData, now = Date.now()): ParsedContact {
  const started = Number(form.get("started-at") ?? 0);
  if (form.get("website") || (started && now - started < MINIMUM_FILL_TIME)) return { kind: "bot" };
  const value = {
    name: field(form, "name", 120),
    email: field(form, "email", 200),
    company: field(form, "company", 160),
    message: field(form, "message", 5000),
    locale: field(form, "locale", 5) || "en",
  };
  if (!value.name || !value.message || !EMAIL.test(value.email)) return { kind: "invalid" };
  return { kind: "valid", value };
}
