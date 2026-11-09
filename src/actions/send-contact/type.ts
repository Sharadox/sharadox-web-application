/** Result of a contact form submission, shown by the form. */
export type ContactState = { status: "idle" | "sent" | "invalid" | "rate-limited" | "failed" };
