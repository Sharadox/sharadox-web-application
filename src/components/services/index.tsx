import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { SectionHead } from "@/components/section-head";
import { SERVICES } from "@/content/services";
import { translate } from "@/utilities/translate";
import { AppVisual } from "./app-visual";
import { Card } from "./card";
import styles from "./index.module.scss";
import { PlatformVisual } from "./platform-visual";
import type { ServicesProps } from "./type";
import { WebVisual } from "./web-visual";

/** "What we build": websites (wide), platforms and apps, each with a live visual. */
export function Services({ locale }: ServicesProps) {
  const visuals = { web: <WebVisual />, platform: <PlatformVisual />, apps: <AppVisual locale={locale} /> };
  return (
    <Section id="services">
      <SectionHead eyebrow={translate(SERVICES.eyebrow, locale)} title={translate(SERVICES.title, locale)} />
      <div className={styles.cards}>
        {SERVICES.items.map((s, i) => (
          <Reveal key={s.key} delay={i * 0.1} className={i === 0 ? styles.wide : undefined}>
            <Card
              wide={i === 0}
              visual={visuals[s.key]}
              tag={s.tag}
              title={translate(s.title, locale)}
              lead={translate(s.lead, locale)}
              text={translate(s.text, locale)}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
