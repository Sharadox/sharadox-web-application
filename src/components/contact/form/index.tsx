"use client";
import { AnimatePresence, motion } from "motion/react";
import { useActionState, useEffect, useRef } from "react";
import { sendContact } from "@/actions/send-contact";
import type { ContactState } from "@/actions/send-contact/type";
import { Button } from "@/components/button";
import { CONTACT } from "@/content/contact";
import { SITE } from "@/content/site";
import { useSpotlight } from "@/hooks/spotlight";
import { translate } from "@/utilities/translate";
import styles from "./index.module.scss";
import type { ContactFormProps } from "./type";

/** The enquiry form: honeypot and fill-time spam checks, inline errors, and an animated thank-you. */
export function ContactForm({ locale }: ContactFormProps) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });
  // When the visitor started filling the form; bots submit faster than humans can.
  const startedAt = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);
  const ref = useSpotlight<HTMLFormElement>();
  const c = CONTACT;
  return (
    <AnimatePresence mode="wait">
      {state.status === "ok" ? (
        <motion.div
          key="ok"
          className={`${styles.form} ${styles.done}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          role="status"
        >
          <svg viewBox="0 0 48 48" className={styles.check} aria-hidden>
            <circle cx="24" cy="24" r="22" />
            <path d="M14 24.5l7 7 13-14" />
          </svg>
          <p>{translate(c.ok, locale)}</p>
        </motion.div>
      ) : (
        <motion.form key="form" ref={ref} action={action} className={styles.form} exit={{ opacity: 0, scale: 0.98 }}>
          <input ref={startedAt} type="hidden" name="t" defaultValue="0" />
          <input type="hidden" name="locale" value={locale} />
          <div className={styles.honeypot} aria-hidden>
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className={styles.row}>
            <label className={styles.field}>
              <span>{translate(c.name, locale)}</span>
              <input name="name" required autoComplete="name" maxLength={120} />
            </label>
            <label className={styles.field}>
              <span>{translate(c.email, locale)}</span>
              <input name="email" type="email" required autoComplete="email" maxLength={200} />
            </label>
          </div>
          <label className={styles.field}>
            <span>{translate(c.company, locale)}</span>
            <input name="company" autoComplete="organization" maxLength={160} />
          </label>
          <label className={styles.field}>
            <span>{translate(c.message, locale)}</span>
            <textarea name="message" required rows={5} maxLength={5000} />
          </label>
          {state.status !== "idle" && (
            <p className={styles.error} role="alert">
              {state.status === "failed" ? (
                <>
                  {translate(c.errors.failed, locale)} <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
                </>
              ) : (
                translate(c.errors[state.status], locale)
              )}
            </p>
          )}
          <Button size="block" disabled={pending} arrow={!pending}>
            {pending ? translate(c.sending, locale) : translate(c.send, locale)}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
