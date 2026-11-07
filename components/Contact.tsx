"use client";
import { AnimatePresence, motion } from "motion/react";
import { useActionState, useEffect, useState } from "react";
import { sendContact, type ContactState } from "@/app/actions";
import { copy, SITE, tr, type Locale } from "@/content";
import { useSpotlight } from "./Effects";
import { Reveal } from "./Reveal";

export function Contact({ l }: { l: Locale }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });
  const [t, setT] = useState(0);
  useEffect(() => setT(Date.now()), []);
  const ref = useSpotlight<HTMLFormElement>();
  const c = copy.contact;
  return (
    <section className="section contact" id="contact">
      <div className="contact-glow" aria-hidden />
      <Reveal className="contact-head">
        <p className="eyebrow mono">{tr(c.eyebrow, l)}</p>
        <h2>{tr(c.title, l)}</h2>
        <p className="contact-text">{tr(c.text, l)}</p>
        <p className="contact-direct">
          <span className="mono">{tr(c.direct, l)}</span>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <AnimatePresence mode="wait">
          {state.status === "ok" ? (
            <motion.div key="ok" className="form form-done" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} role="status">
              <svg viewBox="0 0 48 48" className="check" aria-hidden><circle cx="24" cy="24" r="22" /><path d="M14 24.5l7 7 13-14" /></svg>
              <p>{tr(c.ok, l)}</p>
            </motion.div>
          ) : (
            <motion.form key="form" ref={ref} action={action} className="form" exit={{ opacity: 0, scale: 0.98 }}>
              <input type="hidden" name="t" value={t} />
              <input type="hidden" name="locale" value={l} />
              <div className="hp" aria-hidden>
                <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
              </div>
              <div className="field-row">
                <label className="field"><span>{tr(c.name, l)}</span><input name="name" required autoComplete="name" maxLength={120} /></label>
                <label className="field"><span>{tr(c.email, l)}</span><input name="email" type="email" required autoComplete="email" maxLength={200} /></label>
              </div>
              <label className="field"><span>{tr(c.company, l)}</span><input name="company" autoComplete="organization" maxLength={160} /></label>
              <label className="field"><span>{tr(c.message, l)}</span><textarea name="message" required rows={5} maxLength={5000} /></label>
              {state.status !== "idle" && (
                <p className="form-error" role="alert">
                  {state.status === "failed" ? <>{tr(c.errors.failed, l)} <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</> : tr(c.errors[state.status], l)}
                </p>
              )}
              <button className="btn btn-white btn-block" disabled={pending}>
                {pending ? tr(c.sending, l) : tr(c.send, l)}
                {!pending && <span className="arrow" aria-hidden>→</span>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}
