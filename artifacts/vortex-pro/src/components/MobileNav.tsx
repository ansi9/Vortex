import { LayoutDashboard, TrendingUp, Map, Compass, ShieldCheck, AlertTriangle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAppState } from "../context/AppContext";

export function MobileNav() {
  const [location] = useLocation();
  const { setIsSosActive } = useAppState();

  const navItems = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/forecast", label: "Forecast", icon: TrendingUp },
    { href: "/voyage", label: "Voyage", icon: Compass },
    { href: "/athena", label: "Athena", icon: ShieldCheck },
    { href: "/map", label: "Map", icon: Map },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-white/10 flex items-stretch">
      {navItems.map((item) => {
        const isActive = location === item.href || (location === "/" && item.href === "/dashboard");
        return (
          <Link key={item.href} href={item.href} className="flex-1">
            <div className={`flex flex-col items-center justify-center gap-1 py-2 h-full transition-colors ${
              isActive ? "text-emerald-400" : "text-slate-400 hover:text-white"
            }`}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </div>
          </Link>
        );
      })}
      {/* SOS tile */}
      <button
        onClick={() => setIsSosActive(true)}
        className="flex-1 flex flex-col items-center justify-center gap-1 py-2 bg-red-500 text-white"
      >
        <AlertTriangle className="w-5 h-5" />
        <span className="text-[10px] font-bold">SOS</span>
      </button>
    </nav>
  );
}
