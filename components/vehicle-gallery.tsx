"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Vehicle } from "@/lib/vehicles";
import VehicleImage from "@/components/vehicle-image";
import { IconArrowLeft, IconArrowRight, IconClose, IconExpand } from "@/components/icons";

type Props = {
  images: string[];
  title: string;
  status: Vehicle["status"];
};

const statusLabel: Record<Vehicle["status"], string> = {
  available: "Available",
  reserved: "Reserved",
  "in-transit": "In Transit",
  sold: "Sold",
};

export default function VehicleGallery({ images, title, status }: Props) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const count = images.length;

  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    const onScroll = () => setLightbox(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [lightbox, prev, next]);

  return (
    <div>
      {/* Main image */}
      <div className="group relative aspect-[4/3] overflow-hidden border border-white/[0.06] bg-onyx">
        <VehicleImage
          src={images[index]}
          alt={title}
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
        />
        <span className="absolute top-4 left-4 bg-gold px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-black uppercase">
          {statusLabel[status]}
        </span>
        {count > 0 && (
          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label="Open fullscreen gallery"
            className="absolute right-4 bottom-4 flex items-center gap-2 bg-black/70 px-3.5 py-2 text-[10px] tracking-[0.2em] text-ivory uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <IconExpand size={13} /> Expand
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Photo ${i + 1} of ${title}`}
              className={`relative aspect-[4/3] overflow-hidden border transition-all duration-300 ${i === index
                ? "border-gold ring-1 ring-gold/50"
                : "border-white/[0.06] opacity-60 hover:opacity-100"
                }`}
            >
              <VehicleImage src={src} alt={`${title} photo ${i + 1}`} sizes="12vw" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && count > 0 && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
          onWheel={() => setLightbox(false)}
          onTouchStart={(e) => {
            touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }}
          onTouchEnd={(e) => {
            if (!touchStart.current) return;
            const dx = e.changedTouches[0].clientX - touchStart.current.x;
            const dy = e.changedTouches[0].clientY - touchStart.current.y;
            if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) {
              setLightbox(false); // Vertical swipe -> close
            } else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
              if (dx > 0) prev(); // Right swipe -> prev
              else next();        // Left swipe -> next
            }
            touchStart.current = null;
          }}
        >
          {/* Prominent floating close button */}
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Close gallery"
            className="absolute top-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-black/80 border border-white/20 text-ivory shadow-xl transition-all duration-300 hover:scale-110 hover:border-gold hover:text-gold hover:bg-black"
          >
            <IconClose size={28} />
          </button>

          <div className="absolute top-6 left-6 z-[60] flex items-center justify-center rounded-sm bg-black/60 px-4 py-2 text-sand backdrop-blur-md">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase">
              {index + 1} / {count} | {title}
            </p>
          </div>

          <div className="relative flex-1">
            <VehicleImage src={images[index]} alt={`${title} photo ${index + 1}`} sizes="100vw" className="!object-contain" />
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute top-1/2 left-4 -translate-y-1/2 border border-white/10 bg-black/60 p-3 text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              <IconArrowLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute top-1/2 right-4 -translate-y-1/2 border border-white/10 bg-black/60 p-3 text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              <IconArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
