import { useState, useRef, useEffect } from "react";
import { Search, Plus, Eye, Edit, Trash2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import type { UserRecord, CaseStatus } from "@/lib/data";
import { deleteUser, updateUser } from "@/lib/data";
import { toast } from "sonner";

interface Props {
  users: UserRecord[];
  onRefresh: () => void;
  onViewUser: (user: UserRecord) => void;
  onEditUser: (user: UserRecord | null) => void;
}

function StatusDropdown({ status, onChange }: { status: CaseStatus; onChange: (s: CaseStatus) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-1"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
      >
        <StatusBadge status={status} />
        <ChevronDown size={14} className="text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-lg shadow-xl py-1 z-20 min-w-[140px]">
          {(["Improving", "Stable", "Critical", "Euthanized"] as CaseStatus[]).map((s) => (
            <button
              key={s}
              onClick={(e) => { e.stopPropagation(); onChange(s); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UserListPage({ users, onRefresh, onViewUser, onEditUser }: Props) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);

  const filtered = users
    .filter((u) => filterStatus === "all" || u.status === filterStatus)
    .filter((u) =>
      u.owner.name.toLowerCase().includes(search.toLowerCase()) ||
      u.owner.phone.includes(search)
    );

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      await deleteUser(id);
      await onRefresh();
      toast.success("User deleted successfully");
    } finally { setLoadingId(null); }
  };

  const handleStatusUpdate = async (id: string, status: CaseStatus) => {
    setStatusLoadingId(id);
    try {
      await updateUser(id, { status });
      await onRefresh();
      toast.success(`Status updated to ${status}`);
    } finally { setStatusLoadingId(null); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">{users.length} total patients</p>
        </div>
        <Button onClick={() => onEditUser(null)}>
          <Plus size={16} className="mr-2" /> Add User
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="Improving">Improving</option>
          <option value="Stable">Stable</option>
          <option value="Critical">Critical</option>
          <option value="Euthanized">Euthanized</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <h3 className="font-heading font-semibold text-lg mb-2">No users found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((u) => (
            <div
              key={u.id}
              className="glass-card p-5 flex items-center justify-between cursor-pointer hover:border-primary/30 transition-all"
              onClick={() => onViewUser(u)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-heading font-bold text-primary">
                  {u.owner.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{u.owner.name}</p>
                  <p className="text-sm text-muted-foreground">{u.owner.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm">{u.animal.species} • {u.animal.sex}</p>
                  <p className="text-xs text-muted-foreground">{u.animal.diagnosis}</p>
                </div>
                <StatusDropdown
                  status={u.status}
                  onChange={(s) => handleStatusUpdate(u.id, s)}
                />
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onEditUser(u)} className="p-2 rounded-lg hover:bg-accent/10 text-accent transition-colors" disabled={loadingId === u.id}>
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(u.id)} disabled={loadingId === u.id} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50">
                    {loadingId === u.id ? <div className="w-4 h-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
