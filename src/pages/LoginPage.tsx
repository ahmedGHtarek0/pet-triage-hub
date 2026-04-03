import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Please enter a phone number");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const result = login(phone.trim());
    setLoading(false);
    if (result.success) {
      toast.success(`Welcome! Redirecting to ${result.role} dashboard...`);
      setTimeout(() => navigate(result.role === "admin" ? "/admin" : "/dashboard"), 500);
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Navbar />
      <div className="w-full max-w-md px-4">
        <div className="glass-card p-8 animate-scale-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Shield className="text-primary" size={32} />
            </div>
            <h1 className="font-heading text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Login with your phone number</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Logging in...
                </div>
              ) : (
                <span className="flex items-center gap-2">Login <ArrowRight size={18} /></span>
              )}
            </Button>
          </form>
          <div className="mt-6 p-4 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Demo:</strong> Admin: 1730183313455233839 | User: 01124783322
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
