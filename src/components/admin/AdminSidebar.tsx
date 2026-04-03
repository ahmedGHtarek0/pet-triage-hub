import { Users, Activity, Clock, Globe, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AdminPage = "overview" | "users" | "active-cases" | "activity" | "content";

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
];

export default function AdminSidebar({ current, onNavigate, onLogout }: Props) {
  return (
    <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-4rem)] flex flex-col shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              current === item.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <Button variant="outline" size="sm" className="w-full" onClick={onLogout}>
          <LogOut size={16} className="mr-2" /> Logout
        </Button>
      </div>
    </aside>
  );
}
