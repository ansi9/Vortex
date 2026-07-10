import React, { useState } from "react";
import { AlertCircle, CheckCircle, MapPin, RefreshCw, Navigation } from "lucide-react";

type Marker = {
  id: string;
  x: number;
  y: number;
  type: "high" | "moderate" | "safe";
  name: string;
  description: string;
};

const INITIAL_MARKERS: Marker[] = [
  { id: "m1", x: 32, y: 38, type: "high",     name: "Downtown Transfer Hub",  description: "High Congestion — 87% capacity. Avoid this area." },
  { id: "m2", x: 68, y: 22, type: "safe",     name: "North Metro Station",    description: "Low Congestion — Safe to pass. 21% capacity." },
  { id: "m3", x: 52, y: 60, type: "moderate", name: "University Avenue",      description: "Moderate crowd building up — 54% capacity." },
  { id: "m4", x: 18, y: 72, type: "safe",     name: "West End Plaza",         description: "Low Congestion — Safe to pass. 18% capacity." },
  { id: "m5", x: 80, y: 78, type: "high",     name: "Stadium Event Zone",     description: "Extreme crowding post-event — 95% capacity." },
  { id: "m6", x: 60, y: 45, type: "moderate", name: "Central Market",         description: "Moderate — Evening rush expected. 48% capacity." },
];

// Street grid — horizontal and vertical road lines
const H_ROADS = [15, 35, 55, 75];   // % from top
const V_ROADS = [20, 42, 63, 82];   // % from left

const markerColors: Record<string, { dot: string; ring: string; glow: string }> = {
  high:     { dot: "bg-red-500",     ring: "border-red-400",    glow: "shadow-red-500/60" },
  moderate: { dot: "bg-amber-500",   ring: "border-amber-400",  glow: "shadow-amber-500/60" },
  safe:     { dot: "bg-emerald-500", ring: "border-emerald-400",glow: "shadow-emerald-500/60" },
};

const markerIcons: Record<string, React.ReactElement> = {
  high:     <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />,
  moderate: <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />,
  safe:     <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />,
};

