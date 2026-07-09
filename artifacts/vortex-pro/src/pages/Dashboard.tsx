import { Bus, Users, Activity, MapPin } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex-1 min-h-[100dvh] overflow-y-auto p-6 md:p-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Live Overview</h1>
          <p className="text-emerald-600 font-medium mt-1">Current Status: Optimal</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <Bus className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Bus 42</h3>
            <p className="text-slate-500 text-sm mt-1">Arriving in 4 mins</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-emerald-600">Low Crowd</h3>
            <p className="text-slate-500 text-sm mt-1">12% Capacity</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">94%</h3>
            <p className="text-slate-500 text-sm mt-1">Safety Score</p>
          </div>
        </div>

        <div className="bg-blue-50/50 border-l-4 border-blue-500 rounded-r-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="flex items-start gap-3 relative z-10">
            <span className="text-2xl" role="img" aria-label="pin">📍</span>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Quick Route Advisory</h3>
              <p className="text-slate-700 mt-2">
                Metro Blue Line is experiencing delays. Stick to Bus Route 42 for the fastest commute.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
