import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, logout } from "@/lib/auth";
import { getUserByPhone, type UserRecord } from "@/lib/data";
import StatusBadge from "@/components/StatusBadge";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import {
  LogOut, User, Stethoscope, Activity, Heart,
  Calendar, Pill, Clock, Thermometer, FileText,
  ChevronRight, Image,
} from "lucide-react";
import PhotoLightbox from "@/components/PhotoLightbox";

type ViewLevel = "dashboard" | "case-details";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewLevel>("dashboard");
  const [activeTab, setActiveTab] = useState<"overview" | "treatment" | "vitals" | "media">("overview");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const auth = getAuth();
    if (auth.role !== "user") { navigate("/login"); return; }
    setTimeout(() => {
      const u = getUserByPhone(auth.phone);
      setUser(u || null);
      setLoading(false);
    }, 600);
  }, [navigate]);

  // Re-read user data periodically to see admin updates
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const auth = getAuth();
      const u = getUserByPhone(auth.phone);
      if (u) setUser(u);
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => { logout(); navigate("/"); };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="glass-card p-12 text-center max-w-md">
          <User className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h2 className="font-heading text-xl font-bold mb-2">No data found</h2>
          <p className="text-muted-foreground mb-4">Your profile data is not available.</p>
          <Button onClick={handleLogout}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const isAbnormal = (val: string) => val === "Off" || val === "Blocked";

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "treatment" as const, label: "Treatment" },
    { id: "vitals" as const, label: "Vitals" },
    { id: "media" as const, label: "Photos" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Pet Planet" className="h-8 w-8" />
            <span className="font-heading font-bold gradient-text">My Dashboard</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {view === "dashboard" && (
          <div className="space-y-6 animate-fade-in">
            {/* Pet Profile Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="text-primary" size={20} />
                  </div>
                  <h2 className="font-heading font-semibold">Owner Information</h2>
                </div>
                <div className="space-y-3">
                  {[["Name", user.owner.name], ["Phone", user.owner.phone], ["ID", user.owner.id]].map(([l, v]) => (
                    <div key={l} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-sm text-muted-foreground">{l}</span>
                      <span className="text-sm font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Heart className="text-accent" size={20} />
                  </div>
                  <h2 className="font-heading font-semibold">Pet Information</h2>
                </div>
                <div className="space-y-3">
                  {[["Species", user.animal.species], ["Sex", user.animal.sex], ["Age", `${user.animal.age} years`], ["Diagnosis", user.animal.diagnosis]].map(([l, v]) => (
                    <div key={l} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-sm text-muted-foreground">{l}</span>
                      <span className="text-sm font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Case Summary - Clickable */}
            <button
              onClick={() => setView("case-details")}
              className="glass-card p-6 w-full text-left hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Stethoscope className="text-warning" size={20} />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold">View Case Details</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user.medicalCase.category} • {user.medicalCase.type.join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={user.status} />
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
                <Thermometer className="mx-auto mb-2 text-accent" size={20} />
                <p className="text-2xl font-heading font-bold">{user.vitalSigns.length}</p>
                <p className="text-xs text-muted-foreground">Vital Records</p>
              </div>
              <div className="glass-card p-4 text-center">
                <Image className="mx-auto mb-2 text-warning" size={20} />
                <p className="text-2xl font-heading font-bold">{user.photos?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Photos</p>
              </div>
            </div>
          </div>
        )}

        {view === "case-details" && (
          <div className="space-y-6 animate-fade-in">
            <Breadcrumb items={[
              { label: "Dashboard", onClick: () => setView("dashboard") },
              { label: "Case Details" },
            ]} />

            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-2xl font-bold">Case Details</h1>
                <p className="text-muted-foreground text-sm mt-1">{user.animal.species} • {user.animal.diagnosis}</p>
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
                    activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <div className="glass-card p-6">
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
            )}

            {activeTab === "treatment" && (
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-4">
                  {user.treatment.map((t) => (
                    <div key={t.id} className="relative pl-16">
                      <div className="absolute left-4 top-4 w-4 h-4 rounded-full bg-primary border-4 border-card" />
                      <div className="glass-card p-4">
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "vitals" && (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        {["Date", "Time", "Temp °C", "Food", "Drink", "Urine", "Stool", "Notes"].map((h) => (
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
                          <td className="px-4 py-3 text-sm text-muted-foreground">{v.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "media" && (
              <div>
                {(user.photos?.length || 0) === 0 ? (
                  <div className="glass-card p-12 text-center">
                    <Image className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <h3 className="font-heading font-semibold text-lg mb-2">No photos yet</h3>
                    <p className="text-muted-foreground text-sm">Your doctor will upload photos here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {user.photos?.map((photo, i) => (
                      <div key={i} className="rounded-xl overflow-hidden">
                        <img src={photo} alt="" className="w-full h-40 object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
