/** A validated contact form submission. */
export interface ContactMessage {
  name: string;
  email: string;
  company: string;
  message: string;
  locale: string;
}

export type ParsedContact = { kind: "bot" } | { kind: "invalid" } | { kind: "ok"; value: ContactMessage };
