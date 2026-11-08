/** Result of a contact form submission, shown by the form. */
export type ContactState = { status: "idle" | "ok" | "invalid" | "rate" | "failed" };