export default function Map() {
  const [markers, setMarkers]           = useState<Marker[]>(INITIAL_MARKERS);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter]             = useState<"all" | "high" | "moderate" | "safe">("all");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setActiveMarker(null);
    setTimeout(() => {
      setMarkers(prev =>
        prev.map(m => ({
          ...m,
          x: Math.min(92, Math.max(8, m.x + (Math.random() * 4 - 2))),
          y: Math.min(90, Math.max(10, m.y + (Math.random() * 4 - 2))),
        }))
      );
      setIsRefreshing(false);
    }, 900);
  };

  const visible = filter === "all" ? markers : markers.filter(m => m.type === filter);

  return (
    <div className="flex-1 h-[100dvh] relative overflow-hidden animate-in fade-in duration-500">

      {/* ── Map canvas ─────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-slate-100 cursor-crosshair"
        onClick={() => setActiveMarker(null)}
      >
        {/* SVG city-grid background — viewBox 0 0 100 100 so coords = % of canvas */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base fill */}
          <rect width="100" height="100" fill="#eef2f8" />

          {/* Horizontal roads */}
          {H_ROADS.map(y => (
            <g key={`h${y}`}>
              <rect x="0" y={y} width="100" height="3" fill="#d4dce8" />
              <line x1="0" y1={y + 1.5} x2="100" y2={y + 1.5}
                stroke="#b8c4d4" strokeWidth="0.5" strokeDasharray="3 2" />
            </g>
          ))}

          {/* Vertical roads */}
          {V_ROADS.map(x => (
            <g key={`v${x}`}>
              <rect x={x} y="0" width="3" height="100" fill="#d4dce8" />
              <line x1={x + 1.5} y1="0" x2={x + 1.5} y2="100"
                stroke="#b8c4d4" strokeWidth="0.5" strokeDasharray="3 2" />
            </g>
          ))}

          {/* Intersections */}
          {H_ROADS.map(hy =>
            V_ROADS.map(vx => (
              <rect key={`int-${hy}-${vx}`} x={vx} y={hy} width="3" height="3" fill="#c9d5e4" />
            ))
          )}

          {/* Suggested route line */}
          <polyline
            points="20,75 20,55 42,55 42,38 63,38 63,22"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.2"
            strokeDasharray="2.5 1.8"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Route endpoints */}
          <circle cx="20" cy="75" r="1.5" fill="#3b82f6" opacity="0.85" />
          <circle cx="63" cy="22" r="1.5" fill="#3b82f6" opacity="0.85" />
        </svg>

        {/* ── Crowd markers ─────────────────────────────── */}
        {visible.map(marker => {
          const c = markerColors[marker.type];
          const isActive = activeMarker === marker.id;
          return (
            <div
              key={marker.id}
              className="absolute"
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              onClick={e => { e.stopPropagation(); setActiveMarker(isActive ? null : marker.id); }}
            >
              {/* Pulsing ring — fixed size, centred on marker */}
              <span
                className={`absolute -inset-3 rounded-full border-2 ${c.ring} animate-ping-slow pointer-events-none`}
                style={{ animationDuration: marker.type === "high" ? "1.4s" : "2s" }}
              />

              {/* Dot */}
              <button
                className={`relative w-5 h-5 rounded-full border-2 shadow-lg ${c.dot} ${c.glow} hover:scale-125 transition-transform duration-150 flex items-center justify-center -translate-x-1/2 -translate-y-1/2`}
                aria-label={marker.name}
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </button>

              {/* Info card */}
              {isActive && (
                <div
                  className="absolute z-30 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-in zoom-in-95 fade-in duration-150"
                  style={{ bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)" }}
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-start gap-2 mb-1">
                    {markerIcons[marker.type]}
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{marker.name}</h3>
                  </div>
                  <p className="text-slate-500 text-xs leading-snug">{marker.description}</p>
                  {/* Arrow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-slate-200 rotate-45" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Top bar ────────────────────────────────────── */}
      <div className="absolute top-4 left-4 right-4 flex items-center gap-3 z-20">
        {/* Title */}
        <div className="bg-white/95 backdrop-blur border border-slate-200 px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 flex-shrink-0">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-slate-900 text-sm">Live City View</span>
        </div>

        {/* Filter pills */}
        <div className="flex gap-1.5 bg-white/95 backdrop-blur border border-slate-200 rounded-xl p-1.5 shadow-md">
          {(["all", "high", "moderate", "safe"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-3 py-1 rounded-lg capitalize transition-colors ${
                filter === f
                  ? f === "high" ? "bg-red-500 text-white"
                  : f === "moderate" ? "bg-amber-500 text-white"
                  : f === "safe" ? "bg-emerald-500 text-white"
                  : "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="ml-auto bg-white/95 backdrop-blur border border-slate-200 px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition-all disabled:opacity-60"
          data-testid="button-refresh-map"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Updating…" : "Refresh"}
        </button>
      </div>

      {/* ── Route banner ───────────────────────────────── */}
      <div className="absolute top-20 left-4 z-20 bg-white/95 backdrop-blur border border-blue-200 rounded-xl shadow-md px-4 py-3 flex items-center gap-3 max-w-[220px]">
        <Navigation className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-slate-800">Suggested Route</p>
          <p className="text-xs text-slate-500 leading-snug mt-0.5">West End → North Metro via 42nd Street</p>
        </div>
      </div>

      {/* ── Legend ─────────────────────────────────────── */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur border border-slate-200 rounded-xl shadow-md p-4 z-20 pointer-events-none">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Route Legend</p>
        <div className="space-y-2">
          {[
            { color: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",   label: "High Congestion" },
            { color: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]", label: "Moderate" },
            { color: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]", label: "Safe" },
            { color: "bg-blue-500",                                         label: "Suggested Route" },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full ${l.color} flex-shrink-0`} />
              <span className="text-xs font-medium text-slate-700">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Marker count badge */}
      <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full z-20 pointer-events-none">
        {visible.length} zone{visible.length !== 1 ? "s" : ""} shown
      </div>
    </div>
  );
}
