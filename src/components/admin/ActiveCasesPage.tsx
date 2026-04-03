import { Activity } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import type { UserRecord } from "@/lib/data";

interface Props {
  users: UserRecord[];
  onViewUser: (user: UserRecord) => void;
}

export default function ActiveCasesPage({ users, onViewUser }: Props) {
  const activeCases = users.filter((u) => u.status !== "Euthanized");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold">Active Cases</h1>
        <p className="text-muted-foreground text-sm mt-1">{activeCases.length} active patients</p>
      </div>

      {activeCases.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Activity className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="font-heading font-semibold text-lg mb-2">No active cases</h3>
        </div>
      ) : (
        <div className="grid gap-4">
          {activeCases.map((u) => (
            <button
              key={u.id}
              onClick={() => onViewUser(u)}
              className="glass-card p-5 flex items-center justify-between w-full text-left hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-heading font-bold text-primary">
                  {u.owner.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{u.owner.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {u.animal.species} • {u.animal.diagnosis}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">{u.treatment.length} treatments</p>
                  <p className="text-xs text-muted-foreground">{u.medicalCase.category}</p>
                </div>
                <StatusBadge status={u.status} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
