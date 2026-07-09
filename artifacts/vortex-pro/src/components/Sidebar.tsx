import { LayoutDashboard, TrendingUp, Map, AlertTriangle, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAppState } from "../context/AppContext";

export function Sidebar() {
  const [location] = useLocation();
  const { setIsSosActive } = useAppState();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/forecast", label: "Crowd Forecast", icon: TrendingUp },
    { href: "/map", label: "Live Map", icon: Map },
  ];

  return (
    <aside className="w-[260px] bg-sidebar border-r border-sidebar-border hidden md:flex flex-col h-[100dvh] flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-wide">VORTEX PRO</span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href || (location === "/" && item.href === "/dashboard");
          return (
            <Link key={item.href} href={item.href}>
              <div 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  isActive 
                    ? "bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-500/10" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
                data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={() => setIsSosActive(true)}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-wider py-4 px-4 rounded-xl flex items-center justify-center gap-3 animate-pulse-red transition-colors"
          data-testid="button-sos"
        >
          <AlertTriangle className="w-6 h-6" />
          I'M STUCK
        </button>
      </div>
    </aside>
  );
}
