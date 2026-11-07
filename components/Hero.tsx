"use client";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { copy, tr, type Locale } from "@/content";

const Globe = dynamic(() => import("./Globe"), { ssr: false, loading: () => <div className="globe" /> });
const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ l }: { l: Locale }) {
  const lines = copy.hero.lines[l];
  return (
    <section className="hero">
      <div className="hero-grid-bg" aria-hidden />
      <div className="hero-copy">
        <motion.p className="eyebrow mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.1 }}>
          <span className="live-dot" aria-hidden /> {tr(copy.hero.eyebrow, l)}
        </motion.p>
        <h1 className="hero-title">
          {lines.map((line, i) => (
            <span className="line" key={i}>
              <motion.span
                className={i === lines.length - 1 ? "line-inner dim" : "line-inner"}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, delay: 0.2 + i * 0.12, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p className="hero-sub" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.75, ease }}>
          {tr(copy.hero.sub, l)}
        </motion.p>
        <motion.div className="hero-cta" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.9, ease }}>
          <a href="#contact" className="btn btn-white">{tr(copy.hero.primary, l)}<span className="arrow" aria-hidden>→</span></a>
          <a href="#services" className="btn btn-ghost">{tr(copy.hero.secondary, l)}</a>
        </motion.div>
      </div>
      <motion.div className="hero-globe" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, delay: 0.3, ease }}>
        <Globe />
        <span className="globe-hint mono" aria-hidden>{tr(copy.hero.drag, l)}</span>
      </motion.div>
    </section>
  );
}
