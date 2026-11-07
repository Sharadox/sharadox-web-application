"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { copy, LOCALES, tr, type Locale } from "@/content";

export function Nav({ l }: { l: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(scrollY > 24);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav-inner">
        <a href={`/${l}`} className="wordmark" aria-label="Sharadox">
          <span className="wordmark-glyph" aria-hidden />
          Sharadox
        </a>
        <nav className="nav-links" aria-label="Main">
          <a href="#services">{tr(copy.nav.services, l)}</a>
          <a href="#process">{tr(copy.nav.process, l)}</a>
          <a href="#contact">{tr(copy.nav.contact, l)}</a>
        </nav>
        <div className="nav-end">
          <div className="lang" role="group" aria-label="Language">
            {LOCALES.map((x) => (
              <Link key={x} href={`/${x}`} hrefLang={x} aria-current={x === l ? "true" : undefined}>
                {x.toUpperCase()}
              </Link>
            ))}
          </div>
          <a href="#contact" className="btn btn-white btn-sm">{tr(copy.nav.cta, l)}</a>
        </div>
      </div>
    </header>
  );
}
