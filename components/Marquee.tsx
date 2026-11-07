import { copy } from "@/content";

export function Marquee() {
  const row = [...copy.stack, ...copy.stack];
  return (
    <div className="marquee" aria-label={copy.stack.join(", ")}>
      <div className="marquee-track" aria-hidden>
        {row.map((t, i) => <span key={i} className="pill mono">{t}</span>)}
      </div>
    </div>
  );
}
