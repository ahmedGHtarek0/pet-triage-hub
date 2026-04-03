import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, logout } from "@/lib/auth";
import { getUserByPhone, type UserRecord } from "@/lib/data";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  LogOut, User, Stethoscope, Activity, Heart,
  Calendar, Pill, Clock, Thermometer, FileText,
} from "lucide-react";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    if (auth.role !== "user") { navigate("/login"); return; }
    setTimeout(() => {
      const u = getUserByPhone(auth.phone);
      setUser(u || null);
      setLoading(false);
    }, 800);
  }, [navigate]);

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
        {/* Pet Profile */}
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="text-primary" size={20} />
              </div>
              <h2 className="font-heading font-semibold">Owner Information</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">{user.owner.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Phone</span>
                <span className="text-sm font-medium">{user.owner.phone}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">ID</span>
                <span className="text-sm font-medium">{user.owner.id}</span>
              </div>
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
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Species</span>
                <span className="text-sm font-medium">{user.animal.species}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Sex</span>
                <span className="text-sm font-medium">{user.animal.sex}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Age</span>
                <span className="text-sm font-medium">{user.animal.age} years</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Diagnosis</span>
                <span className="text-sm font-medium">{user.animal.diagnosis}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Case Details */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Stethoscope className="text-warning" size={20} />
            </div>
            <h2 className="font-heading font-semibold">Case Details</h2>
            <div className="ml-auto"><StatusBadge status={user.status} /></div>
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

        {/* Treatment Timeline */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="text-primary" size={20} />
            </div>
            <h2 className="font-heading font-semibold">Treatment Timeline</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {user.treatment.map((t, i) => (
                <div key={i} className="relative pl-16">
                  <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-primary border-4 border-card" />
                  <div className="bg-muted/50 rounded-xl p-4">
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vital Signs Table */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Thermometer className="text-destructive" size={20} />
            </div>
            <h2 className="font-heading font-semibold">Vital Signs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Date", "Time", "Temp °C", "Food", "Drink", "Urine", "Stool", "Notes"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {user.vitalSigns.map((v, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
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
      </div>
    </div>
  );
}
