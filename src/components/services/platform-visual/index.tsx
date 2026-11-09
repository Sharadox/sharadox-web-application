import styles from "./index.module.scss";

const NODES = [
  { x: 60, y: 46, label: "bookings" },
  { x: 260, y: 40, label: "payments" },
  { x: 292, y: 150, label: "inventory" },
  { x: 196, y: 228, label: "customers" },
  { x: 48, y: 186, label: "analytics" },
];
const CENTER_X = 170;
const CENTER_Y = 132;

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
        <circle cx={CENTER_X} cy={CENTER_Y} r="70" fill="url(#coreGlow)" />
        {NODES.map((node, index) => (
          <path
            key={`path${index}`}
            id={`edge${index}`}
            d={`M${node.x},${node.y} Q${(node.x + CENTER_X) / 2 + (index % 2 ? 26 : -26)},${(node.y + CENTER_Y) / 2} ${CENTER_X},${CENTER_Y}`}
            className={styles.edge}
          />
        ))}
        {NODES.map((_, index) => (
          <circle key={`packet${index}`} r="2.6" className={styles.packet}>
            <animateMotion
              dur={`${2.2 + index * 0.35}s`}
              repeatCount="indefinite"
              keyPoints={index % 2 ? "0;1" : "1;0"}
              keyTimes="0;1"
              calcMode="linear"
            >
              <mpath href={`#edge${index}`} />
            </animateMotion>
          </circle>
        ))}
        <rect x={CENTER_X - 30} y={CENTER_Y - 16} width="60" height="32" rx="9" className={styles.core} />
        <text x={CENTER_X} y={CENTER_Y + 4} className={styles.coreLabel}>
          core
        </text>
        {NODES.map((node, index) => (
          <g key={`node${index}`}>
            <circle cx={node.x} cy={node.y} r="5" className={styles.node} />
            <text x={node.x} y={node.y - 12} className={styles.nodeLabel}>
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
