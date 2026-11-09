import { Eyebrow } from "@sharadox/sharadox-web-application/component/eyebrow";
import { Reveal } from "@sharadox/sharadox-web-application/component/reveal";
import { Section } from "@sharadox/sharadox-web-application/component/section";
import { CONTACT } from "@sharadox/sharadox-web-application/content/contact";
import { SITE } from "@sharadox/sharadox-web-application/content/site";
import { translate } from "@sharadox/sharadox-web-application/utility/translate";
import { ContactForm } from "./form";
import styles from "./index.module.scss";
import type { ContactProperties } from "./type";

/** Contact section: invitation and direct email on the left, the form on the right. */
export function Contact({ locale }: ContactProperties) {
  return (
    <Section id="contact" className={styles.contact}>
      <div className={styles.glow} aria-hidden />
      <Reveal className={styles.heading}>
        <Eyebrow>{translate(CONTACT.eyebrow, locale)}</Eyebrow>
        <h2>{translate(CONTACT.title, locale)}</h2>
        <p className={styles.text}>{translate(CONTACT.text, locale)}</p>
        <p className={styles.direct}>
          <span className="monospace">{translate(CONTACT.direct, locale)}</span>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <ContactForm locale={locale} />
      </Reveal>
    </Section>
  );
}
