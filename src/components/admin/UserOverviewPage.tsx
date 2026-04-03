import { User, Heart, Stethoscope, Activity, ChevronRight } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import Breadcrumb from "@/components/Breadcrumb";
import type { UserRecord } from "@/lib/data";

interface Props {
  user: UserRecord;
  onBack: () => void;
  onViewCase: () => void;
}

export default function UserOverviewPage({ user, onBack, onViewCase }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[
        { label: "Users", onClick: onBack },
        { label: user.owner.name },
      ]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">{user.owner.name}</h1>
          <p className="text-muted-foreground text-sm">{user.owner.phone} • ID: {user.owner.id}</p>
        </div>
        <StatusBadge status={user.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Owner Info */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="text-primary" size={20} />
            </div>
            <h2 className="font-heading font-semibold">Owner Information</h2>
          </div>
          <div className="space-y-3">
            {[
              ["Name", user.owner.name],
              ["Phone", user.owner.phone],
              ["ID", user.owner.id],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Animal Info */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Heart className="text-accent" size={20} />
            </div>
            <h2 className="font-heading font-semibold">Pet Information</h2>
          </div>
          <div className="space-y-3">
            {[
              ["Species", user.animal.species],
              ["Sex", user.animal.sex],
              ["Age", `${user.animal.age} years`],
              ["Weight", user.animal.weight || "N/A"],
              ["Diagnosis", user.animal.diagnosis],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case Summary - Clickable */}
      <button
        onClick={onViewCase}
        className="glass-card p-6 w-full text-left hover:border-primary/30 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Stethoscope className="text-warning" size={20} />
            </div>
            <div>
              <h2 className="font-heading font-semibold">Active Case</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {user.medicalCase.category} • {user.medicalCase.type.join(", ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground">{user.treatment.length} treatments</p>
              <p className="text-xs text-muted-foreground">{user.vitalSigns.length} vital records</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </button>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <Activity className="mx-auto mb-2 text-primary" size={20} />
          <p className="text-2xl font-heading font-bold">{user.treatment.length}</p>
          <p className="text-xs text-muted-foreground">Treatments</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Stethoscope className="mx-auto mb-2 text-accent" size={20} />
          <p className="text-2xl font-heading font-bold">{user.vitalSigns.length}</p>
          <p className="text-xs text-muted-foreground">Vital Records</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Heart className="mx-auto mb-2 text-warning" size={20} />
          <p className="text-2xl font-heading font-bold">{user.photos?.length || 0}</p>
          <p className="text-xs text-muted-foreground">Photos</p>
        </div>
      </div>
    </div>
  );
}
