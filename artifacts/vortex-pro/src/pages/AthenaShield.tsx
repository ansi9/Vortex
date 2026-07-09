import { useState } from "react";
import { ShieldCheck, MapPin, Heart, Home, Phone } from "lucide-react";

const TILES = [
  {
    label: "Pads & Washrooms",
    icon: Home,
    feedback: "Locating nearest public washroom facility… Found one 200m away.",
    color: "border-slate-200 hover:border-pink-300 hover:bg-pink-50",
    iconColor: "text-slate-600",
  },
  {
    label: "Nearby Clinics",
    icon: Heart,
    feedback: "Routing to nearest open 24/7 Clinic… 0.4 km via Station Road.",
    color: "border-slate-200 hover:border-pink-300 hover:bg-pink-50",
    iconColor: "text-slate-600",
  },
  {
    label: "Safe Zones",
    icon: MapPin,
    feedback: "3 verified safe zones found nearby. Nearest: Central Metro Station (150m).",
    color: "border-slate-200 hover:border-pink-300 hover:bg-pink-50",
    iconColor: "text-slate-600",
  },
  {
    label: "Helpline",
    icon: Phone,
    feedback: "Connecting to Women's Safety Helpline (1091)… Please stay on the line.",
    color: "border-pink-300 bg-pink-50 hover:bg-pink-100",
    iconColor: "text-pink-500",
  },
];

export default function AthenaShield() {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleTile = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="flex-1 min-h-[100dvh] overflow-y-auto p-6 md:p-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="w-7 h-7 text-pink-500" />
            <h1 className="text-3xl font-bold text-pink-500 tracking-tight">Athena Shield</h1>
          </div>
          <p className="text-slate-500 ml-10">Your dedicated safety companion for every journey.</p>
        </header>

        {/* Women's Safety Index */}
        <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Women's Safety Index</h2>
            <p className="text-slate-400 text-sm mt-1">Current Region: Downtown</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-extrabold text-emerald-400">88</span>
            <span className="text-slate-400 text-lg font-semibold">/100</span>
          </div>
        </div>

        {/* Feedback toast */}
        {feedback && (
          <div className="bg-pink-50 border border-pink-300 text-pink-800 rounded-xl px-5 py-4 text-sm font-medium animate-in slide-in-from-top-4 fade-in duration-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
            {feedback}
          </div>
        )}

        {/* Tiles */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Immediate Safe Havens & Utilities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TILES.map((tile) => (
              <button
                key={tile.label}
                onClick={() => handleTile(tile.feedback)}
                className={`bg-white border-2 rounded-2xl p-5 flex flex-col items-center gap-3 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95 ${tile.color}`}
              >
                <tile.icon className={`w-7 h-7 ${tile.iconColor}`} />
                <span className={`text-sm font-semibold text-center leading-snug ${tile.label === "Helpline" ? "text-pink-600" : "text-slate-700"}`}>
                  {tile.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Safety tips */}
        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6 space-y-3">
          <h3 className="font-bold text-pink-700">Safety Tips</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            {[
              "Share your live location with a trusted contact before travelling at night.",
              "Use the Helpline tile immediately if you feel unsafe — it dials 1091.",
              "Safe Zones are verified, well-lit, staffed locations. Head there first.",
              "Athena Shield refreshes every 30 minutes with updated region scores.",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span className="text-pink-400 mt-0.5 flex-shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
