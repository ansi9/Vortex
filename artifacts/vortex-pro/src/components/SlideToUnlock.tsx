import { useState, useRef, useEffect } from "react";
import { Plane } from "lucide-react";
import { useAppState } from "../context/AppContext";

export function SlideToUnlock() {
  const { setIsUnlocked, setShowNotifDot } = useAppState();
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const SLIDE_THRESHOLD = 85;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const thumbWidth = 56; 
    
    const maxDrag = containerWidth - thumbWidth;
    let newX = e.clientX - rect.left - thumbWidth / 2;
    
    newX = Math.max(0, Math.min(newX, maxDrag));
    
    const newProgress = (newX / maxDrag) * 100;
    setProgress(newProgress);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    
    if (progress >= SLIDE_THRESHOLD) {
      setProgress(100);
      setTimeout(() => {
        setIsUnlocked(true);
        setTimeout(() => setShowNotifDot(true), 2000);
      }, 300);
    } else {
      setProgress(0);
    }
  };

  const triggerUnlock = () => {
    setProgress(100);
    setTimeout(() => {
      setIsUnlocked(true);
      setTimeout(() => setShowNotifDot(true), 2000);
    }, 300);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        ref={containerRef}
        className="relative w-[340px] h-[64px] bg-slate-900 rounded-full flex items-center shadow-inner overflow-hidden select-none"
      >
        <div 
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-600 to-emerald-400 opacity-80"
          style={{ width: `calc(${progress}% + 56px)`, transition: isDragging ? 'none' : 'width 0.3s ease-out' }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-emerald-100 font-bold uppercase tracking-widest text-sm z-10 opacity-70">
            Slide for takeoff
          </span>
        </div>
        
        <button
          className="absolute left-[4px] h-[56px] w-[56px] bg-emerald-500 rounded-full flex items-center justify-center shadow-md z-20 hover:bg-emerald-400 touch-none"
          style={{ 
            transform: `translateX(calc(${(340 - 64) * (progress / 100)}px))`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out' 
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          data-testid="slide-thumb"
          aria-label="Slide to unlock"
        >
          <Plane className="text-white w-6 h-6 rotate-45" />
        </button>
      </div>

      <button 
        onClick={triggerUnlock}
        className="text-emerald-700/60 font-medium text-sm hover:text-emerald-700 transition-colors"
        data-testid="button-fallback-unlock"
      >
        (Or Click Here to Enter)
      </button>
    </div>
  );
}
