/**
 * Vortex brand logo — matches reference: two concentric rings + centre dot.
 * variant="light"   → white rings (for dark backgrounds, e.g. sidebar)
 * variant="dark"    → dark-green rings (for light backgrounds, e.g. landing)
 * layout="inline"   → icon left, wordmark right (default)
 * layout="stacked"  → icon top, wordmark below (landing hero)
 */
type Props = {
  variant?: "light" | "dark";
  layout?: "inline" | "stacked";
  className?: string;
  iconSize?: number;
  showWordmark?: boolean;
};

export function VortexLogo({
  variant = "light",
  layout = "inline",
  className = "",
  iconSize = 32,
  showWordmark = true,
}: Props) {
  const isDark = variant === "dark";

  // On dark bg → white; on light bg → dark green
  const ringColor  = isDark ? "#14532d" : "#ffffff";
  const dotColor   = isDark ? "#14532d" : "#ffffff";
  const wordColor  = isDark ? "#14532d" : "#ffffff";

  const wrapClass =
    layout === "stacked"
      ? `flex flex-col items-center gap-3 ${className}`
      : `flex items-center gap-2.5 ${className}`;

  const wordStyle: React.CSSProperties =
    layout === "stacked"
      ? { fontSize: Math.round(iconSize * 0.34), letterSpacing: "0.12em" }
      : { fontSize: Math.round(iconSize * 0.6),  letterSpacing: "-0.01em" };

  // Geometry — all relative to cx=cy=R, viewBox 0 0 2R 2R
  const R  = 20;           // canvas half-size
  const cx = R;
  const cy = R;
  // outer ring stroke radius + width
  const outerR = R - 1.5;
  const outerSW = 2.2;
  // inner ring
  const innerR = R * 0.48;
  const innerSW = 2.8;
  // centre dot
  const dotR = R * 0.11;

  return (
    <div className={wrapClass}>
      {/* ── Icon ── */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox={`0 0 ${R * 2} ${R * 2}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {/* Outer ring */}
        <circle
          cx={cx} cy={cy} r={outerR}
          stroke={ringColor}
          strokeWidth={outerSW}
        />
        {/* Inner ring */}
        <circle
          cx={cx} cy={cy} r={innerR}
          stroke={ringColor}
          strokeWidth={innerSW}
        />
        {/* Centre dot */}
        <circle
          cx={cx} cy={cy} r={dotR}
          fill={dotColor}
        />
      </svg>

      {/* ── Wordmark ── */}
      {showWordmark && (
        <span
          style={{ color: wordColor, fontFamily: "Inter, sans-serif", ...wordStyle }}
          className="font-bold tracking-tight select-none leading-none"
        >
          Vortex
        </span>
      )}
    </div>
  );
}
