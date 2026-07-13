/**
 * SlideToUnlock — buttery-smooth drag via direct DOM style writes.
 * React state is only used for the unlock completion phase so the hot
 * path (pointermove) never triggers a re-render.
 */
import { useRef, useCallback, useEffect } from "react";
import { Plane } from "lucide-react";
import { useAppState } from "../context/AppContext";

const THUMB_W   = 60;          // px — thumb diameter
const PAD       = 4;           // px — inset from track edge
const THRESHOLD = 0.85;        // 85% of travel triggers unlock
const SNAP_DUR  = "0.45s";
const SNAP_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";   // smooth out
const DONE_EASE = "cubic-bezier(0.34, 1.2, 0.64, 1)"; // slight spring on complete

export function SlideToUnlock() {
  const { setIsUnlocked, setShowNotifDot } = useAppState();

  const trackRef   = useRef<HTMLDivElement>(null);
  const thumbRef   = useRef<HTMLButtonElement>(null);
  const fillRef    = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLSpanElement>(null);
  const planeRef   = useRef<SVGSVGElement>(null);

  const dragging   = useRef(false);
  const completing = useRef(false);
  const progress   = useRef(0);          // 0-1, updated without React state
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── helpers ────────────────────────────────────────────────────────────
  const maxTravel = () =>
    (trackRef.current?.clientWidth ?? 320) - THUMB_W - PAD * 2;

  /** Apply position directly to DOM — zero React overhead */
  const applyProgress = useCallback((p: number, animated = false) => {
    progress.current = p;
    const travel = maxTravel();
    const tx     = travel * p;
    const fillW  = PAD + THUMB_W + tx;
    const ease   = animated ? `${SNAP_DUR} ${SNAP_EASE}` : "none";

    if (thumbRef.current) {
      thumbRef.current.style.transition = animated
        ? `transform ${ease}, box-shadow ${ease}`
        : "none";
      thumbRef.current.style.transform  = `translateX(${tx}px)`;
      thumbRef.current.style.boxShadow  = p > 0.05
        ? `0 0 ${12 + p * 16}px rgba(34,197,94,${0.3 + p * 0.4})`
        : "";
    }
    if (fillRef.current) {
      fillRef.current.style.transition = animated ? `width ${ease}` : "none";
      fillRef.current.style.width      = `${fillW}px`;
    }
    if (labelRef.current) {
      const opacity = Math.max(0, 1 - p / 0.35);
      labelRef.current.style.opacity    = String(opacity);
      labelRef.current.style.transition = animated ? "opacity 0.2s ease" : "none";
    }
    if (planeRef.current) {
      const deg = 45 + p * 60;
      planeRef.current.style.transform  = `rotate(${deg}deg)`;
      planeRef.current.style.transition = animated ? `transform ${ease}` : "none";
    }
  }, []);

  const unlock = useCallback(() => {
    if (completing.current) return;
    completing.current = true;

    // animate thumb to end with spring ease
    const travel = maxTravel();
    const fillW  = PAD + THUMB_W + travel;
    const dur    = `0.42s`;
    const ease   = DONE_EASE;

    if (thumbRef.current) {
      thumbRef.current.style.transition = `transform ${dur} ${ease}, box-shadow ${dur} ${ease}`;
      thumbRef.current.style.transform  = `translateX(${travel}px)`;
      thumbRef.current.style.boxShadow  = "0 0 24px rgba(34,197,94,0.7)";
    }
    if (fillRef.current) {
      fillRef.current.style.transition = `width ${dur} ${ease}`;
      fillRef.current.style.width      = `${fillW}px`;
    }
    if (labelRef.current) {
      labelRef.current.style.opacity    = "0";
      labelRef.current.style.transition = "opacity 0.2s ease";
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsUnlocked(true);
      setTimeout(() => setShowNotifDot(true), 2000);
    }, 480);
  }, [setIsUnlocked, setShowNotifDot]);

  // ── pointer handlers ───────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (completing.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current || !trackRef.current) return;
    const rect  = trackRef.current.getBoundingClientRect();
    const raw   = e.clientX - rect.left - THUMB_W / 2 - PAD;
    const travel = maxTravel();
    const clamped = Math.max(0, Math.min(raw, travel));
    applyProgress(clamped / travel);
  }, [applyProgress]);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragging.current = false;

    if (progress.current >= THRESHOLD) {
      unlock();
    } else {
      applyProgress(0, true);   // smooth snap back
    }
  }, [applyProgress, unlock]);

  // initialise fill width after mount
  useEffect(() => {
    applyProgress(0);
  }, [applyProgress]);

  // ── cleanup ────────────────────────────────────────────────────────────
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm px-4">

      {/* Track */}
      <div
        ref={trackRef}
        className="relative w-full h-[66px] rounded-full select-none overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Gradient fill */}
        <div
          ref={fillRef}
          className="absolute left-0 top-0 bottom-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #14532d 0%, #15803d 40%, #22c55e 80%, #4ade80 100%)",
            width: PAD + THUMB_W,   // initial width = just the thumb area
          }}
        />

        {/* Shimmer stripe over the fill */}
        <div
          className="absolute top-0 bottom-0 left-0 w-full rounded-full pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
          }}
        />

        {/* Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span
            ref={labelRef}
            className="text-white/60 font-semibold uppercase tracking-[0.22em] text-xs"
          >
            Slide for takeoff
          </span>
        </div>

        {/* Thumb */}
        <button
          ref={thumbRef}
          className="absolute top-[3px] left-[4px] rounded-full flex items-center justify-center z-20 touch-none focus:outline-none"
          style={{
            width: THUMB_W,
            height: THUMB_W,
            background: "linear-gradient(145deg, #4ade80 0%, #16a34a 55%, #14532d 100%)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.15) inset",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label="Slide to unlock"
        >
          {/* Plane icon — ref on the inner svg for rotation */}
          <Plane
            ref={planeRef as React.Ref<SVGSVGElement>}
            className="text-white w-6 h-6 drop-shadow-sm"
            style={{ transform: "rotate(45deg)" }}
          />
        </button>
      </div>

      {/* Tap fallback */}
      <button
        onClick={unlock}
        className="text-emerald-700/40 font-medium text-xs hover:text-emerald-700 transition-colors tracking-widest uppercase"
      >
        tap to enter
      </button>
    </div>
  );
}
