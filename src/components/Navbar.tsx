import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  const navLinks = isHome
    ? [
        { label: "Home", href: "#hero" },
        { label: "About", href: "#about" },
        { label: "Services", href: "#services" },
        { label: "Gallery", href: "#gallery" },
        { label: "Contact", href: "#contact" },
      ]
    : [];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-card/90 backdrop-blur-xl shadow-lg border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Pet Planet" className="h-10 w-10" />
          <span className="font-heading font-bold text-lg gradient-text">Pet Planet</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isHome && (
            <Link to="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setOpen(!open)} className="p-2">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors py-2"
              >
                {l.label}
              </a>
            ))}
            {isHome && (
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full">Login</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
