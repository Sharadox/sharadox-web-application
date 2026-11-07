"use server";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { headers } from "next/headers";

export type ContactState = { status: "idle" | "ok" | "invalid" | "rate" | "failed" };

const hits = new Map<string, number[]>(); // best-effort per-instance rate limit
const WINDOW = 60 * 60 * 1000, MAX = 5;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendContact(_: ContactState, form: FormData): Promise<ContactState> {
  const name = String(form.get("name") ?? "").trim().slice(0, 120);
  const email = String(form.get("email") ?? "").trim().slice(0, 200);
  const company = String(form.get("company") ?? "").trim().slice(0, 160);
  const message = String(form.get("message") ?? "").trim().slice(0, 5000);
  const honeypot = String(form.get("website") ?? "");
  const started = Number(form.get("t") ?? 0);

  // Bots: filled the hidden field or submitted inhumanly fast. Pretend success.
  if (honeypot || (started && Date.now() - started < 2500)) return { status: "ok" };
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { status: "invalid" };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (recent.length >= MAX) return { status: "rate" };
  hits.set(ip, [...recent, now]);

  const { SES_REGION, SES_ACCESS_KEY_ID, SES_SECRET_ACCESS_KEY } = process.env;
  if (!SES_REGION || !SES_ACCESS_KEY_ID || !SES_SECRET_ACCESS_KEY) {
    console.error("contact: SES env vars missing");
    return { status: "failed" };
  }
  const to = process.env.CONTACT_TO ?? "email@sharadox.com";
  const from = process.env.CONTACT_FROM ?? "Sharadox Website <website@sharadox.com>";
  const locale = String(form.get("locale") ?? "en");
  const subject = `New project enquiry — ${name}${company ? ` (${company})` : ""}`;
  const text = `Name: ${name}\nEmail: ${email}\nCompany: ${company || "—"}\nLanguage: ${locale}\nIP: ${ip}\n\n${message}`;
  const html = `<div style="font-family:-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#111">
    <p style="color:#666;font-size:13px;margin:0 0 16px">New enquiry from sharadox.com (${esc(locale)})</p>
    <p style="margin:0"><b>${esc(name)}</b>${company ? ` · ${esc(company)}` : ""}<br><a href="mailto:${esc(email)}">${esc(email)}</a></p>
    <hr style="border:0;border-top:1px solid #eee;margin:18px 0">
    <p style="white-space:pre-wrap;margin:0">${esc(message)}</p></div>`;

  try {
    const ses = new SESv2Client({ region: SES_REGION, credentials: { accessKeyId: SES_ACCESS_KEY_ID, secretAccessKey: SES_SECRET_ACCESS_KEY } });
    await ses.send(new SendEmailCommand({
      FromEmailAddress: from,
      Destination: { ToAddresses: [to] },
      ReplyToAddresses: [email],
      Content: { Simple: { Subject: { Data: subject, Charset: "UTF-8" }, Body: { Text: { Data: text, Charset: "UTF-8" }, Html: { Data: html, Charset: "UTF-8" } } } },
    }));
    return { status: "ok" };
  } catch (e) {
    console.error("contact: SES send failed", e);
    return { status: "failed" };
  }
}
