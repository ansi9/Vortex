import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";

export default function Forecast() {
  const [day, setDay] = useState<"today" | "tomorrow">("today");
  const [animate, setAnimate] = useState(false);

  // Trigger animation on mount and when day changes
  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, [day]);

  const data = {
    today: [
      { time: "2PM", value: 30 },
      { time: "3PM", value: 45 },
      { time: "4PM", value: 60 },
      { time: "5PM", value: 95 },
      { time: "6PM", value: 90 },
      { time: "7PM", value: 40 },
    ],
    tomorrow: [
      { time: "2PM", value: 20 },
      { time: "3PM", value: 35 },
      { time: "4PM", value: 55 },
      { time: "5PM", value: 85 },
      { time: "6PM", value: 80 },
      { time: "7PM", value: 30 },
    ],
  };

  const currentData = data[day];

  const getColor = (value: number) => {
    if (value >= 95) return "bg-red-500"; // peak red
    if (value >= 90) return "bg-red-300"; // red
    if (value >= 60) return "bg-amber-300"; // amber
    return "bg-green-300"; // green
  };

  return (
    <div className="flex-1 min-h-[100dvh] overflow-y-auto p-6 md:p-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Crowd Prediction</h1>
          <p className="text-slate-500 font-medium mt-1">Avoid the rush. Plan ahead.</p>
        </header>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-bold text-xl text-slate-900">Central Station Density</h2>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value as "today" | "tomorrow")}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 font-medium cursor-pointer outline-none"
              data-testid="select-forecast-day"
            >
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
            </select>
          </div>

          {/* Chart Area */}
          <div className="relative h-64 mt-8">
            <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
              {currentData.map((item, i) => (
                <div key={item.time} className="flex flex-col items-center group w-1/6">
                  {/* Tooltip & Bar Container */}
                  <div className="relative h-48 w-full flex justify-center items-end">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1 px-2 rounded pointer-events-none z-10">
                      {item.value}%
                    </div>
                    {/* Bar */}
                    <div 
                      className={`w-full max-w-[48px] rounded-t-md transition-all duration-1000 ease-out ${getColor(item.value)} hover:brightness-95 cursor-crosshair`}
                      style={{ 
                        height: animate ? `${item.value}%` : '0%',
                        transitionDelay: `${i * 50}ms`
                      }}
                    ></div>
                  </div>
                  {/* Label */}
                  <div className="h-8 mt-2 flex items-center justify-center">
                    <span className="text-xs font-medium text-slate-500">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Baseline */}
            <div className="absolute bottom-8 left-0 right-0 h-px bg-slate-200"></div>
          </div>
        </div>

        <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl p-6 flex items-start gap-4">
          <div className="bg-emerald-100 p-2 rounded-full text-emerald-700 mt-1">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-900 text-lg">Smart Tip</h3>
            <p className="text-emerald-800 mt-1 font-medium leading-relaxed">
              Peak rush begins at 5:00 PM. If you wait until 7:00 PM, crowd density drops by 55%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
