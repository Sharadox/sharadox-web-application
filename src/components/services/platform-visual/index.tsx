import styles from "./index.module.scss";

const NODES = [
  { x: 60, y: 46, label: "bookings" },
  { x: 260, y: 40, label: "payments" },
  { x: 292, y: 150, label: "inventory" },
  { x: 196, y: 228, label: "crm" },
  { x: 48, y: 186, label: "analytics" },
];
const CX = 170;
const CY = 132;

/** Systems connected to one core, with data packets flowing between them. */
export function PlatformVisual() {
  return (
    <div className={styles.visual} aria-hidden>
      <svg viewBox="0 0 340 270">
        <defs>
          <radialGradient id="coreGlow">
            <stop offset="0" stopColor="#fff" stopOpacity=".35" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={CX} cy={CY} r="70" fill="url(#coreGlow)" />
        {NODES.map((n, i) => (
          <path
            key={`p${i}`}
            id={`edge${i}`}
            d={`M${n.x},${n.y} Q${(n.x + CX) / 2 + (i % 2 ? 26 : -26)},${(n.y + CY) / 2} ${CX},${CY}`}
            className={styles.edge}
          />
        ))}
        {NODES.map((_, i) => (
          <circle key={`d${i}`} r="2.6" className={styles.packet}>
            <animateMotion
              dur={`${2.2 + i * 0.35}s`}
              repeatCount="indefinite"
              keyPoints={i % 2 ? "0;1" : "1;0"}
              keyTimes="0;1"
              calcMode="linear"
            >
              <mpath href={`#edge${i}`} />
            </animateMotion>
          </circle>
        ))}
        <rect x={CX - 30} y={CY - 16} width="60" height="32" rx="9" className={styles.core} />
        <text x={CX} y={CY + 4} className={styles.coreLabel}>
          core
        </text>
        {NODES.map((n, i) => (
          <g key={`n${i}`}>
            <circle cx={n.x} cy={n.y} r="5" className={styles.node} />
            <text x={n.x} y={n.y - 12} className={styles.nodeLabel}>
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
