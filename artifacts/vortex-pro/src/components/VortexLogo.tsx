/**
 * Vortex brand logo — spiral vortex with proper colour on every placement.
 *
 * variant="light"  → vivid greens on dark backgrounds (sidebar, headers)
 * variant="dark"   → deep greens on light backgrounds (landing page)
 *
 * Both variants show the full green colour palette — the logo never goes
 * flat white.  The wordmark stays white on dark and dark-green on light.
 */
import { useId } from "react";

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
  const uid = useId().replace(/:/g, "");
  const isDark = variant === "dark"; // light background (landing)

  /**
   * Colour tokens
   * ──────────────────────────────────────────────────────────
   * dark variant (light background — landing page):
   *   outer crescent  → very dark green   #0f4220 → #14532d gradient
   *   inner crescent  → vivid mid-green   #16a34a → #22c55e gradient
   *   centre dot      → #0f4220
   *   wordmark        → #14532d
   *
   * light variant (dark background — sidebar):
   *   outer crescent  → vivid bright green  #22c55e → #4ade80 gradient
   *   inner crescent  → pale bright green   #86efac → #d1fae5 gradient
   *   centre dot      → #22c55e
   *   wordmark        → #ffffff
   */
  const gradOuter = isDark
    ? { from: "#0f4220", to: "#1a6b38" }
    : { from: "#16a34a", to: "#4ade80" };

  const gradInner = isDark
    ? { from: "#16a34a", to: "#22c55e" }
    : { from: "#a7f3d0", to: "#ecfdf5" };

  const dotFill   = isDark ? "#0f4220" : "#22c55e";
  const wordColor = isDark ? "#14532d" : "#ffffff";

  // ── Layout helpers ──────────────────────────────────────
  const wrapClass =
    layout === "stacked"
      ? `flex flex-col items-center gap-3 ${className}`
      : `flex items-center gap-2.5 ${className}`;

  const wordStyle: React.CSSProperties =
    layout === "stacked"
      ? { fontSize: Math.round(iconSize * 0.34), letterSpacing: "0.12em" }
      : { fontSize: Math.round(iconSize * 0.60), letterSpacing: "-0.01em" };

  // ── SVG geometry ────────────────────────────────────────
  // Crescent = large circle MINUS a slightly offset inner circle,
  // clipped so the subtracted circle never bleeds outside the outer ring.
  //
  // Outer crescent:  main (20,20) R=18.5  subtract (20,12) R=14
  //   → C-shape opening at the top
  //
  // Inner crescent:  main (20,20) R=11.5  subtract (22,13.5) R=8.5
  //   → opening rotated ~25° clockwise from outer, creating spiral depth
  //
  const cp = (cx: number, cy: number, r: number) =>
    `M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`;

  return (
    <div className={wrapClass}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <defs>
          {/* radial gradient: darker at rim, lighter near centre */}
          <radialGradient id={`go-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={gradOuter.to} />
            <stop offset="100%" stopColor={gradOuter.from} />
          </radialGradient>
          <radialGradient id={`gi-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={gradInner.to} />
            <stop offset="100%" stopColor={gradInner.from} />
          </radialGradient>

          {/* clip to prevent crescent shapes from bleeding outward */}
          <clipPath id={`co-${uid}`}>
            <circle cx="20" cy="20" r="18.5" />
          </clipPath>
          <clipPath id={`ci-${uid}`}>
            <circle cx="20" cy="20" r="11.5" />
          </clipPath>
        </defs>

        {/* ① Outer crescent */}
        <g clipPath={`url(#co-${uid})`}>
          <path
            fillRule="evenodd"
            fill={`url(#go-${uid})`}
            d={`${cp(20, 20, 18.5)} ${cp(20, 12, 14)}`}
          />
        </g>

        {/* ② Inner crescent — rotated opening for spiral depth */}
        <g clipPath={`url(#ci-${uid})`}>
          <path
            fillRule="evenodd"
            fill={`url(#gi-${uid})`}
            d={`${cp(20, 20, 11.5)} ${cp(22, 13.5, 8.5)}`}
          />
        </g>

        {/* ③ Centre dot */}
        <circle cx="20" cy="20" r="3" fill={dotFill} />
      </svg>

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
