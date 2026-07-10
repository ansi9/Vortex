/**
 * Vortex brand logo — spiral vortex icon matching the reference design.
 * Two offset crescents (large dark outer + smaller lighter inner) + centre dot.
 *
 * variant="light"   → white/semi-white tones  (dark backgrounds, e.g. sidebar)
 * variant="dark"    → dark-green tones         (light backgrounds, e.g. landing)
 * layout="inline"   → icon left, wordmark right (default)
 * layout="stacked"  → icon top, wordmark below  (landing hero)
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
  const id = useId().replace(/:/g, "");   // safe for SVG id attributes
  const isDark = variant === "dark";

  // colour tokens
  // "dark" variant = green shades on a pale background (landing page)
  // "light" variant = white shades on a dark background (sidebar)
  const outerFill = isDark ? "#14532d" : "#ffffff";
  const midFill   = isDark ? "#4ade80" : "rgba(255,255,255,0.60)";
  const coreFill  = isDark ? "#14532d" : "#ffffff";
  const wordColor = isDark ? "#14532d" : "#ffffff";

  const wrapClass =
    layout === "stacked"
      ? `flex flex-col items-center gap-3 ${className}`
      : `flex items-center gap-2.5 ${className}`;

  const wordStyle: React.CSSProperties =
    layout === "stacked"
      ? { fontSize: Math.round(iconSize * 0.34), letterSpacing: "0.12em" }
      : { fontSize: Math.round(iconSize * 0.60), letterSpacing: "-0.01em" };

  /**
   * SVG geometry — viewBox 0 0 40 40, center (20,20)
   *
   * Technique: each crescent = a large circle MINUS a slightly offset
   * inner circle, clipped to the main circle so the subtracted shape
   * doesn't bleed outward.
   *
   * Outer crescent:
   *   main circle  (20,20) R=18.5
   *   subtract     (20,12) R=14   (shifted 8px toward top)
   *   → crescent opens at the top, covering left + bottom + right
   *
   * Inner crescent:
   *   main circle  (20,20) R=11.5
   *   subtract     (22,13) R=8.5  (shifted right+up)
   *   → crescent opens upper-right, rotated ≈30° from outer
   *   This offset rotation is what creates the spiral/vortex depth.
   */

  // SVG circle expressed as a path so we can use fillRule="evenodd" for
  // boolean subtraction: M cx-r cy  A r r 0 1 0 cx+r cy  A r r 0 1 0 cx-r cy  Z
  const circlePath = (cx: number, cy: number, r: number) =>
    `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;

  return (
    <div className={wrapClass}>
      {/* ── Vortex icon ── */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0, overflow: "visible" }}
      >
        <defs>
          {/* Clip outer crescent to its bounding circle */}
          <clipPath id={`oc-${id}`}>
            <circle cx="20" cy="20" r="18.5" />
          </clipPath>
          {/* Clip inner crescent to its bounding circle */}
          <clipPath id={`ic-${id}`}>
            <circle cx="20" cy="20" r="11.5" />
          </clipPath>
        </defs>

        {/* ① Outer dark crescent */}
        <g clipPath={`url(#oc-${id})`}>
          <path
            fillRule="evenodd"
            fill={outerFill}
            d={`${circlePath(20, 20, 18.5)} ${circlePath(20, 12, 14)}`}
          />
        </g>

        {/* ② Inner lighter crescent (rotated opening ≈30° relative to outer) */}
        <g clipPath={`url(#ic-${id})`}>
          <path
            fillRule="evenodd"
            fill={midFill}
            d={`${circlePath(20, 20, 11.5)} ${circlePath(22, 13.5, 8.5)}`}
          />
        </g>

        {/* ③ Centre dot */}
        <circle cx="20" cy="20" r="3" fill={coreFill} />
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
