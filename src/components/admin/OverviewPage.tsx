import { Users, Activity, TrendingUp, Heart, Calendar, Sparkles } from "lucide-react";
import type { UserRecord } from "@/lib/data";
import type { AdminPage } from "./AdminSidebar";

function StatCard({ icon: Icon, label, value, gradient, onClick, delay }: { icon: any; label: string; value: string | number; gradient: string; onClick?: () => void; delay: number }) {
  return (
    <button
      onClick={onClick}
      className="glass-card p-6 text-left w-full hover:border-primary/40 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl group-hover:scale-150 transition-transform duration-700" />
      <div className="flex items-center gap-4 relative">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
          <Icon className="text-primary-foreground" size={26} />
        </div>
        <div>
          <p className="text-3xl font-heading font-bold text-gradient-animated">{value}</p>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
        </div>
      </div>
    </button>
  );
}

export default function OverviewPage({ users, onNavigate }: { users: UserRecord[]; onNavigate: (page: AdminPage) => void }) {
  const activeCases = users.filter((u) => u.status !== "Euthanized").length;
  const improving = users.filter((u) => u.status === "Improving").length;
  const critical = users.filter((u) => u.status === "Critical").length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero header with animated gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-accent p-8 text-primary-foreground shadow-2xl">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-blob" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-accent/30 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="relative">
          <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-2">
            <Sparkles size={16} className="animate-pulse" />
            Welcome back
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Dr. Khaled Nasser 👋</h1>
          <p className="text-primary-foreground/80">Here's what's happening at your clinic today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Patients" value={users.length} gradient="from-primary to-primary/70" onClick={() => onNavigate("users")} delay={0} />
        <StatCard icon={Activity} label="Active Cases" value={activeCases} gradient="from-accent to-accent/70" onClick={() => onNavigate("active-cases")} delay={100} />
        <StatCard icon={Heart} label="Improving" value={improving} gradient="from-success to-success/70" onClick={() => onNavigate("active-cases")} delay={200} />
        <StatCard icon={TrendingUp} label="Critical" value={critical} gradient="from-critical to-critical/70" onClick={() => onNavigate("active-cases")} delay={300} />
      </div>

      {/* Quick view of recent users */}
      <div className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: "400ms" }}>
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/5 to-accent/5">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            Recent Patients
          </h2>
          <button onClick={() => onNavigate("users")} className="text-sm text-primary hover:underline font-medium magnetic-btn">View All →</button>
        </div>
        <div className="divide-y divide-border/50">
          {users.slice(0, 5).map((u, i) => (
            <div
              key={u.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer animate-fade-in"
              style={{ animationDelay: `${500 + i * 50}ms` }}
              onClick={() => onNavigate("users")}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md">
                  {u.owner.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{u.owner.name}</p>
                  <p className="text-xs text-muted-foreground">{u.animal.species} • {u.animal.diagnosis || "No diagnosis"}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold status-${u.status.toLowerCase()} shadow-sm`}>
                {u.status}
              </span>
            </div>
          ))}
          {users.length === 0 && (
            <div className="px-6 py-12 text-center text-muted-foreground text-sm">
              No patients yet. Add your first one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
