import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, ArrowRight, Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || loading) return;

    // Basic validation
    if (phone.trim().length < 5) {
      setStatus("error");
      setMessage("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setMessage("");

    await new Promise((r) => setTimeout(r, 1500));

    const result = await login(phone.trim());
    setLoading(false);

    if (result.success) {
      setStatus("success");
      setMessage(
        result.role === "admin"
          ? "Welcome back, Dr. Khaled! Redirecting..."
          : "Welcome! Loading your dashboard..."
      );
      setTimeout(() => navigate(result.role === "admin" ? "/admin" : "/dashboard"), 1200);
    } else {
      setStatus("error");
      setMessage("This phone number is not registered in our system");
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
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (status !== "idle") {
                    setStatus("idle");
                    setMessage("");
                  }
                }}
                disabled={loading || status === "success"}
                className={`pl-10 transition-all duration-300 ${
                  status === "error"
                    ? "border-destructive ring-2 ring-destructive/20"
                    : status === "success"
                    ? "border-primary ring-2 ring-primary/20"
                    : ""
                }`}
              />
              {status !== "idle" && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-scale-in">
                  {status === "success" ? (
                    <CheckCircle className="text-primary" size={18} />
                  ) : (
                    <XCircle className="text-destructive" size={18} />
                  )}
                </div>
              )}
            </div>

            {/* Status Message */}
            {message && (
              <div
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm animate-fade-in ${
                  status === "success"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {status === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {message}
              </div>
            )}

            <Button
              type="submit"
              className="w-full relative overflow-hidden"
              disabled={loading || status === "success"}
            >
              {loading ? (
                <span className="flex items-center gap-2 animate-fade-in">
                  <Loader2 size={18} className="animate-spin" />
                  Verifying...
                </span>
              ) : status === "success" ? (
                <span className="flex items-center gap-2 animate-fade-in">
                  <CheckCircle size={18} />
                  Redirecting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Login <ArrowRight size={18} />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
