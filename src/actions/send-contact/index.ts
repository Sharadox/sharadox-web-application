"use server";
import { createEmailSender, EmailError, readEmailServerConfiguration } from "@sharadox/email-web-library";
import { headers } from "next/headers";
import { SITE } from "@/content/site";
import { escapeHtml } from "@/utilities/escape-html";
import { parseContact } from "@/utilities/parse-contact";
import { createRateLimiter } from "@/utilities/rate-limit";
import type { ContactState } from "./type";

const allow = createRateLimiter({ window: 60 * 60 * 1000, maximum: 5 });

/**
 * Sends a contact form message to the Sharadox inbox through the email server in the `EMAIL_SERVER_*` environment
 * variables (Amazon SES over SMTP), with the visitor as reply-to. The sender is `EMAIL_SENDER_ADDRESS`, an address on
 * the sending subdomain verified in SES (email.sharadox.com), so the main domain's reputation stays separate.
 */
export async function sendContact(_: ContactState, form: FormData): Promise<ContactState> {
  const parsed = parseContact(form);
  // Bots get a fake success so they don't retry.
  if (parsed.kind === "bot") return { status: "sent" };
  if (parsed.kind === "invalid") return { status: "invalid" };
  const { name, email, company, message, locale } = parsed.value;

  const ip = ((await headers()).get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
  if (!allow(ip)) return { status: "rate-limited" };

  const subject = `New project enquiry — ${name}${company ? ` (${company})` : ""}`;
  const text = `Name: ${name}\nEmail: ${email}\nCompany: ${company || "—"}\nLanguage: ${locale}\nIP: ${ip}\n\n${message}`;
  const html = `<div style="font-family:-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#111">
    <p style="color:#666;font-size:13px;margin:0 0 16px">New enquiry from sharadox.com (${escapeHtml(locale)})</p>
    <p style="margin:0"><b>${escapeHtml(name)}</b>${company ? ` · ${escapeHtml(company)}` : ""}<br><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
    <hr style="border:0;border-top:1px solid #eee;margin:18px 0">
    <p style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</p></div>`;

  try {
    const configuration = readEmailServerConfiguration();
    await createEmailSender(configuration).send({
      from: { name: "Sharadox Website", address: process.env.EMAIL_SENDER_ADDRESS || configuration.username },
      to: SITE.email,
      replyTo: { name: name.replace(/[\r\n]+/g, " "), address: email },
      subject: subject.replace(/[\r\n]+/g, " ").slice(0, 300),
      text,
      html,
    });
    return { status: "sent" };
  } catch (error) {
    if (error instanceof EmailError && error.code === "invalid-message") return { status: "invalid" };
    console.error("contact: sending failed", error);
    return { status: "failed" };
  }
}
