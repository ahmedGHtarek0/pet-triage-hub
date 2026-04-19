import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from "lucide-react";

export interface MediaItem {
  type: "image" | "video";
  url: string;
  alt?: string;
}

interface Props {
  items: MediaItem[];
  initialIndex?: number;
  onClose: () => void;
}

export default function MediaLightbox({ items, initialIndex = 0, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  const prev = useCallback(() => {
    setZoom(1);
    setIndex((i) => (i > 0 ? i - 1 : items.length - 1));
  }, [items.length]);

  const next = useCallback(() => {
    setZoom(1);
    setIndex((i) => (i < items.length - 1 ? i + 1 : 0));
  }, [items.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  const current = items[index];
  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/95 backdrop-blur-2xl animate-fade-in"
      onClick={onClose}
    >
      {/* Animated blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-blob pointer-events-none" style={{ animationDelay: "2s" }} />

      {/* Top toolbar */}
      <div
        className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-foreground/60 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-background/90 font-heading font-semibold text-sm">
          {index + 1} / {items.length}
        </div>
        <div className="flex items-center gap-2">
          {current.type === "image" && (
            <>
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                className="p-2 rounded-full bg-background/10 text-background hover:bg-background/20 hover:scale-110 transition-all"
                aria-label="Zoom out"
              >
                <ZoomOut size={20} />
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                className="p-2 rounded-full bg-background/10 text-background hover:bg-background/20 hover:scale-110 transition-all"
                aria-label="Zoom in"
              >
                <ZoomIn size={20} />
              </button>
              <a
                href={current.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full bg-background/10 text-background hover:bg-background/20 hover:scale-110 transition-all"
                aria-label="Download"
              >
                <Download size={20} />
              </a>
            </>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-background/10 text-background hover:bg-destructive hover:scale-110 transition-all"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Nav */}
      {items.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 md:left-8 z-10 p-3 rounded-full bg-background/10 text-background hover:bg-primary hover:scale-110 active:scale-95 transition-all shadow-2xl"
            aria-label="Previous"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 md:right-8 z-10 p-3 rounded-full bg-background/10 text-background hover:bg-primary hover:scale-110 active:scale-95 transition-all shadow-2xl"
            aria-label="Next"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Content */}
      <div
        key={index}
        className="relative max-w-[92vw] max-h-[80vh] flex items-center justify-center animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {current.type === "image" ? (
          <img
            src={current.url}
            alt={current.alt || ""}
            style={{ transform: `scale(${zoom})` }}
            className="max-w-[92vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl transition-transform duration-300"
          />
        ) : (
          <video
            src={current.url}
            controls
            autoPlay
            className="max-w-[92vw] max-h-[80vh] rounded-2xl shadow-2xl"
          />
        )}
      </div>

      {/* Thumbnails */}
      {items.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto scrollbar-hide p-2 rounded-2xl bg-background/10 backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((it, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); setZoom(1); }}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === index ? "border-primary scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {it.type === "image" ? (
                <img src={it.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-foreground flex items-center justify-center text-background text-xs">▶</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
