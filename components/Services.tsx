"use client";
import { useEffect, useRef, useState } from "react";
import { copy, tr, type Locale } from "@/content";
import { useSpotlight } from "./Effects";
import { Reveal } from "./Reveal";

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.35 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

/* A browser whose layout assembles itself, with a performance score counting to 100. */
function WebVisual() {
  const [ref, on] = useInView<HTMLDivElement>();
  const [score, setScore] = useState(0);
  useEffect(() => {
    if (!on) return;
    let v = 0;
    const id = setInterval(() => {
      v += 3;
      setScore(Math.min(100, v));
      if (v >= 100) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [on]);
  const C = 2 * Math.PI * 22;
  return (
    <div ref={ref} className={`vis vis-web ${on ? "is-on" : ""}`} aria-hidden>
      <div className="browser">
        <div className="browser-bar"><i /><i /><i /><span className="browser-url mono">yourbusiness.com</span></div>
        <div className="browser-body">
          <div className="sk sk-nav" />
          <div className="sk sk-hero" />
          <div className="sk-row"><div className="sk sk-card" /><div className="sk sk-card" /><div className="sk sk-card" /></div>
        </div>
      </div>
      <div className="score">
        <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="22" className="score-track" /><circle cx="26" cy="26" r="22" className="score-bar" style={{ strokeDasharray: C, strokeDashoffset: C * (1 - score / 100) }} /></svg>
        <span className="mono">{score}</span>
      </div>
    </div>
  );
}

/* Systems connected to one core, with data flowing between them. */
function PlatformVisual() {
  const nodes = [
    { x: 60, y: 46, label: "bookings" },
    { x: 260, y: 40, label: "payments" },
    { x: 292, y: 150, label: "inventory" },
    { x: 196, y: 228, label: "crm" },
    { x: 48, y: 186, label: "analytics" },
  ];
  const cx = 170, cy = 132;
  return (
    <div className="vis vis-platform" aria-hidden>
      <svg viewBox="0 0 340 270">
        <defs>
          <radialGradient id="coreGlow"><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r="70" fill="url(#coreGlow)" />
        {nodes.map((n, i) => (
          <path key={`p${i}`} id={`edge${i}`} d={`M${n.x},${n.y} Q${(n.x + cx) / 2 + (i % 2 ? 26 : -26)},${(n.y + cy) / 2} ${cx},${cy}`} className="edge" />
        ))}
        {nodes.map((_, i) => (
          <circle key={`d${i}`} r="2.6" className="packet">
            <animateMotion dur={`${2.2 + i * 0.35}s`} repeatCount="indefinite" keyPoints={i % 2 ? "0;1" : "1;0"} keyTimes="0;1" calcMode="linear">
              <mpath href={`#edge${i}`} />
            </animateMotion>
          </circle>
        ))}
        <rect x={cx - 30} y={cy - 16} width="60" height="32" rx="9" className="core" />
        <text x={cx} y={cy + 4} className="core-label">core</text>
        {nodes.map((n, i) => (
          <g key={`n${i}`}>
            <circle cx={n.x} cy={n.y} r="5" className="node" />
            <text x={n.x} y={n.y - 12} className="node-label">{n.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* A phone with notifications sliding in. */
function AppVisual({ l }: { l: Locale }) {
  const items = l === "pt"
    ? [["Nova reserva", "Mesa para 4 · 20:00"], ["Pagamento recebido", "€84,50 · Visa"], ["Encomenda pronta", "#2041 · Recolha"], ["Novo cliente", "Ana M. · Lisboa"]]
    : [["New booking", "Table for 4 · 8:00 PM"], ["Payment received", "€84.50 · Visa"], ["Order ready", "#2041 · Pick-up"], ["New customer", "Ana M. · Lisbon"]];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => x + 1), 1800);
    return () => clearInterval(id);
  }, []);
  const shown = [0, 1, 2].map((k) => items[(i + k) % items.length]);
  return (
    <div className="vis vis-app" aria-hidden>
      <div className="phone">
        <div className="phone-notch" />
        <div className="phone-time mono">9:41</div>
        <div className="notes">
          {shown.map(([t, s], k) => (
            <div key={`${i}-${k}`} className={`note note-${k}`}>
              <span className="note-icon" />
              <span className="note-text"><b>{t}</b><em>{s}</em></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ i, l }: { i: number; l: Locale }) {
  const s = copy.services.items[i];
  const ref = useSpotlight<HTMLElement>();
  return (
    <article ref={ref} className={`card card-${s.key}`}>
      <div className="card-vis">
        {s.key === "web" && <WebVisual />}
        {s.key === "platform" && <PlatformVisual />}
        {s.key === "apps" && <AppVisual l={l} />}
      </div>
      <div className="card-copy">
        <span className="mono tag">{s.tag}</span>
        <h3>{tr(s.title, l)}</h3>
        <p className="lead">{tr(s.lead, l)}</p>
        <p>{tr(s.text, l)}</p>
      </div>
    </article>
  );
}

export function Services({ l }: { l: Locale }) {
  return (
    <section className="section" id="services">
      <Reveal className="section-head">
        <p className="eyebrow mono">{tr(copy.services.eyebrow, l)}</p>
        <h2>{tr(copy.services.title, l)}</h2>
      </Reveal>
      <div className="cards">
        {copy.services.items.map((_, i) => (
          <Reveal key={i} delay={i * 0.1} className={i === 0 ? "card-wrap wide" : "card-wrap"}>
            <Card i={i} l={l} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
