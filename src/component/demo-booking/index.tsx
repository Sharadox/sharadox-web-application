"use client";
import { ContactForm } from "@sharadox/luis-pires-decor-web-library/component/contact/form";
import styles from "./index.module.scss";
import type { DemoBookingProperties } from "@sharadox/sharadox-web-application/component/demo-booking/type";

/** How long the pretend sending takes, so the form shows its sending state as on the site. */
const SENDING = 900;

/**
 * Luis Pires Decor's booking form, to try on the showcase: it checks and thanks as on the site, but nothing is sent.
 */
export function DemoBooking({ locale }: DemoBookingProperties) {
  return (
    <div className={styles.booking}>
      <ContactForm
        locale={locale}
        action={async () => {
          await new Promise((resolve) => setTimeout(resolve, SENDING));
          return { status: "sent" as const };
        }}
      />
    </div>
  );
}
