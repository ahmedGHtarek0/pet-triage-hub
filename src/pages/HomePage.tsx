import { useState, useEffect, useMemo } from "react";
import { Heart, Stethoscope, Syringe, Scissors, Phone, MapPin, Facebook, Sparkles, Award, ShieldCheck, Expand } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import MediaLightbox, { type MediaItem } from "@/components/MediaLightbox";
import { getSiteContent, type SiteContent } from "@/lib/data";
import heroPoster from "@/assets/hero-poster.jpg";
import vetCheckup from "@/assets/vet-checkup.jpg";
import petGrooming from "@/assets/pet-grooming.jpg";
import petVaccination from "@/assets/pet-vaccination.jpg";
import petSurgery from "@/assets/pet-surgery.jpg";
import happyPets from "@/assets/happy-pets.jpg";
import vetStethoscope from "@/assets/vet-stethoscope.jpg";

const iconMap: Record<string, React.ElementType> = { Heart, Scissors, Syringe, Stethoscope };

const realServiceImages = [vetCheckup, petGrooming, petVaccination, petSurgery];
const realGalleryImages = [vetCheckup, happyPets, vetStethoscope, petVaccination, petGrooming, petSurgery];

function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return (
    <section id={id} ref={ref} className={`section-fade py-20 ${className}`}>
      {children}
    </section>
  );
}

