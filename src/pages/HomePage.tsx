import { Heart, Stethoscope, Syringe, Scissors, Phone, MapPin, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";

function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return (
    <section id={id} ref={ref} className={`section-fade py-20 ${className}`}>
      {children}
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/hero-bg.mp4"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <img src="/images/logo.png" alt="Pet Planet" className="w-24 h-24 mx-auto mb-6 animate-float" />
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-primary-foreground mb-4">
            Pet Planet
          </h1>
          <p className="font-heading text-xl md:text-2xl text-primary-foreground/80 mb-2">
            Veterinary Clinic
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
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Welcome to Pet Planet Veterinary Clinic, led by Dr. Khaled Nasser. We provide comprehensive
                veterinary services with state-of-the-art facilities and compassionate care for your beloved pets.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to deliver exceptional medical care, from routine check-ups to complex surgical
                procedures, ensuring every pet receives the attention and treatment they deserve.
              </p>
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
                <img src="/images/doctor.jpg" alt="Dr. Khaled Nasser" className="w-full h-[500px] object-cover" />
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
            {[
              { icon: Heart, title: "Treatment", desc: "Advanced medical treatment for all conditions including viral infections, chronic diseases, and emergency care.", img: "/images/service-treatment.jpg" },
              { icon: Scissors, title: "Surgery", desc: "State-of-the-art surgical procedures from routine spaying/neutering to complex orthopedic operations.", img: "/images/service-surgery.jpg" },
              { icon: Syringe, title: "Vaccination", desc: "Complete vaccination programs to protect your pets against common and dangerous diseases.", img: "/images/service-vaccination.jpg" },
            ].map((s, i) => (
              <div key={i} className="glass-card-hover overflow-hidden group">
                <div className="h-48 overflow-hidden">
                  <img src={s.img} alt={s.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 -mt-10 relative z-10 glass-card">
                    <s.icon className="text-primary" size={24} />
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
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
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="/images/gallery-1.jpg" alt="Happy pets" loading="lazy" className="w-full h-64 object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="/images/gallery-2.jpg" alt="Cat care" loading="lazy" className="w-full h-64 object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="/images/doctor.jpg" alt="Dr. Khaled" loading="lazy" className="w-full h-64 object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow md:col-span-1">
              <video src="/videos/gallery-1.mp4" controls muted className="w-full h-64 object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow md:col-span-2">
              <video src="/videos/gallery-2.mp4" controls muted className="w-full h-64 object-cover" />
            </div>
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
            <a href="tel:+201124783322" className="glass-card-hover p-8 text-center">
              <Phone className="mx-auto mb-4 text-primary" size={32} />
              <h3 className="font-heading font-semibold mb-2">Phone</h3>
              <p className="text-muted-foreground text-sm">01124783322</p>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="glass-card-hover p-8 text-center">
              <Facebook className="mx-auto mb-4 text-primary" size={32} />
              <h3 className="font-heading font-semibold mb-2">Facebook</h3>
              <p className="text-muted-foreground text-sm">Pet Planet Clinic</p>
            </a>
            <div className="glass-card-hover p-8 text-center">
              <MapPin className="mx-auto mb-4 text-primary" size={32} />
              <h3 className="font-heading font-semibold mb-2">Address</h3>
              <p className="text-muted-foreground text-sm">Pet Planet Veterinary Clinic</p>
            </div>
          </div>
          <div className="mt-12 rounded-xl overflow-hidden shadow-lg max-w-4xl mx-auto h-64 bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin size={48} className="mx-auto mb-2 opacity-50" />
              <p>Map placeholder</p>
            </div>
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
