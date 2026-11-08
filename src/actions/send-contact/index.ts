"use server";
import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { headers } from "next/headers";
import { escapeHtml } from "@/utilities/escape-html";
import { parseContact } from "@/utilities/parse-contact";
import { createRateLimiter } from "@/utilities/rate-limit";
import type { ContactState } from "./type";

const allow = createRateLimiter({ window: 60 * 60 * 1000, max: 5 });

/** Sends a contact form message to the Sharadox inbox through AWS SES, with the visitor as reply-to. */
export async function sendContact(_: ContactState, form: FormData): Promise<ContactState> {
  const parsed = parseContact(form);
  // Bots get a fake success so they don't retry.
  if (parsed.kind === "bot") return { status: "ok" };
  if (parsed.kind === "invalid") return { status: "invalid" };
  const { name, email, company, message, locale } = parsed.value;

  const ip = ((await headers()).get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
  if (!allow(ip)) return { status: "rate" };

  const { SES_REGION, SES_ACCESS_KEY_ID, SES_SECRET_ACCESS_KEY } = process.env;
  if (!SES_REGION || !SES_ACCESS_KEY_ID || !SES_SECRET_ACCESS_KEY) {
    console.error("contact: SES env vars missing");
    return { status: "failed" };
  }
  const to = process.env.CONTACT_TO || "email@sharadox.com";
  const from = process.env.CONTACT_FROM || "Sharadox Website <website@sharadox.com>";
  const subject = `New project enquiry — ${name}${company ? ` (${company})` : ""}`;
  const text = `Name: ${name}\nEmail: ${email}\nCompany: ${company || "—"}\nLanguage: ${locale}\nIP: ${ip}\n\n${message}`;
  const html = `<div style="font-family:-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#111">
    <p style="color:#666;font-size:13px;margin:0 0 16px">New enquiry from sharadox.com (${escapeHtml(locale)})</p>
    <p style="margin:0"><b>${escapeHtml(name)}</b>${company ? ` · ${escapeHtml(company)}` : ""}<br><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
    <hr style="border:0;border-top:1px solid #eee;margin:18px 0">
    <p style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</p></div>`;

  try {
    const ses = new SESv2Client({
      region: SES_REGION,
      credentials: { accessKeyId: SES_ACCESS_KEY_ID, secretAccessKey: SES_SECRET_ACCESS_KEY },
    });
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: from,
        Destination: { ToAddresses: [to] },
        ReplyToAddresses: [email],
        Content: {
          Simple: {
            Subject: { Data: subject, Charset: "UTF-8" },
            Body: { Text: { Data: text, Charset: "UTF-8" }, Html: { Data: html, Charset: "UTF-8" } },
          },
        },
      }),
    );
    return { status: "ok" };
  } catch (e) {
    console.error("contact: SES send failed", e);
    return { status: "failed" };
  }
}
