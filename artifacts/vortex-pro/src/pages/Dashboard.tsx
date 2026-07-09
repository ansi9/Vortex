import { useState } from "react";
import { MapPin, Video, Navigation, AlertTriangle, Footprints } from "lucide-react";

export default function Dashboard() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [result, setResult] = useState<null | "loading" | "done">(null);

  const handleAnalyze = () => {
    if (!origin.trim() || !destination.trim()) return;
    setResult("loading");
    setTimeout(() => setResult("done"), 1400);
  };

  return (
    <div className="flex-1 min-h-[100dvh] overflow-y-auto p-6 md:p-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="max-w-5xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Command Overview</h1>
        </header>

        {/* Plan Safe Route */}
        <div className="bg-slate-900 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-lg">Plan Safe Route</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
              <input
                type="text"
                value={origin}
                onChange={(e) => { setOrigin(e.target.value); setResult(null); }}
                placeholder="Current Location (e.g., Central Park)"
                className="w-full bg-white/10 text-white placeholder-white/40 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type="text"
                value={destination}
                onChange={(e) => { setDestination(e.target.value); setResult(null); }}
                placeholder="Destination (e.g., Times Square)"
                className="w-full bg-white/10 text-white placeholder-white/40 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={result === "loading"}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            {result === "loading" ? "Analyzing…" : "Analyze Crowd & Routing"}
          </button>

          {/* Optimal Transport Plan */}
          {result === "done" && (
            <div className="pt-2 space-y-3 animate-in slide-in-from-bottom-4 fade-in duration-500">
              <h3 className="text-white font-semibold">Optimal Transport Plan</h3>
              <p className="text-slate-400 text-sm">
                Crowd Highlights in Region: 5th Avenue is currently experiencing heavy foot traffic (85% dense) due to a parade. Subway lines N, Q, R are delayed.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <p className="text-emerald-400 font-bold text-sm">Best Mode: Bus M20</p>
                  <p className="text-slate-400 text-xs mt-1">Light crowds. 24 min ETA.</p>
                </div>
                <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4">
                  <p className="text-red-400 font-bold text-sm">Avoid: Subway</p>
                  <p className="text-slate-400 text-xs mt-1">Severe crushing reported.</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                  <p className="text-blue-400 font-bold text-sm">Walk Score: 60%</p>
                  <p className="text-slate-400 text-xs mt-1">Safe, but heavy rain soon.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metric Cards + Camera */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-2xl font-extrabold text-emerald-500">14%</p>
            <p className="text-slate-700 font-semibold mt-1">City Load</p>
            <p className="text-slate-400 text-sm mt-0.5">Overall Status: Safe</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-2xl font-extrabold text-slate-900">
              98% <span className="text-base font-semibold text-slate-400">Safety</span>
            </p>
            <p className="text-slate-400 text-sm mt-1">Your Area Score</p>
          </div>

          {/* Live Station Cam */}
          <div className="bg-slate-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" /> LIVE: Station Cam
              </span>
            </div>
            <div className="flex-1 min-h-[80px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-slate-500 border-t-slate-300 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-slate-500 text-xs">[Camera Feed Loading]</p>
              </div>
            </div>
          </div>
        </div>

        {/* Route Advisory */}
        <div className="bg-blue-50/60 border-l-4 border-blue-500 rounded-r-2xl p-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-slate-900">Quick Route Advisory</h3>
            <p className="text-slate-700 mt-1 text-sm leading-relaxed">
              Metro Blue Line is experiencing delays. Stick to Bus Route 42 for the fastest commute.
            </p>
          </div>
        </div>

        {/* Walk Score footer */}
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Footprints className="w-4 h-4" />
          <span>Walk conditions are currently good. Footpaths clear on most routes.</span>
        </div>
      </div>
    </div>
  );
}
