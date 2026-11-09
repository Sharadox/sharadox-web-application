"use server";
import { sendContact } from "@sharadox/sharadox-web-library/action/send-contact";
import type { ContactState } from "@sharadox/sharadox-web-library/action/send-contact/type";
import { headers } from "next/headers";

/** The contact form's server action: adds the visitor's ip address (for rate limiting) and sends the message. */
export async function sendContactAction(_: ContactState, form: FormData): Promise<ContactState> {
  const ip = ((await headers()).get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
  return sendContact(form, ip);
}
