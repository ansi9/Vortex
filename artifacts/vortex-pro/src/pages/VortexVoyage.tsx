import { useState } from "react";
import { Compass, Sparkles, MapPin, Clock, Star } from "lucide-react";

const VIBES = [
  "Café Hopper & Photos",
  "Urban Cinematic Night",
  "Nature & Parks Retreat",
  "Street Food Explorer",
  "Museum & Culture Day",
  "Shopping & Chill",
];

const PRIORITIES = [
  "Highly Saveable Routes",
  "Fastest Commute",
  "Lowest Crowd Density",
  "Most Scenic Path",
  "Budget Friendly",
];

type Itinerary = {
  time: string;
  place: string;
  note: string;
  safeScore: number;
}[];

function generateItinerary(destination: string, vibe: string): Itinerary {
  const base = destination || "Downtown";
  return [
    { time: "10:00 AM", place: `${base} Central Park`, note: "Low crowd. Perfect lighting for photos.", safeScore: 96 },
    { time: "12:30 PM", place: `The ${vibe.split(" ")[0]} Café`, note: "Quiet corner spot. Outdoor seating available.", safeScore: 92 },
    { time: "2:00 PM", place: `${base} Heritage Walk`, note: "Pedestrian-only zone. Crowd at 18%.", safeScore: 89 },
    { time: "4:30 PM", place: `${base} Rooftop Viewpoint`, note: "Golden hour window. Leave by 5:30 PM.", safeScore: 85 },
    { time: "7:00 PM", place: `Night Market – East ${base}`, note: "Well-lit. Security patrol active.", safeScore: 88 },
  ];
}

export default function VortexVoyage() {
  const [destination, setDestination] = useState("");
  const [vibe, setVibe] = useState(VIBES[0]);
  const [priority, setPriority] = useState(PRIORITIES[0]);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!destination.trim()) return;
    setLoading(true);
    setItinerary(null);
    setTimeout(() => {
      setItinerary(generateItinerary(destination, vibe));
      setLoading(false);
    }, 1600);
  };

  return (
    <div className="flex-1 min-h-[100dvh] overflow-y-auto p-6 md:p-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <div className="flex items-center gap-3 mb-1">
            <Compass className="w-7 h-7 text-teal-500" />
            <h1 className="text-3xl font-bold text-teal-600 tracking-tight">Vortex Voyage</h1>
          </div>
          <p className="text-slate-500 ml-10">Curate safe, cinematic, and aesthetic itineraries for your day out.</p>
        </header>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          {/* Destination Input */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={destination}
              onChange={(e) => { setDestination(e.target.value); setItinerary(null); }}
              placeholder="Where is the squad heading?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Vibe</label>
              <select
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              >
                {VIBES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              >
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleGenerate}
            disabled={loading || !destination.trim()}
            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "Generating Itinerary…" : "Generate Aesthetic Itinerary"}
          </button>
        </div>

        {/* Itinerary Result */}
        {itinerary && (
          <div className="space-y-3 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              Your Aesthetic Itinerary
            </h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
              {itinerary.map((stop, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-5 animate-in slide-in-from-left-4 fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {i + 1}
                    </div>
                    {i < itinerary.length - 1 && (
                      <div className="w-px h-full min-h-[24px] bg-teal-100 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
                          <Clock className="w-3 h-3" />
                          {stop.time}
                        </div>
                        <p className="font-bold text-slate-900">{stop.place}</p>
                        <p className="text-slate-500 text-sm mt-0.5">{stop.note}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stop.safeScore >= 90 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {stop.safeScore}% Safe
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
