/**
 * Vortex brand logo — spiral icon + wordmark.
 * variant="light"   → white icon + white wordmark (for dark backgrounds)
 * variant="dark"    → green icon + dark-green wordmark (for light backgrounds)
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

  // colour tokens
  const outerFill  = isDark ? "#14532d" : "#ffffff";
  const midFill    = isDark ? "#22c55e" : "rgba(255,255,255,0.72)";
  const innerFill  = isDark ? "#4ade80" : "rgba(255,255,255,0.45)";
  const coreFill   = isDark ? "#14532d" : "#ffffff";
  const wordColor  = isDark ? "#14532d" : "#ffffff";

  const wrapClass =
    layout === "stacked"
      ? `flex flex-col items-center gap-3 ${className}`
      : `flex items-center gap-2.5 ${className}`;

  const wordSize =
    layout === "stacked"
      ? { fontSize: Math.round(iconSize * 0.36), letterSpacing: "0.12em" }
      : { fontSize: Math.round(iconSize * 0.6), letterSpacing: "-0.01em" };

  return (
    <div className={wrapClass}>
      {/* ── Spiral vortex icon ── */}
      {/*
        viewBox is slightly padded (-3 -3 46 46) so no path gets clipped.
        Built from three overlapping arc-crescents that suggest rotation.
      */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="-3 -3 46 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ overflow: "visible", flexShrink: 0 }}
      >
        {/*
          Outer crescent — large circle minus an offset inner circle.
          Covers almost the full 40×40 canvas.
        */}
        <path
          d="
            M 20 1
            A 19 19 0 1 1 1 20
            C 1 9.5  9.5 1  20 1
            Z
            M 20 9
            C 13 9  7 13.5  7 20
            C 7 26.5  13 31  20 31
            C 26 31  30 26.5  30 20
            C 30 13.5  26 9  20 9
            Z
          "
          fillRule="evenodd"
          fill={outerFill}
        />

        {/*
          Mid crescent — tighter spiral band.
        */}
        <path
          d="
            M 20 9
            A 11 11 0 1 1 9 20
            C 9 14  14 9  20 9
            Z
            M 20 15
            C 17 15  15 17  15 20
            C 15 23  17 25  20 25
            C 23 25  25 23  25 20
            C 25 17  23 15  20 15
            Z
          "
          fillRule="evenodd"
          fill={midFill}
        />

        {/*
          Inner bright arc — smallest spiral layer.
        */}
        <path
          d="
            M 20 15
            A 5 5 0 1 1 15 20
            C 15 17.2  17.2 15  20 15
            Z
          "
          fill={innerFill}
        />

        {/* Centre eye */}
        <circle cx="20" cy="20" r="3.2" fill={coreFill} />
      </svg>

      {/* ── Wordmark ── */}
      {showWordmark && (
        <span
          style={{ color: wordColor, fontFamily: "Inter, sans-serif", ...wordSize }}
          className="font-bold tracking-tight select-none leading-none"
        >
          Vortex
        </span>
      )}
    </div>
  );
}