function getEmbedUrl(url: string): string {
  if (/youtube\.com\/watch/.test(url)) {
    const id = url.match(/[?&]v=([^&]+)/)?.[1] || "";
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playlist=${id}`;
  }
  if (/youtu\.be/.test(url)) {
    const id = url.split("/").pop()?.split("?")[0] || "";
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playlist=${id}`;
  }
  if (/facebook\.com|fb\.watch/.test(url)) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&autoplay=1&mute=1`;
  }
  if (/vimeo\.com/.test(url)) {
    return url.replace("vimeo.com/", "player.vimeo.com/video/") + "?autoplay=1&muted=1&loop=1&background=1";
  }
  return url;
}

export default function HomePage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [lightbox, setLightbox] = useState<{ items: MediaItem[]; index: number } | null>(null);

  useEffect(() => {
    getSiteContent().then(setContent);
    const interval = setInterval(async () => {
      const c = await getSiteContent();
      setContent(c);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const isDirectVideo = useMemo(
    () => content?.hero.videoUrl && /\.(mp4|webm|ogg)(\?|$)/i.test(content.hero.videoUrl),
    [content?.hero.videoUrl]
  );

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Use real images for services if admin hasn't set custom ones
  const displayServices = content.services.length > 0
    ? content.services.map((s, i) => ({ ...s, image: s.image || realServiceImages[i % realServiceImages.length] }))
    : [
        { title: "Health Checkups", description: "Comprehensive examinations to keep your pet healthy", icon: "Stethoscope", image: vetCheckup },
        { title: "Vaccinations", description: "Complete vaccination programs for all life stages", icon: "Syringe", image: petVaccination },
        { title: "Grooming", description: "Professional grooming for a happy, clean pet", icon: "Scissors", image: petGrooming },
      ];

  const displayGallery = content.gallery.length > 0
    ? content.gallery
    : realGalleryImages.map((url) => ({ type: "image" as const, url }));

  const aboutImage = content.about.images[0] && !content.about.images[0].includes("placeholder")
    ? content.about.images[0]
    : vetStethoscope;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-foreground">
        {/* Instant poster background — shows immediately */}
        <img
          src={heroPoster}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoReady ? "opacity-0" : "opacity-100"}`}
        />

        {content.hero.videoUrl && (
          isDirectVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={heroPoster}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoReady ? "opacity-100" : "opacity-0"}`}
              src={content.hero.videoUrl}
              onCanPlay={() => setVideoReady(true)}
              onLoadedData={() => setVideoReady(true)}
              onError={(e) => { (e.target as HTMLVideoElement).style.display = 'none'; }}
            />
          ) : (
            <iframe
              src={getEmbedUrl(content.hero.videoUrl)}
              className={`absolute inset-0 w-full h-full object-cover border-0 pointer-events-none scale-150 transition-opacity duration-1000 ${videoReady ? "opacity-100" : "opacity-0"}`}
              allow="autoplay; fullscreen"
              loading="eager"
              title="Hero background"
              onLoad={() => setVideoReady(true)}
            />
          )
        )}

        {/* Animated blob decorations */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/30 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-accent/30 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob" style={{ animationDelay: "2s" }} />

        <div className="absolute inset-0 hero-overlay" />

        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <img src="/images/logo.png" alt="Pet Planet" className="w-24 h-24 mx-auto mb-6 animate-float drop-shadow-2xl" />
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-primary-foreground mb-4 drop-shadow-lg">
            {content.hero.title}
          </h1>
          <p className="font-heading text-xl md:text-2xl text-primary-foreground/90 mb-2">
            {content.hero.subtitle}
          </p>
          <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
            Professional veterinary care by Dr. Khaled Nasser. Your pets deserve the best.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/login">
              <Button size="lg" className="animate-pulse-glow magnetic-btn shine-effect bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-2xl">
                <Sparkles className="mr-2" size={18} /> Login
              </Button>
            </Link>
            <a href="#contact">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 magnetic-btn font-bold shadow-2xl border-2 border-white">
                Contact Us
              </Button>
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex items-center justify-center gap-6 text-primary-foreground/80 text-sm flex-wrap">
            <div className="flex items-center gap-2"><Award size={18} className="text-accent" /> Certified Vets</div>
            <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-accent" /> Trusted Care</div>
            <div className="flex items-center gap-2"><Heart size={18} className="text-accent" /> 350+ Happy Clients</div>
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
                About <span className="text-gradient-animated">Pet Planet</span>
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
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
              <button
                onClick={() => setLightbox({ items: [{ type: "image", url: aboutImage, alt: "Dr. Khaled Nasser" }], index: 0 })}
                className="relative rounded-2xl overflow-hidden shadow-2xl block w-full cursor-zoom-in"
              >
                <img
                  src={aboutImage}
                  alt="Dr. Khaled Nasser"
                  loading="lazy"
                  className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Expand size={18} className="text-primary" />
                </div>
              </button>
              <div className="absolute -bottom-4 -left-4 glass-card p-4 flex items-center gap-3 animate-float">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
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
      <Section id="services" className="bg-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Our <span className="text-gradient-animated">Services</span></h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Comprehensive veterinary care for your pets</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {displayServices.map((s, i) => {
              const Icon = iconMap[s.icon] || Heart;
              return (
                <div key={i} className="glass-card-hover overflow-hidden group card-3d" style={{ animationDelay: `${i * 100}ms` }}>
                  {s.image && (
                    <div className="h-48 overflow-hidden relative">
                      <img src={s.image} alt={s.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 ${s.image ? "-mt-10 relative z-10 ring-4 ring-card" : ""} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                      <Icon className="text-primary-foreground" size={24} />
                    </div>
                    <h3 className="font-heading font-semibold text-xl mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
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
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Our <span className="text-gradient-animated">Gallery</span></h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Real moments from our clinic</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {displayGallery.map((item, i) => (
              <button
                key={i}
                onClick={() => setLightbox({ items: displayGallery as MediaItem[], index: i })}
                className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group relative card-3d cursor-zoom-in"
              >
                {item.type === "image" ? (
                  <img src={item.url} alt="" loading="lazy" className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-125" />
                ) : (
                  <video src={item.url} muted className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Expand size={18} className="text-primary" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section id="stats" className="bg-gradient-to-br from-primary via-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary-foreground/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent-foreground/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { n: 350, s: "+", l: "Happy Clients" },
              { n: 1000, s: "+", l: "Cases Treated" },
              { n: 24, s: "/7", l: "Available" },
              { n: 5, s: "+", l: "Years Experience" },
            ].map((item, i) => (
              <div key={i} className="hover:scale-110 transition-transform duration-300">
                <p className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground drop-shadow-lg">
                  <AnimatedCounter end={item.n} suffix={item.s} />
                </p>
                <p className="text-primary-foreground/80 mt-2">{item.l}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Contact <span className="text-gradient-animated">Us</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <a href="https://wa.me/201151121767" target="_blank" rel="noopener noreferrer" className="glass-card-hover p-8 text-center group card-3d cursor-pointer">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Phone className="text-primary-foreground" size={28} />
              </div>
              <h3 className="font-heading font-semibold mb-2">WhatsApp</h3>
              <p className="text-muted-foreground text-sm">01151121767</p>
            </a>
            <a href="https://www.facebook.com/people/Pet-planet-clinic/61551599002613/" target="_blank" rel="noopener noreferrer" className="glass-card-hover p-8 text-center group card-3d cursor-pointer">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Facebook className="text-primary-foreground" size={28} />
              </div>
              <h3 className="font-heading font-semibold mb-2">Facebook</h3>
              <p className="text-muted-foreground text-sm">Pet Planet Clinic</p>
            </a>
            <a href="https://www.google.com/maps/search/?api=1&query=24.062134636139163,32.88546865767205" target="_blank" rel="noopener noreferrer" className="glass-card-hover p-8 text-center group card-3d cursor-pointer">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <MapPin className="text-primary-foreground" size={28} />
              </div>
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
            <span className="font-heading font-bold text-gradient-animated">Pet Planet</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 Pet Planet Veterinary Clinic. All rights reserved.</p>
          <p className="text-muted-foreground text-xs mt-1">Led by Dr. Khaled Nasser</p>
        </div>
      </footer>

      {lightbox && (
        <MediaLightbox
          items={lightbox.items}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
