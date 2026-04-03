import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, logout } from "@/lib/auth";
import {
  getUsers, addUser, updateUser, deleteUser,
  type UserRecord, type CaseStatus,
} from "@/lib/data";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Users, Activity, TrendingUp, LogOut, Plus, Search,
  Edit, Trash2, Eye, X, ChevronDown,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="text-primary-foreground" size={24} />
        </div>
        <div>
          <p className="text-2xl font-heading font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    if (auth.role !== "admin") { navigate("/login"); return; }
    setTimeout(() => { setUsers(getUsers()); setLoading(false); }, 800);
  }, [navigate]);

  const refresh = () => setUsers(getUsers());

  const handleDelete = (id: string) => {
    deleteUser(id);
    refresh();
    toast.success("User deleted successfully");
  };

  const handleStatusUpdate = (id: string, status: CaseStatus) => {
    updateUser(id, { status });
    refresh();
    toast.success(`Status updated to ${status}`);
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const filtered = users
    .filter((u) => filterStatus === "all" || u.status === filterStatus)
    .filter((u) =>
      u.owner.name.toLowerCase().includes(search.toLowerCase()) ||
      u.owner.phone.includes(search)
    );

  const activeCases = users.filter((u) => u.status !== "Euthanized").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Pet Planet" className="h-8 w-8" />
            <span className="font-heading font-bold gradient-text">Admin Dashboard</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <StatCard icon={Users} label="Total Users" value={350} color="bg-primary" />
          <StatCard icon={Activity} label="Active Cases" value={activeCases} color="bg-accent" />
          <StatCard icon={TrendingUp} label="Recent Activity" value={users.length} color="bg-warning" />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 sm:max-w-xs">
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
          <Button onClick={() => { setEditingUser(null); setShowForm(true); }}>
            <Plus size={16} className="mr-2" /> Add User
          </Button>
        </div>

        {/* Users Table */}
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center animate-fade-in">
            <Users className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="font-heading font-semibold text-lg mb-2">No users found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Owner</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Pet</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Diagnosis</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm">{u.owner.name}</p>
                        <p className="text-xs text-muted-foreground">{u.owner.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">{u.animal.species} • {u.animal.sex}</p>
                        <p className="text-xs text-muted-foreground">Age: {u.animal.age} yrs</p>
                      </td>
                      <td className="px-6 py-4 text-sm">{u.animal.diagnosis}</td>
                      <td className="px-6 py-4">
                        <div className="relative group inline-block">
                          <button className="flex items-center gap-1">
                            <StatusBadge status={u.status} />
                            <ChevronDown size={14} className="text-muted-foreground" />
                          </button>
                          <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-xl py-1 z-10 hidden group-hover:block min-w-[140px]">
                            {(["Improving", "Stable", "Critical", "Euthanized"] as CaseStatus[]).map((s) => (
                              <button
                                key={s}
                                onClick={() => handleStatusUpdate(u.id, s)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setSelectedUser(u)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => { setEditingUser(u); setShowForm(true); }} className="p-2 rounded-lg hover:bg-accent/10 text-accent transition-colors">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(u.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* View User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4" onClick={() => setSelectedUser(null)}>
          <div className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="font-heading text-xl font-bold">Patient Details</h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-muted rounded-lg"><X size={20} /></button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-heading font-semibold text-sm text-muted-foreground mb-2">Owner</h3>
                <p className="font-medium">{selectedUser.owner.name}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.owner.phone} • ID: {selectedUser.owner.id}</p>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm text-muted-foreground mb-2">Animal</h3>
                <p>{selectedUser.animal.species} • {selectedUser.animal.sex} • Age: {selectedUser.animal.age}</p>
                <p className="text-sm text-muted-foreground">Diagnosis: {selectedUser.animal.diagnosis}</p>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm text-muted-foreground mb-2">Medical Case</h3>
                <p>Category: {selectedUser.medicalCase.category}</p>
                <p className="text-sm">Type: {selectedUser.medicalCase.type.join(", ")}</p>
                <p className="text-sm">Sub-type: {selectedUser.medicalCase.subType.join(", ")}</p>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm text-muted-foreground mb-2">Status</h3>
                <StatusBadge status={selectedUser.status} />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm text-muted-foreground mb-2">Treatment History</h3>
                {selectedUser.treatment.map((t, i) => (
                  <div key={i} className="bg-muted/50 p-3 rounded-lg mb-2 text-sm">
                    <p className="font-medium">Date: {t.date} {t.staff && `• ${t.staff}`}</p>
                    {t.drugs && <p>Drugs: {t.drugs.join(", ")}</p>}
                    {t.time && <p>Time: {t.time.join(", ")}</p>}
                    {t.notes && <p className="text-muted-foreground">{t.notes}</p>}
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm text-muted-foreground mb-2">Vital Signs</h3>
                {selectedUser.vitalSigns.map((v, i) => (
                  <div key={i} className="bg-muted/50 p-3 rounded-lg mb-2 text-sm">
                    <p className="font-medium">{v.date} at {v.time} • Temp: {v.temp}°C</p>
                    <p>Food: {v.food} • Drink: {v.drink} • Urine: {v.urine} • Stool: {v.stool}</p>
                    <p className="text-muted-foreground">{v.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <UserFormModal
          user={editingUser}
          onClose={() => { setShowForm(false); setEditingUser(null); }}
          onSave={() => { refresh(); setShowForm(false); setEditingUser(null); }}
        />
      )}
    </div>
  );
}

function UserFormModal({ user, onClose, onSave }: { user: UserRecord | null; onClose: () => void; onSave: () => void }) {
  const [name, setName] = useState(user?.owner.name || "");
  const [phone, setPhone] = useState(user?.owner.phone || "");
  const [ownerId, setOwnerId] = useState(user?.owner.id || "");
  const [species, setSpecies] = useState(user?.animal.species || "Dog");
  const [sex, setSex] = useState(user?.animal.sex || "Male");
  const [age, setAge] = useState(user?.animal.age || "");
  const [diagnosis, setDiagnosis] = useState(user?.animal.diagnosis || "");
  const [category, setCategory] = useState(user?.medicalCase.category || "");
  const [status, setStatus] = useState<CaseStatus>(user?.status || "Stable");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) { toast.error("Name and phone are required"); return; }
    const record: UserRecord = {
      id: user?.id || Date.now().toString(),
      owner: { name, phone, id: ownerId },
      animal: { species, sex, age, weight: "", diagnosis },
      medicalCase: { category, type: [], subType: [] },
      treatment: user?.treatment || [],
      vitalSigns: user?.vitalSigns || [],
      status,
    };
    if (user) {
      updateUser(user.id, record);
      toast.success("User updated successfully");
    } else {
      addUser(record);
      toast.success("User added successfully");
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="glass-card max-w-lg w-full max-h-[80vh] overflow-y-auto p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="font-heading text-xl font-bold">{user ? "Edit" : "Add"} User</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Owner Name *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Phone *</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Owner ID</label>
            <Input value={ownerId} onChange={(e) => setOwnerId(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Species</label>
              <select value={species} onChange={(e) => setSpecies(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option>Dog</option><option>Cat</option><option>Bird</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Sex</label>
              <select value={sex} onChange={(e) => setSex(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option>Male</option><option>Female</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Age</label>
              <Input value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Diagnosis</label>
            <Input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as CaseStatus)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option>Improving</option><option>Stable</option><option>Critical</option><option>Euthanized</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{user ? "Update" : "Add"} User</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
