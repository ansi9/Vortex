import { useAppState } from "../context/AppContext";
import { SlideToUnlock } from "./SlideToUnlock";
import { VortexLogo } from "./VortexLogo";

export function LandingPage() {
  const { isUnlocked } = useAppState();

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#ecfccb] to-[#dcfce7] transition-transform duration-700 ease-in-out ${
        isUnlocked ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md px-6 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center mb-16">
          {/* Brand logo */}
          <VortexLogo variant="dark" iconSize={56} className="mb-5" />
          <p className="text-emerald-700 font-bold tracking-[0.2em] text-sm uppercase">
            Predict. Prevent. Protect.
          </p>
        </div>

        <SlideToUnlock />
      </div>
    </div>
  );
}
