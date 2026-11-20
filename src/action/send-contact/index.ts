"use server";
import { sendContact } from "@sharadox/sharadox-web-library/action/send-contact";
import type { ContactState } from "@sharadox/sharadox-web-library/action/send-contact/type";
import { headers } from "next/headers";
import { clientAddress } from "@sharadox/web-library/request/client-address";

/** The contact form's server action: adds the visitor's ip address (for rate limiting) and sends the message. */
export async function sendContactAction(_: ContactState, form: FormData): Promise<ContactState> {
  const ip = clientAddress(await headers());
  return sendContact(form, ip);
}
