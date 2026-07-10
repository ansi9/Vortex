import { useState, useRef, useCallback } from "react";
import { Plane } from "lucide-react";
import { useAppState } from "../context/AppContext";

const SLIDE_THRESHOLD = 85;
const SPRING   = "cubic-bezier(0.34, 1.28, 0.64, 1)";
const EASE_OUT = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
const THUMB_W  = 56;
const PADDING  = 4; // px each side inside the track

export function SlideToUnlock() {
  const { setIsUnlocked, setShowNotifDot } = useAppState();
  const [progress, setProgress]       = useState(0);   // 0-100
  const [isDragging, setIsDragging]   = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Guard: only run once per interaction
  const unlock = useCallback(() => {
    if (isCompleting) return;
    setIsCompleting(true);
    setProgress(100);
    // clear any stale timer before setting new one
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsUnlocked(true);
      setTimeout(() => setShowNotifDot(true), 2000);
    }, 480);
  }, [isCompleting, setIsUnlocked, setShowNotifDot]);

  const trackWidth = () =>
    containerRef.current ? containerRef.current.clientWidth : 320;

  const maxDrag = () => trackWidth() - THUMB_W - PADDING * 2;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isCompleting) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const raw  = e.clientX - rect.left - THUMB_W / 2 - PADDING;
    const clamped = Math.max(0, Math.min(raw, maxDrag()));
    setProgress((clamped / maxDrag()) * 100);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    if (progress >= SLIDE_THRESHOLD) {
      unlock();
    } else {
      setProgress(0);
    }
  };

  // Thumb offset in px (JS math, not CSS calc on mixed units)
  const thumbPx = (maxDrag() * progress) / 100;

  // Fill width in px — from PADDING to thumb right edge
  const fillPx = PADDING + THUMB_W + thumbPx;

  const thumbTransition = isDragging
    ? "none"
    : isCompleting
    ? `transform 0.42s ${SPRING}`
    : `transform 0.4s ${EASE_OUT}`;

  const fillTransition = isDragging
    ? "none"
    : isCompleting
    ? `width 0.42s ${SPRING}`
    : `width 0.4s ${EASE_OUT}`;

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm px-4">
      {/* Track — responsive full-width up to max-w-sm */}
      <div
        ref={containerRef}
        className="relative w-full h-[64px] bg-slate-900/90 rounded-full flex items-center shadow-inner overflow-hidden select-none"
      >
        {/* Animated fill */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-400"
          style={{
            width: fillPx,
            transition: fillTransition,
            opacity: 0.9,
          }}
        />

        {/* Label — fades out as user drags */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="text-emerald-100 font-bold uppercase tracking-widest text-sm z-10"
            style={{
              opacity: Math.max(0, 1 - progress / 40),
              transition: isDragging ? "none" : "opacity 0.2s ease",
            }}
          >
            Slide for takeoff
          </span>
        </div>

        {/* Thumb */}
        <button
          className="absolute left-[4px] h-[56px] w-[56px] rounded-full flex items-center justify-center shadow-lg z-20 touch-none focus:outline-none active:scale-95"
          style={{
            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            transform: `translateX(${thumbPx}px)`,
            transition: thumbTransition,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          aria-label="Slide to unlock"
        >
          <Plane
            className="text-white w-6 h-6"
            style={{
              transform: `rotate(${45 + progress * 0.45}deg)`,
              transition: isDragging ? "none" : "transform 0.3s ease-out",
            }}
          />
        </button>
      </div>

      <button
        onClick={unlock}
        className="text-emerald-700/50 font-medium text-xs hover:text-emerald-700 transition-colors tracking-wide"
      >
        tap to enter
      </button>
    </div>
  );
}
