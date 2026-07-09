import { useState, useEffect } from "react";
import { CloudRain, HardHat, AlertTriangle } from "lucide-react";

const BAR_TIMES = ["12 PM", "2 PM", "4 PM", "5 PM", "8 PM", "10 PM"];

const DATA = {
  today: [
    { time: "12 PM", value: 25, label: "Density at 25%", desc: "Smooth flowing. High visibility." },
    { time: "2 PM", value: 40, label: "Density at 40%", desc: "Moderate crowd. Comfortable." },
    { time: "4 PM", value: 60, label: "Density at 60%", desc: "Getting busy. Stay alert." },
    { time: "5 PM", value: 92, label: "Density at 92%", desc: "Peak rush. Avoid if possible." },
    { time: "8 PM", value: 75, label: "Density at 75%", desc: "Still heavy. Rain expected." },
    { time: "10 PM", value: 30, label: "Density at 30%", desc: "Quiet. Use well-lit exits." },
  ],
  tomorrow: [
    { time: "12 PM", value: 20, label: "Density at 20%", desc: "Very quiet. Great time to travel." },
    { time: "2 PM", value: 35, label: "Density at 35%", desc: "Light crowd. Good conditions." },
    { time: "4 PM", value: 55, label: "Density at 55%", desc: "Picking up. Plan accordingly." },
    { time: "5 PM", value: 85, label: "Density at 85%", desc: "High crowd. Take alternatives." },
    { time: "8 PM", value: 70, label: "Density at 70%", desc: "Moderately busy." },
    { time: "10 PM", value: 25, label: "Density at 25%", desc: "Calm evening. Safe to travel." },
  ],
};

const disruptions = [
  {
    icon: CloudRain,
    title: "Rain Forecast",
    desc: "Heavy downpour expected at 4:30 PM. Expect sudden surges in underground stations.",
    color: "border-blue-400 text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: HardHat,
    title: "Construction",
    desc: "North Gate exit closed. Bottleneck likely at East Gate during rush hour.",
    color: "border-yellow-400 text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    icon: AlertTriangle,
    title: "Accident Prone",
    desc: "Intersection of 5th & Main has poor lighting tonight. Route adjusted to avoid.",
    color: "border-red-400 text-red-600",
    bg: "bg-red-50",
  },
];

function getColor(value: number) {
  if (value >= 85) return "bg-red-500";
  if (value >= 55) return "bg-yellow-400";
  return "bg-emerald-400";
}

export default function Forecast() {
  const [day, setDay] = useState<"today" | "tomorrow">("today");
  const [animate, setAnimate] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, [day]);

  const current = DATA[day];
  const activeBar = hovered !== null ? current[hovered] : null;

  return (
    <div className="flex-1 min-h-[100dvh] overflow-y-auto p-6 md:p-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Crowd Forecast</h1>
          <div className="flex rounded-full border border-slate-200 overflow-hidden shadow-sm">
            {(["today", "tomorrow"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDay(d)}
                className={`px-5 py-2 text-sm font-semibold capitalize transition-colors ${
                  day === d
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                {d === "today" ? "Today" : "Tomorrow"}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="relative h-52 flex items-end justify-between gap-2">
            {current.map((item, i) => (
              <div
                key={item.time}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="w-full flex justify-center items-end h-40">
                  <div
                    className={`w-full max-w-[52px] rounded-t-md transition-all duration-700 ease-out ${getColor(item.value)} ${hovered === i ? "brightness-90" : ""}`}
                    style={{
                      height: animate ? `${item.value}%` : "0%",
                      transitionDelay: `${i * 60}ms`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-500 whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>

          {/* Detail row */}
          <div className="mt-4 h-10 flex items-center justify-center">
            {activeBar ? (
              <div className="text-center animate-in fade-in duration-200">
                <span className="font-semibold text-slate-800 text-sm">{activeBar.time}: {activeBar.label}.</span>{" "}
                <span className="text-emerald-600 text-sm font-medium">{activeBar.desc}</span>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Hover a bar to see crowd detail</p>
            )}
          </div>
        </div>

        {/* Area Disruptions */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Area Disruptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {disruptions.map((d) => (
              <div key={d.title} className={`${d.bg} border-l-4 ${d.color.split(" ")[0]} rounded-xl p-4`}>
                <div className={`flex items-center gap-2 font-bold text-sm mb-1 ${d.color.split(" ")[1]}`}>
                  <d.icon className="w-4 h-4" />
                  {d.title}
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
