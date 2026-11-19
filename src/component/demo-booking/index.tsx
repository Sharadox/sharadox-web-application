"use client";
import { ContactForm } from "@sharadox/luis-pires-decor-web-library/component/contact/form";
import styles from "./index.module.scss";
import type { DemoBookingProperties } from "@sharadox/sharadox-web-application/component/demo-booking/type";

/** The form's action, which a demo never calls (it shows its notice instead); it would leave the form as it was. */
export const sendNothing = async () => ({ status: "idle" as const });

/**
 * Luis Pires Decor's booking form, to try on the showcase: it checks itself as on the site (the phone's country
 * picker too), but sending only says it's a demo; nothing is sent anywhere.
 */
export function DemoBooking({ locale, demo }: DemoBookingProperties) {
  return (
    <div className={styles.booking}>
      <ContactForm locale={locale} action={sendNothing} demo={demo} />
    </div>
  );
}
