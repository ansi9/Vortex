import { LayoutDashboard, TrendingUp, Map, AlertTriangle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAppState } from "../context/AppContext";

export function MobileNav() {
  const [location] = useLocation();
  const { setIsSosActive } = useAppState();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/forecast", label: "Forecast", icon: TrendingUp },
    { href: "/map", label: "Map", icon: Map },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-sidebar border-t border-white/10 flex md:hidden">
      {navItems.map((item) => {
        const isActive =
          location === item.href ||
          (location === "/" && item.href === "/dashboard");
        return (
          <Link key={item.href} href={item.href} className="flex-1">
            <div
              className={`flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
                isActive ? "text-emerald-400" : "text-slate-400"
              }`}
              data-testid={`mobile-link-${item.label.toLowerCase()}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </div>
          </Link>
        );
      })}

      {/* SOS tile */}
      <button
        onClick={() => setIsSosActive(true)}
        className="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-red-400 animate-pulse-red"
        data-testid="mobile-button-sos"
        aria-label="Emergency SOS"
      >
        <AlertTriangle className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase">SOS</span>
      </button>
    </nav>
  );
}
