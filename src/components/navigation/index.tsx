"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { LanguageSwitch } from "@/components/language-switch";
import { Wordmark } from "@/components/wordmark";
import { NAVIGATION } from "@/content/navigation";
import { translate } from "@/utilities/translate";
import styles from "./index.module.scss";
import type { NavigationProperties } from "./type";

/** Fixed top bar that frosts once the page scrolls. */
export function Navigation({ locale }: NavigationProperties) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(scrollY > 24);
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  return (
    <header className={[styles.navigation, scrolled && styles.scrolled].filter(Boolean).join(" ")}>
      <div className={styles.inner}>
        <Wordmark href={`/${locale}`} />
        <nav className={styles.links} aria-label="Main">
          <a href="#services">{translate(NAVIGATION.services, locale)}</a>
          <a href="#process">{translate(NAVIGATION.process, locale)}</a>
          <a href="#contact">{translate(NAVIGATION.contact, locale)}</a>
        </nav>
        <div className={styles.end}>
          <LanguageSwitch locale={locale} />
          <Button href="#contact" size="small" className={styles.callToAction}>
            {translate(NAVIGATION.callToAction, locale)}
          </Button>
        </div>
      </div>
    </header>
  );
}
