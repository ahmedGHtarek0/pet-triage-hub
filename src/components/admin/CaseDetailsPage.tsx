import { useState } from "react";
import {
  Stethoscope, Calendar, Pill, Clock, FileText, Thermometer,
  Plus, Edit, Trash2, X, Image,
} from "lucide-react";
import PhotoLightbox from "@/components/PhotoLightbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/StatusBadge";
import Breadcrumb from "@/components/Breadcrumb";
import {
  type UserRecord, type Treatment, type VitalSign,
  addTreatment, updateTreatment, deleteTreatment,
  addVitalSign, updateVitalSign, deleteVitalSign,
  updateUser,
} from "@/lib/data";
import { toast } from "sonner";

interface Props {
  user: UserRecord;
  onBackToUsers: () => void;
  onBackToUser: () => void;
  onRefresh: () => void;
}

export default function CaseDetailsPage({ user, onBackToUsers, onBackToUser, onRefresh }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "treatment" | "vitals" | "media">("overview");
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [showVitalForm, setShowVitalForm] = useState(false);
  const [editingVital, setEditingVital] = useState<VitalSign | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [deletingTreatmentId, setDeletingTreatmentId] = useState<string | null>(null);
  const [deletingVitalId, setDeletingVitalId] = useState<string | null>(null);
  const [deletingPhotoIdx, setDeletingPhotoIdx] = useState<number | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "treatment" as const, label: "Treatment History" },
    { id: "vitals" as const, label: "Vital Signs" },
    { id: "media" as const, label: "Photos & Media" },
  ];

  const isAbnormal = (val: string) => val === "Off" || val === "Blocked";

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[
        { label: "Users", onClick: onBackToUsers },
        { label: user.owner.name, onClick: onBackToUser },
        { label: "Case Details" },
      ]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Case Details</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {user.animal.species} • {user.animal.diagnosis}
          </p>
        </div>
        <StatusBadge status={user.status} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Stethoscope className="text-warning" size={20} />
              <h3 className="font-heading font-semibold">Diagnosis</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Category</p>
                <p className="text-sm font-medium">{user.medicalCase.category}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Type</p>
                <div className="flex flex-wrap gap-2">
                  {user.medicalCase.type.map((t, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Sub-type</p>
                <div className="flex flex-wrap gap-2">
                  {user.medicalCase.subType.map((t, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick summary */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Latest Treatment</p>
              {user.treatment.length > 0 ? (
                <div>
                  <p className="font-medium text-sm">{user.treatment[user.treatment.length - 1].date}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.treatment[user.treatment.length - 1].notes || user.treatment[user.treatment.length - 1].drugs?.join(", ")}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No treatments recorded</p>
              )}
            </div>
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Latest Vitals</p>
              {user.vitalSigns.length > 0 ? (
                <div>
                  <p className="font-medium text-sm">{user.vitalSigns[user.vitalSigns.length - 1].date} • Temp: {user.vitalSigns[user.vitalSigns.length - 1].temp}°C</p>
                  <p className="text-xs text-muted-foreground">{user.vitalSigns[user.vitalSigns.length - 1].notes}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No vitals recorded</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "treatment" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setEditingTreatment(null); setShowTreatmentForm(true); }}>
              <Plus size={16} className="mr-2" /> Add Treatment
            </Button>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-4">
              {user.treatment.map((t) => (
                <div key={t.id} className="relative pl-16">
                  <div className="absolute left-4 top-4 w-4 h-4 rounded-full bg-primary border-4 border-card" />
                  <div className="glass-card p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="text-muted-foreground" size={14} />
                          <span className="font-heading font-semibold text-sm">{t.date}</span>
                          {t.staff && <span className="text-xs text-muted-foreground">• {t.staff}</span>}
                        </div>
                        {t.drugs && (
                          <div className="flex items-start gap-2 mb-2">
                            <Pill className="text-primary mt-0.5" size={14} />
                            <div className="flex flex-wrap gap-1.5">
                              {t.drugs.map((d, j) => (
                                <span key={j} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">{d}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {t.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="text-muted-foreground" size={14} />
                            <span className="text-xs text-muted-foreground">{t.time.join(", ")}</span>
                          </div>
                        )}
                        {t.notes && (
                          <div className="flex items-center gap-2 mt-2">
                            <FileText className="text-muted-foreground" size={14} />
                            <span className="text-sm text-muted-foreground">{t.notes}</span>
                          </div>
                        )}
                        {t.photos && t.photos.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {t.photos.map((p, i) => (
                              <img key={i} src={p} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => { setEditingTreatment(t); setShowTreatmentForm(true); }}
                          className="p-1.5 rounded hover:bg-accent/10 text-accent transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={async () => {
                            setDeletingTreatmentId(t.id);
                            try { await deleteTreatment(user.id, t.id); await onRefresh(); toast.success("Treatment deleted"); }
                            finally { setDeletingTreatmentId(null); }
                          }}
                          disabled={deletingTreatmentId === t.id}
                          className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50"
                        >
                          {deletingTreatmentId === t.id ? <div className="w-3.5 h-3.5 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "vitals" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setEditingVital(null); setShowVitalForm(true); }}>
              <Plus size={16} className="mr-2" /> Add Vital Sign
            </Button>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    {["Date", "Time", "Temp °C", "Food", "Drink", "Urine", "Stool", "Notes", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {user.vitalSigns.map((v) => (
                    <tr key={v.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{v.date}</td>
                      <td className="px-4 py-3 text-sm">{v.time}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={parseFloat(v.temp) > 39.2 ? "text-destructive font-semibold" : ""}>{v.temp}</span>
                      </td>
                      <td className={`px-4 py-3 text-sm ${isAbnormal(v.food) ? "text-destructive font-semibold" : ""}`}>{v.food}</td>
                      <td className={`px-4 py-3 text-sm ${isAbnormal(v.drink) ? "text-destructive font-semibold" : ""}`}>{v.drink}</td>
                      <td className={`px-4 py-3 text-sm ${isAbnormal(v.urine) ? "text-destructive font-semibold" : ""}`}>{v.urine}</td>
                      <td className={`px-4 py-3 text-sm ${isAbnormal(v.stool) ? "text-destructive font-semibold" : ""}`}>{v.stool}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">{v.notes}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setEditingVital(v); setShowVitalForm(true); }}
                            className="p-1.5 rounded hover:bg-accent/10 text-accent transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={async () => { await deleteVitalSign(user.id, v.id); await onRefresh(); toast.success("Vital sign deleted"); }}
                            className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "media" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*,video/*";
              input.multiple = true;
              input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (!files) return;
                Array.from(files).forEach((file) => {
                  const reader = new FileReader();
                  reader.onload = async () => {
                    const photos = [...(user.photos || [])];
                    photos.push(reader.result as string);
                    await updateUser(user.id, { photos });
                    await onRefresh();
                    toast.success("Media uploaded");
                  };
                  reader.readAsDataURL(file);
                });
              };
              input.click();
            }}>
              <Image size={16} className="mr-2" /> Upload Media
            </Button>
          </div>

          {(user.photos?.length || 0) === 0 ? (
            <div className="glass-card p-12 text-center">
              <Image className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="font-heading font-semibold text-lg mb-2">No media yet</h3>
              <p className="text-muted-foreground text-sm">Upload photos and videos for this case</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user.photos?.map((photo, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden cursor-pointer" onClick={() => setLightboxIndex(i)}>
                  <img src={photo} alt="" className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300" />
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const photos = (user.photos || []).filter((_, idx) => idx !== i);
                      await updateUser(user.id, { photos });
                      await onRefresh();
                      toast.success("Media deleted");
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Photo Lightbox */}
      {lightboxIndex !== null && user.photos && user.photos.length > 0 && (
        <PhotoLightbox
          photos={user.photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Treatment Form Modal */}
      {showTreatmentForm && (
        <TreatmentFormModal
          treatment={editingTreatment}
          userId={user.id}
          onClose={() => { setShowTreatmentForm(false); setEditingTreatment(null); }}
          onSave={() => { onRefresh(); setShowTreatmentForm(false); setEditingTreatment(null); }}
        />
      )}

      {/* Vital Form Modal */}
      {showVitalForm && (
        <VitalFormModal
          vital={editingVital}
          userId={user.id}
          onClose={() => { setShowVitalForm(false); setEditingVital(null); }}
          onSave={() => { onRefresh(); setShowVitalForm(false); setEditingVital(null); }}
        />
      )}
    </div>
  );
}

function TreatmentFormModal({ treatment, userId, onClose, onSave }: {
  treatment: Treatment | null; userId: string; onClose: () => void; onSave: () => void;
}) {
  const [date, setDate] = useState(treatment?.date || "");
  const [staff, setStaff] = useState(treatment?.staff || "");
  const [drugs, setDrugs] = useState(treatment?.drugs?.join(", ") || "");
  const [time, setTime] = useState(treatment?.time?.join(", ") || "");
  const [notes, setNotes] = useState(treatment?.notes || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) { toast.error("Date is required"); return; }
    const data: Treatment = {
      id: treatment?.id || `t${Date.now()}`,
      date,
      staff: staff || undefined,
      drugs: drugs ? drugs.split(",").map(d => d.trim()) : undefined,
      time: time ? time.split(",").map(t => t.trim()) : undefined,
      notes: notes || undefined,
      photos: treatment?.photos || [],
    };
    if (treatment) {
      await updateTreatment(userId, treatment.id, data);
      toast.success("Treatment updated");
    } else {
      await addTreatment(userId, data);
      toast.success("Treatment added");
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="glass-card max-w-lg w-full p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="font-heading text-xl font-bold">{treatment ? "Edit" : "Add"} Treatment</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Date *</label>
              <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. 24-2" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Staff</label>
              <Input value={staff} onChange={(e) => setStaff(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Drugs (comma separated)</label>
            <Input value={drugs} onChange={(e) => setDrugs(e.target.value)} placeholder="Ceftriaxone, Dexa" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Time (comma separated)</label>
            <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="2 AM, 11 AM" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Notes</label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{treatment ? "Update" : "Add"}</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VitalFormModal({ vital, userId, onClose, onSave }: {
  vital: VitalSign | null; userId: string; onClose: () => void; onSave: () => void;
}) {
  const [date, setDate] = useState(vital?.date || "");
  const [time, setTime] = useState(vital?.time || "");
  const [temp, setTemp] = useState(vital?.temp || "");
  const [food, setFood] = useState(vital?.food || "");
  const [drink, setDrink] = useState(vital?.drink || "");
  const [urine, setUrine] = useState(vital?.urine || "");
  const [stool, setStool] = useState(vital?.stool || "");
  const [notes, setNotes] = useState(vital?.notes || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) { toast.error("Date and time are required"); return; }
    const data: VitalSign = {
      id: vital?.id || `v${Date.now()}`,
      date, time, temp, food, drink, urine, stool, notes,
    };
    if (vital) {
      await updateVitalSign(userId, vital.id, data);
      toast.success("Vital sign updated");
    } else {
      await addVitalSign(userId, data);
      toast.success("Vital sign added");
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="glass-card max-w-lg w-full p-8 animate-scale-in max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="font-heading text-xl font-bold">{vital ? "Edit" : "Add"} Vital Sign</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Date *</label>
              <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. 24-2" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Time *</label>
              <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 12:15 PM" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Temperature °C</label>
            <Input value={temp} onChange={(e) => setTemp(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Food</label>
              <Input value={food} onChange={(e) => setFood(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Drink</label>
              <Input value={drink} onChange={(e) => setDrink(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Urine</label>
              <Input value={urine} onChange={(e) => setUrine(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Stool</label>
              <Input value={stool} onChange={(e) => setStool(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Notes</label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{vital ? "Update" : "Add"}</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
