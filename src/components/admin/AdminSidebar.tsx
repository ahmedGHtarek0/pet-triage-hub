import { useState } from "react";
import { Users, Activity, Clock, Globe, LogOut, LayoutDashboard, ShoppingBag, Package, KeyRound, Eye, EyeOff, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdminPhone, setAdminPhone } from "@/lib/data";
import { toast } from "sonner";

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
  const [showSecurity, setShowSecurity] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [value, setValue] = useState(getAdminPhone());

  const save = () => {
    const v = value.trim();
    if (v.length < 5) { toast.error("Security number must be at least 5 characters"); return; }
    setAdminPhone(v);
    toast.success("Security number updated");
    setShowSecurity(false);
  };

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
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full font-semibold gap-2"
          onClick={() => { setValue(getAdminPhone()); setShowSecurity(true); }}
        >
          <KeyRound size={16} /> Security Number
        </Button>
        <Button variant="outline" size="sm" className="w-full magnetic-btn font-semibold" onClick={onLogout}>
          <LogOut size={16} className="mr-2" /> Logout
        </Button>
      </div>

      {showSecurity && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setShowSecurity(false)} />
          <div className="relative min-h-full flex items-center justify-center p-4">
            <div className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full animate-scale-in border border-border p-6 my-8">
              <button onClick={() => setShowSecurity(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted">
                <X size={18} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <KeyRound className="text-primary" size={22} />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold">Admin Security Number</h3>
                  <p className="text-xs text-muted-foreground">Used to log in to the admin dashboard</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type={reveal ? "text" : "password"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="pr-10 font-mono"
                    placeholder="Enter new security number"
                  />
                  <button
                    type="button"
                    onClick={() => setReveal((r) => !r)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
                  >
                    {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  ⚠️ Stored only in this browser. Use the same browser to log in, or update it on each device.
                </p>
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 gap-2" onClick={save}>
                    <Save size={16} /> Save
                  </Button>
                  <Button variant="outline" onClick={() => setShowSecurity(false)}>Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
