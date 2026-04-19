import { Users, Activity, Clock, Globe, LogOut, LayoutDashboard, ShoppingBag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AdminPage = "overview" | "users" | "active-cases" | "activity" | "content" | "products" | "orders";

interface Props {
  current: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
}

const navItems: { id: AdminPage; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "active-cases", label: "Active Cases", icon: Activity },
  { id: "activity", label: "Recent Activity", icon: Clock },
  { id: "content", label: "Website Content", icon: Globe },
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "orders", label: "Orders", icon: Package },
];

export default function AdminSidebar({ current, onNavigate, onLogout }: Props) {
  return (
    <aside className="w-64 bg-gradient-to-b from-card to-card/95 border-r border-border min-h-[calc(100vh-4rem)] flex flex-col shrink-0 sticky top-16 h-[calc(100vh-4rem)] backdrop-blur-xl">
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item, i) => {
          const isActive = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden animate-fade-in ${
                isActive
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 scale-[1.02]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {isActive && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
              <item.icon size={18} className={`relative ${isActive ? "" : "group-hover:scale-110 group-hover:rotate-6"} transition-transform`} />
              <span className="relative">{item.label}</span>
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <Button variant="outline" size="sm" className="w-full magnetic-btn font-semibold" onClick={onLogout}>
          <LogOut size={16} className="mr-2" /> Logout
        </Button>
      </div>
    </aside>
  );
}
