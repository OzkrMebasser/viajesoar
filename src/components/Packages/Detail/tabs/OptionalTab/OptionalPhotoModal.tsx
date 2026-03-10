"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CardsSlideShow from "@/components/CardsSlideShow";
import SplitText from "@/components/SplitText";
import OptionalGalleryButton from "./OptionalGalleryButton";
import { FaTimes, FaImages } from "react-icons/fa";
import type { OptionalActivity } from "@/types/activities";

interface PhotoModalProps {
  activity: OptionalActivity;
  onClose: () => void;
}

export function OptionalPhotoModal({ activity, onClose }: PhotoModalProps) {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  const allImages = [
    activity.cover_image,
    ...(activity.photos ?? []),
  ].filter(Boolean) as string[];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setActive(p => Math.min(p + 1, allImages.length - 1));
      if (e.key === "ArrowLeft") setActive(p => Math.max(p - 1, 0));
    };
    window.addEventListener("keydown", handleKey);
    document.documentElement.classList.add("overflow-hidden");
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [onClose, allImages.length]);

  if (!mounted || allImages.length === 0) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647] bg-gradient-theme flex flex-col animate-fadeIn"
      onClick={onClose}
    >
      {/* ❌ Close */}
      <button
        onClick={onClose}
        aria-label="Cerrar galería"
        type="button"
        className="absolute right-4 w-12 h-12 bottom-8 rounded-full p-3 hover:rotate-12 bg-theme-accent text-theme-btn hover:bg-[var(--bg-accent)]/20 hover:text-theme-btn text-theme flex items-center justify-center transition z-50"
      >
        <FaTimes size={18} aria-hidden="true" />
      </button>

      {/* Header */}
      <div className="text-center py-5 bg-gradient-theme" onClick={e => e.stopPropagation()}>
        <SplitText
          text={activity.name}
          className="text-lg uppercase leading-tight mb-2 text-[var(--accent)]"
          delay={25}
          duration={0.5}
          splitType="chars"
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="center"
        />
        <p className="text-theme text-xs mt-1">
          {active + 1} / <span className="opacity-70">{allImages.length}</span>
        </p>
      </div>

      {/* Image */}
      <div
        className="flex-1 relative flex items-center justify-center px-4"
        onClick={e => e.stopPropagation()}
      >
        <CardsSlideShow
          images={[allImages[active]]}
          interval={9999999}
          className="w-full h-full lg:w-1/2"
        />
      </div>

      {/* Thumbnails */}
      <div
        className="flex w-full lg:w-1/2 mx-auto gap-3 overflow-x-auto px-6 py-4 border-t border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {allImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            type="button"
            title={`Ver imagen ${i + 1}`}
            aria-label={`Ver imagen ${i + 1}`}
            className={`relative flex-shrink-0 w-24 h-16 rounded-md overflow-hidden border transition-all duration-300 ${
              active === i
                ? "border-[var(--accent)] scale-105 opacity-100"
                : "border-white/20 opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={img}
              alt={`Vista previa ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}

// ── Botón que abre el modal ───────────────────────────────────────────────────
