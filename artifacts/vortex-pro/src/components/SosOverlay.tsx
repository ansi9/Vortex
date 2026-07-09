import { AlertTriangle, MapPin, Radio, Phone, Activity, Users, Mic } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAppState } from "../context/AppContext";

export function SosOverlay() {
  const { isSosActive, setIsSosActive } = useAppState();
  const [broadcastDots, setBroadcastDots] = useState("");
  const [actionState, setActionState] = useState<string | null>(null);

  useEffect(() => {
    if (!isSosActive) return;
    
    const interval = setInterval(() => {
      setBroadcastDots(prev => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [isSosActive]);

  if (!isSosActive) return null;

  const handleAction = (message: string) => {
    setActionState(message);
    setTimeout(() => setActionState(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-red-900 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200" style={{ animationName: 'flash-red', animationDuration: '400ms' }}>
      <style>{`
        @keyframes flash-red {
          0% { background-color: white; }
          100% { background-color: #7f1d1d; }
        }
      `}</style>
      
      <button 
        onClick={() => setIsSosActive(false)}
        className="absolute top-6 right-6 border border-white/40 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors"
        data-testid="button-exit-sos"
      >
        EXIT SOS
      </button>

      <div className="flex flex-col items-center mb-12">
        <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(239,68,68,0.5)]">
          <AlertTriangle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2 uppercase">I'M STUCK</h1>
        <p className="text-red-200 text-lg font-medium uppercase tracking-widest">Emergency Mode Active</p>
      </div>

      <div className="w-full max-w-md bg-red-950/50 border border-red-800 rounded-2xl p-6 mb-6 flex items-center gap-4 shadow-inner">
        <Radio className="w-8 h-8 text-red-400 animate-pulse" />
        <div>
          <p className="text-white font-medium text-lg">
            Broadcasting Live Location to 3 Contacts<span className="inline-block w-4">{broadcastDots}</span>
          </p>
        </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl p-6 mb-8 flex justify-between items-center shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900">Nearest Safe Zone: Central Police Station</h3>
          </div>
          <p className="text-slate-500 text-sm">0.4 miles away • Open 24/7</p>
        </div>
        <button 
          onClick={() => handleAction("Navigating to Central Police Station...")}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
          data-testid="button-navigate-safe-zone"
        >
          Navigate
        </button>
      </div>

      {actionState && (
        <div className="absolute top-24 bg-white text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg animate-in slide-in-from-top-4 fade-in">
          {actionState}
        </div>
      )}

      <div className="w-full max-w-md grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleAction("Dialing 100...")}
          className="bg-white/10 hover:bg-white text-white hover:text-red-900 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors border border-white/20"
          data-testid="button-call-police"
        >
          <Phone className="w-8 h-8" />
          <span className="font-bold">Call Police</span>
        </button>
        <button 
          onClick={() => handleAction("Dialing Ambulance...")}
          className="bg-white/10 hover:bg-white text-white hover:text-red-900 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors border border-white/20"
          data-testid="button-medical"
        >
          <Activity className="w-8 h-8" />
          <span className="font-bold">Medical</span>
        </button>
        <button 
          onClick={() => handleAction("Alert sent to parents")}
          className="bg-white/10 hover:bg-white text-white hover:text-red-900 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors border border-white/20"
          data-testid="button-alert-parents"
        >
          <Users className="w-8 h-8" />
          <span className="font-bold">Alert Parents</span>
        </button>
        <button 
          onClick={() => handleAction("Recording started...")}
          className="bg-white/10 hover:bg-white text-white hover:text-red-900 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors border border-white/20"
          data-testid="button-record-audio"
        >
          <Mic className="w-8 h-8" />
          <span className="font-bold">Record Audio</span>
        </button>
      </div>
    </div>
  );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
    </svg>
  );
}
