import { Users, Activity, TrendingUp } from "lucide-react";
import type { UserRecord } from "@/lib/data";
import type { AdminPage } from "./AdminSidebar";

function StatCard({ icon: Icon, label, value, color, onClick }: { icon: any; label: string; value: string | number; color: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="glass-card p-6 text-left w-full hover:border-primary/30 transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="text-primary-foreground" size={24} />
        </div>
        <div>
          <p className="text-2xl font-heading font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </button>
  );
}

export default function OverviewPage({ users, onNavigate }: { users: UserRecord[]; onNavigate: (page: AdminPage) => void }) {
  const activeCases = users.filter((u) => u.status !== "Euthanized").length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Dr. Khaled Nasser</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Users} label="Total Users" value={350} color="bg-primary" onClick={() => onNavigate("users")} />
        <StatCard icon={Activity} label="Active Cases" value={activeCases} color="bg-accent" onClick={() => onNavigate("active-cases")} />
        <StatCard icon={TrendingUp} label="Recent Activity" value={users.length} color="bg-warning" onClick={() => onNavigate("activity")} />
      </div>

      {/* Quick view of recent users */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-heading font-semibold">Recent Patients</h2>
          <button onClick={() => onNavigate("users")} className="text-sm text-primary hover:underline">View All</button>
        </div>
        <div className="divide-y divide-border/50">
          {users.slice(0, 5).map((u) => (
            <div key={u.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{u.owner.name}</p>
                <p className="text-xs text-muted-foreground">{u.animal.species} • {u.animal.diagnosis}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium status-${u.status.toLowerCase()}`}>
                {u.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
