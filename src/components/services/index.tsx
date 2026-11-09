import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { SERVICES } from "@/content/services";
import { translate } from "@/utilities/translate";
import { ApplicationVisual } from "./application-visual";
import { Card } from "./card";
import styles from "./index.module.scss";
import { PlatformVisual } from "./platform-visual";
import type { ServicesProperties } from "./type";
import { WebVisual } from "./web-visual";

/** "What we build": websites (wide), platforms and applications, each with a live visual. */
export function Services({ locale }: ServicesProperties) {
  const visuals = {
    web: <WebVisual />,
    platform: <PlatformVisual />,
    applications: <ApplicationVisual locale={locale} />,
  };
  return (
    <Section id="services">
      <SectionHeading eyebrow={translate(SERVICES.eyebrow, locale)} title={translate(SERVICES.title, locale)} />
      <div className={styles.cards}>
        {SERVICES.items.map((service, index) => (
          <Reveal key={service.key} delay={index * 0.1} className={index === 0 ? styles.wide : undefined}>
            <Card
              wide={index === 0}
              visual={visuals[service.key]}
              tag={service.tag}
              title={translate(service.title, locale)}
              lead={translate(service.lead, locale)}
              text={translate(service.text, locale)}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
