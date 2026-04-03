import { useState, useEffect } from "react";
import { Heart, Stethoscope, Syringe, Scissors, Phone, MapPin, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import { getSiteContent, type SiteContent } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = { Heart, Scissors, Syringe, Stethoscope };

function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return (
    <section id={id} ref={ref} className={`section-fade py-20 ${className}`}>
      {children}
    </section>
  );
}

export default function HomePage() {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    getSiteContent().then(setContent);
    const interval = setInterval(async () => {
      const c = await getSiteContent();
      setContent(c);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={content.hero.videoUrl}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <img src="/images/logo.png" alt="Pet Planet" className="w-24 h-24 mx-auto mb-6 animate-float" />
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-primary-foreground mb-4">
            {content.hero.title}
          </h1>
          <p className="font-heading text-xl md:text-2xl text-primary-foreground/80 mb-2">
            {content.hero.subtitle}
          </p>
          <p className="text-primary-foreground/60 mb-8 max-w-md mx-auto">
            Professional veterinary care by Dr. Khaled Nasser. Your pets deserve the best.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/login">
              <Button size="lg" className="animate-pulse-glow">Login</Button>
            </Link>
            <a href="#contact">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Contact Us
              </Button>
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary-foreground/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* About */}
      <Section id="about">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                About <span className="gradient-text">Pet Planet</span>
              </h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line mb-4">
                {content.about.text}
              </div>
              <div className="flex gap-6 mt-8">
                <div className="text-center">
                  <p className="font-heading text-3xl font-bold text-primary"><AnimatedCounter end={350} suffix="+" /></p>
                  <p className="text-sm text-muted-foreground">Happy Clients</p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-3xl font-bold text-primary"><AnimatedCounter end={1000} suffix="+" /></p>
                  <p className="text-sm text-muted-foreground">Cases Treated</p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-3xl font-bold text-primary"><AnimatedCounter end={5} suffix="+" /></p>
                  <p className="text-sm text-muted-foreground">Years Experience</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={content.about.images[0] || "/images/doctor.jpg"}
                  alt="Dr. Khaled Nasser"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 glass-card p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <Stethoscope className="text-primary-foreground" size={24} />
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm">Dr. Khaled Nasser</p>
                  <p className="text-xs text-muted-foreground">Lead Veterinarian</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Services */}
      <Section id="services" className="bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Our <span className="gradient-text">Services</span></h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Comprehensive veterinary care for your pets</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {content.services.map((s, i) => {
              const Icon = iconMap[s.icon] || Heart;
              return (
                <div key={i} className="glass-card-hover overflow-hidden group">
                  {s.image && (
                    <div className="h-48 overflow-hidden">
                      <img src={s.image} alt={s.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 ${s.image ? "-mt-10 relative z-10 glass-card" : ""}`}>
                      <Icon className="text-primary" size={24} />
                    </div>
                    <h3 className="font-heading font-semibold text-xl mb-2">{s.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Gallery */}
      <Section id="gallery">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Our <span className="gradient-text">Gallery</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {content.gallery.map((item, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                {item.type === "image" ? (
                  <img src={item.url} alt="" loading="lazy" className="w-full h-64 object-cover" />
                ) : (
                  <video src={item.url} controls muted className="w-full h-64 object-cover" />
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section id="stats" className="bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { n: 350, s: "+", l: "Happy Clients" },
              { n: 1000, s: "+", l: "Cases Treated" },
              { n: 24, s: "/7", l: "Available" },
              { n: 5, s: "+", l: "Years Experience" },
            ].map((item, i) => (
              <div key={i}>
                <p className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">
                  <AnimatedCounter end={item.n} suffix={item.s} />
                </p>
                <p className="text-primary-foreground/70 mt-2">{item.l}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Contact <span className="gradient-text">Us</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <a href="tel:+201151121767" className="glass-card-hover p-8 text-center">
              <Phone className="mx-auto mb-4 text-primary" size={32} />
              <h3 className="font-heading font-semibold mb-2">Phone</h3>
              <p className="text-muted-foreground text-sm">01151121767</p>
            </a>
            <a href="https://www.facebook.com/people/Pet-planet-clinic/61551599002613/" target="_blank" rel="noopener noreferrer" className="glass-card-hover p-8 text-center">
              <Facebook className="mx-auto mb-4 text-primary" size={32} />
              <h3 className="font-heading font-semibold mb-2">Facebook</h3>
              <p className="text-muted-foreground text-sm">Pet Planet Clinic</p>
            </a>
            <a href="https://www.google.com/maps?q=24.062134636139163,32.88546865767205" target="_blank" rel="noopener noreferrer" className="glass-card-hover p-8 text-center">
              <MapPin className="mx-auto mb-4 text-primary" size={32} />
              <h3 className="font-heading font-semibold mb-2">Address</h3>
              <p className="text-muted-foreground text-sm">Pet Planet Veterinary Clinic</p>
            </a>
          </div>
          <div className="mt-12 rounded-xl overflow-hidden shadow-lg max-w-4xl mx-auto h-64">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1000!2d32.88546865767205!3d24.062134636139163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjTCsDAzJzQzLjciTiAzMsKwNTMnMDcuNyJF!5e0!3m2!1sen!2seg!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Pet Planet Clinic Location"
            />
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/images/logo.png" alt="Pet Planet" className="h-8 w-8" />
            <span className="font-heading font-bold gradient-text">Pet Planet</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 Pet Planet Veterinary Clinic. All rights reserved.</p>
          <p className="text-muted-foreground text-xs mt-1">Led by Dr. Khaled Nasser</p>
        </div>
      </footer>
    </div>
  );
}
