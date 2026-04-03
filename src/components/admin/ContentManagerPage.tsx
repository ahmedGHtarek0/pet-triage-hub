import { useState } from "react";
import { Globe, Image, Trash2, Plus, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSiteContent, saveSiteContent, type SiteContent } from "@/lib/data";
import { toast } from "sonner";

export default function ContentManagerPage() {
  const [content, setContent] = useState<SiteContent>(getSiteContent());
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "services" | "gallery">("hero");

  const save = (updated: SiteContent) => {
    setContent(updated);
    saveSiteContent(updated);
    toast.success("Content saved");
  };

  const tabs = [
    { id: "hero" as const, label: "Hero Section" },
    { id: "about" as const, label: "About" },
    { id: "services" as const, label: "Services" },
    { id: "gallery" as const, label: "Gallery" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold">Website Content Manager</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your public website content</p>
      </div>

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

      {activeTab === "hero" && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-heading font-semibold">Hero Section</h3>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Title</label>
            <Input
              value={content.hero.title}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Subtitle</label>
            <Input
              value={content.hero.subtitle}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Background Video URL</label>
            <Input
              value={content.hero.videoUrl}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, videoUrl: e.target.value } })}
            />
          </div>
          <Button onClick={() => save(content)}>
            <Save size={16} className="mr-2" /> Save Changes
          </Button>
        </div>
      )}

      {activeTab === "about" && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-heading font-semibold">About Section</h3>
          <div>
            <label className="text-xs font-medium text-muted-foreground">About Text</label>
            <textarea
              value={content.about.text}
              onChange={(e) => setContent({ ...content, about: { ...content.about, text: e.target.value } })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[120px]"
            />
          </div>
          <Button onClick={() => save(content)}>
            <Save size={16} className="mr-2" /> Save Changes
          </Button>
        </div>
      )}

      {activeTab === "services" && (
        <div className="space-y-4">
          {content.services.map((svc, i) => (
            <div key={i} className="glass-card p-6 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-semibold text-sm">Service {i + 1}</h3>
                <button
                  onClick={() => {
                    const services = content.services.filter((_, idx) => idx !== i);
                    save({ ...content, services });
                  }}
                  className="p-1.5 hover:bg-destructive/10 text-destructive rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <Input
                placeholder="Title"
                value={svc.title}
                onChange={(e) => {
                  const services = [...content.services];
                  services[i] = { ...services[i], title: e.target.value };
                  setContent({ ...content, services });
                }}
              />
              <Input
                placeholder="Description"
                value={svc.description}
                onChange={(e) => {
                  const services = [...content.services];
                  services[i] = { ...services[i], description: e.target.value };
                  setContent({ ...content, services });
                }}
              />
              <Input
                placeholder="Icon (Heart, Scissors, Syringe)"
                value={svc.icon}
                onChange={(e) => {
                  const services = [...content.services];
                  services[i] = { ...services[i], icon: e.target.value };
                  setContent({ ...content, services });
                }}
              />
            </div>
          ))}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const services = [...content.services, { title: "", description: "", icon: "Heart", image: "" }];
                setContent({ ...content, services });
              }}
            >
              <Plus size={16} className="mr-2" /> Add Service
            </Button>
            <Button onClick={() => save(content)}>
              <Save size={16} className="mr-2" /> Save All
            </Button>
          </div>
        </div>
      )}

      {activeTab === "gallery" && (
        <div className="space-y-4">
          <div className="flex justify-end gap-3">
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
                  reader.onload = () => {
                    const type = file.type.startsWith("video") ? "video" : "image";
                    const gallery = [...content.gallery, { type: type as "image" | "video", url: reader.result as string }];
                    const updated = { ...content, gallery };
                    save(updated);
                  };
                  reader.readAsDataURL(file);
                });
              };
              input.click();
            }}>
              <Image size={16} className="mr-2" /> Upload Media
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {content.gallery.map((item, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden">
                {item.type === "image" ? (
                  <img src={item.url} alt="" className="w-full h-40 object-cover" />
                ) : (
                  <video src={item.url} className="w-full h-40 object-cover" controls muted />
                )}
                <button
                  onClick={() => {
                    const gallery = content.gallery.filter((_, idx) => idx !== i);
                    save({ ...content, gallery });
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
