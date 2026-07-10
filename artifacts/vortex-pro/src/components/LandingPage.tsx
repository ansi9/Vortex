import { useAppState } from "../context/AppContext";
import { SlideToUnlock } from "./SlideToUnlock";
import { VortexLogo } from "./VortexLogo";

export function LandingPage() {
  const { isUnlocked } = useAppState();

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#ecfccb] to-[#d1fae5]"
      style={{
        transform: isUnlocked ? "translateY(-100%)" : "translateY(0)",
        transition: isUnlocked
          ? "transform 0.72s cubic-bezier(0.76, 0, 0.24, 1)"
          : "none",
      }}
    >
      {/* Hero section */}
      <div className="flex flex-col items-center flex-1 justify-center w-full max-w-sm px-6 gap-0">

        {/* Large standalone vortex spiral */}
        <div
          className="mb-6"
          style={{
            filter: "drop-shadow(0 12px 32px rgba(20,83,45,0.22))",
          }}
        >
          <VortexLogo
            variant="dark"
            layout="stacked"
            iconSize={148}
            showWordmark={false}
          />
        </div>

        {/* Wordmark + tagline */}
        <div className="flex flex-col items-center mb-16 gap-2">
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#14532d",
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
            className="select-none"
          >
            Vortex Pro
          </span>
          <p className="text-emerald-700 font-semibold tracking-[0.2em] text-xs uppercase mt-1">
            Predict · Prevent · Protect
          </p>
        </div>

        <SlideToUnlock />
      </div>
    </div>
  );
}
