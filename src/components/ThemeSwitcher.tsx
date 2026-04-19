import { useState, useRef, useEffect } from "react";
import { Palette, Sun, Moon, Waves, Sunset, Trees, Check } from "lucide-react";
import { useTheme, type ThemeMode } from "@/hooks/useTheme";

const themeMeta: Record<ThemeMode, { label: string; icon: React.ElementType; gradient: string }> = {
  light: { label: "Light", icon: Sun, gradient: "from-amber-200 to-sky-300" },
  dark: { label: "Dark", icon: Moon, gradient: "from-slate-700 to-slate-900" },
  ocean: { label: "Ocean", icon: Waves, gradient: "from-cyan-400 to-blue-600" },
  sunset: { label: "Sunset", icon: Sunset, gradient: "from-orange-400 to-pink-600" },
  forest: { label: "Forest", icon: Trees, gradient: "from-green-500 to-emerald-700" },
};

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const Current = themeMeta[theme].icon;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-lg hover:bg-secondary transition-all text-foreground hover:scale-110 active:scale-95 relative group"
        aria-label="Change theme"
      >
        <Current size={18} className="transition-transform group-hover:rotate-12" />
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 glass-card p-2 z-[80] animate-scale-in origin-top-right shadow-2xl">
          <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Palette size={14} />
            Color Theme
          </div>
          {themes.map((t, i) => {
            const meta = themeMeta[t];
            const Icon = meta.icon;
            const active = t === theme;
            return (
              <button
                key={t}
                onClick={() => { setTheme(t); setOpen(false); }}
                style={{ animationDelay: `${i * 50}ms` }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all animate-fade-in hover:scale-[1.02] ${
                  active ? "bg-primary/10 text-primary" : "hover:bg-secondary text-foreground"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-md`}>
                  <Icon size={16} className="text-white" />
                </div>
                <span className="font-semibold text-sm flex-1 text-left">{meta.label}</span>
                {active && <Check size={16} className="text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
