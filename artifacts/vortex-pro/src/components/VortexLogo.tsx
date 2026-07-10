/**
 * Vortex brand logo — spiral icon + wordmark.
 * Pass `variant="light"` for dark backgrounds (white wordmark).
 * Pass `variant="dark"` for light backgrounds (green wordmark).
 */
type Props = {
  variant?: "light" | "dark";
  className?: string;
  iconSize?: number;
};

export function VortexLogo({ variant = "light", className = "", iconSize = 32 }: Props) {
  const wordColor = variant === "light" ? "#ffffff" : "#1a5c30";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Spiral vortex icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer dark-green crescent (large arc wrapping left-and-top) */}
        <path
          d="
            M 22 3
            A 17 17 0 1 0 22 37
            C 22 37 15 31 15 20
            C 15 9 22 3 22 3
            Z
          "
          fill="#1a5c30"
        />
        {/* Inner medium-green crescent (smaller arc, creates spiral illusion) */}
        <path
          d="
            M 21 11
            A 9.5 9.5 0 1 0 21 29
            C 21 29 16 26 16 20
            C 16 14 21 11 21 11
            Z
          "
          fill="#4dab65"
        />
        {/* Bright highlight arc at inner edge */}
        <path
          d="
            M 20 15
            A 5 5 0 1 0 20 25
            C 20 25 17 23 17 20
            C 17 17 20 15 20 15
            Z
          "
          fill="#72c98a"
          opacity="0.7"
        />
        {/* Center eye dot */}
        <circle cx="14" cy="20" r="2.8" fill="#1a5c30" />
      </svg>

      {/* Wordmark */}
      <span
        style={{ color: wordColor, fontFamily: "Inter, sans-serif" }}
        className="text-xl font-semibold tracking-tight select-none"
      >
        Vortex
      </span>
    </div>
  );
}
