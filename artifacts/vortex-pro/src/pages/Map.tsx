import { useState } from "react";
import { AlertCircle, CheckCircle, MapPin, RefreshCw } from "lucide-react";

type Marker = {
  id: string;
  x: number;
  y: number;
  type: "high" | "moderate" | "safe";
  name: string;
  description: string;
};

const INITIAL_MARKERS: Marker[] = [
  { id: "m1", x: 35, y: 40, type: "high", name: "Downtown Transfer", description: "High Congestion — Avoid this area" },
  { id: "m2", x: 70, y: 25, type: "safe", name: "North Station", description: "Low Congestion — Safe to pass" },
  { id: "m3", x: 55, y: 65, type: "moderate", name: "University Ave", description: "Moderate crowd building up" },
  { id: "m4", x: 20, y: 75, type: "safe", name: "West End Plaza", description: "Low Congestion — Safe to pass" },
  { id: "m5", x: 80, y: 80, type: "high", name: "Stadium Event", description: "Extreme crowding post-event" },
];

export default function Map() {
  const [markers, setMarkers] = useState<Marker[]>(INITIAL_MARKERS);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setActiveMarker(null);
    
    // Simulate updating marker positions slightly
    setTimeout(() => {
      setMarkers(prev => prev.map(m => ({
        ...m,
        x: m.x + (Math.random() * 4 - 2),
        y: m.y + (Math.random() * 4 - 2)
      })));
      setIsRefreshing(false);
    }, 1000);
  };

  const getMarkerColor = (type: string) => {
    if (type === "high") return "bg-red-500 border-red-600 shadow-red-500/50";
    if (type === "moderate") return "bg-amber-500 border-amber-600 shadow-amber-500/50";
    return "bg-emerald-500 border-emerald-600 shadow-emerald-500/50";
  };

  const getRingColor = (type: string) => {
    if (type === "high") return "border-red-500";
    if (type === "moderate") return "border-amber-500";
    return "border-emerald-500";
  };

  return (
    <div className="flex-1 h-[100dvh] relative bg-dot-grid animate-in slide-in-from-bottom-4 fade-in duration-500 overflow-hidden">
      
      {/* Top Left Label */}
      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md border border-slate-200 px-4 py-3 rounded-xl shadow-lg z-10">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          Live City View
        </h2>
      </div>

      {/* Top Right Refresh */}
      <button 
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="absolute top-6 right-6 bg-white/90 backdrop-blur-md border border-slate-200 px-4 py-3 rounded-xl shadow-lg z-10 flex items-center gap-2 text-slate-700 hover:text-slate-900 hover:bg-white font-medium transition-all disabled:opacity-70"
        data-testid="button-refresh-map"
      >
        <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
        {isRefreshing ? "Updating..." : "Refresh"}
      </button>

      {/* Map Area */}
      <div 
        className="absolute inset-0 z-0 cursor-crosshair"
        onClick={() => setActiveMarker(null)}
      >
        {markers.map((marker) => (
          <div 
            key={marker.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveMarker(marker.id);
            }}
          >
            {/* Pulsing ring */}
            <div className={`absolute inset-0 rounded-full border-2 ${getRingColor(marker.type)} animate-ping-slow pointer-events-none`}></div>
            
            {/* Core marker */}
            <button 
              className={`relative w-6 h-6 rounded-full border-2 shadow-lg hover:scale-125 transition-transform duration-200 ${getMarkerColor(marker.type)} flex items-center justify-center`}
              aria-label={`Marker for ${marker.name}`}
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </button>

            {/* Label (visible when not active) */}
            {activeMarker !== marker.id && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {marker.type === "high" ? "Avoid" : marker.type === "safe" ? "Safe" : "Moderate"}
              </div>
            )}

            {/* Active Info Card */}
            {activeMarker === marker.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-20 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start gap-2 mb-1">
                  {marker.type === "high" ? (
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  ) : marker.type === "safe" ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  )}
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">{marker.name}</h3>
                </div>
                <p className="text-slate-500 text-xs mt-1 leading-snug">{marker.description}</p>
                
                {/* Arrow */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-slate-200 rotate-45"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-lg z-10 pointer-events-none">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Route Legend</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
            <span className="text-sm font-medium text-slate-700">High Congestion</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            <span className="text-sm font-medium text-slate-700">Moderate</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-sm font-medium text-slate-700">Safe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
