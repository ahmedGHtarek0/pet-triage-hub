import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Props {
  photos: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function PhotoLightbox({ photos, initialIndex, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);

  const prev = () => setIndex((i) => (i > 0 ? i - 1 : photos.length - 1));
  const next = () => setIndex((i) => (i < photos.length - 1 ? i + 1 : 0));

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-10">
        <X size={28} />
      </button>

      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      <img
        src={photos[index]}
        alt=""
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      />

      {photos.length > 1 && (
        <div className="absolute bottom-6 flex gap-2">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIndex(i); }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === index ? "bg-white scale-125" : "bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
