import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addUser, updateUser, type UserRecord, type CaseStatus } from "@/lib/data";
import { toast } from "sonner";

interface Props {
  user: UserRecord | null;
  onClose: () => void;
  onSave: () => void;
}

export default function UserFormModal({ user, onClose, onSave }: Props) {
  const [name, setName] = useState(user?.owner.name || "");
  const [phone, setPhone] = useState(user?.owner.phone || "");
  const [ownerId, setOwnerId] = useState(user?.owner.id || "");
  const [species, setSpecies] = useState(user?.animal.species || "Dog");
  const [sex, setSex] = useState(user?.animal.sex || "Male");
  const [age, setAge] = useState(user?.animal.age || "");
  const [weight, setWeight] = useState(user?.animal.weight || "");
  const [diagnosis, setDiagnosis] = useState(user?.animal.diagnosis || "");
  const [category, setCategory] = useState(user?.medicalCase.category || "");
  const [type, setType] = useState(user?.medicalCase.type.join(", ") || "");
  const [subType, setSubType] = useState(user?.medicalCase.subType.join(", ") || "");
  const [status, setStatus] = useState<CaseStatus>(user?.status || "Stable");

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) { toast.error("Name and phone are required"); return; }
    setSaving(true);
    const record: UserRecord = {
      id: user?.id || Date.now().toString(),
      owner: { name, phone, id: ownerId },
      animal: { species, sex, age, weight, diagnosis },
      medicalCase: {
        category,
        type: type ? type.split(",").map(t => t.trim()) : [],
        subType: subType ? subType.split(",").map(t => t.trim()) : [],
      },
      treatment: user?.treatment || [],
      vitalSigns: user?.vitalSigns || [],
      status,
      photos: user?.photos || [],
    };
    if (user) {
      await updateUser(user.id, record);
      toast.success("User updated");
    } else {
      await addUser(record);
      toast.success("User added");
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="glass-card max-w-lg w-full max-h-[85vh] overflow-y-auto p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Weight</label>
              <Input value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Diagnosis</label>
              <Input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Category</label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Type (comma separated)</label>
              <Input value={type} onChange={(e) => setType(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Sub-type (comma separated)</label>
              <Input value={subType} onChange={(e) => setSubType(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as CaseStatus)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option>Improving</option><option>Stable</option><option>Critical</option><option>Euthanized</option>
            </select>
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
