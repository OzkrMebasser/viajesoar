"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CardsSlideShow from "@/components/CardsSlideShow";
import SplitText from "@/components/SplitText";
import { FaTimes, FaImages } from "react-icons/fa";

interface ImageGalleryModalProps {
  images: string[];
  title?: string;

  // ── Personalización del botón ──────────────────────────
  /** Texto del botón. Default: "Ver imágenes del tour" */
  buttonLabel?: string;
  /** Clases extra para el botón trigger */
  buttonClassName?: string;
  /** Si true, no renderiza el botón default — tú controlas el trigger */
  headless?: boolean;
  /** Estado externo: open (para modo headless) */
  open?: boolean;
  /** Callback para cerrar (para modo headless) */
  onClose?: () => void;
}

export default function ImageGalleryModal({
  images,
  title,
  buttonLabel = "Ver imágenes del tour",
  buttonClassName,
  headless = false,
  open: externalOpen,
  onClose: externalOnClose,
}: ImageGalleryModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Soporta modo controlado (headless) y no controlado (con botón propio)
  const isOpen = headless ? (externalOpen ?? false) : internalOpen;
  const handleClose = headless
    ? () => externalOnClose?.()
    : () => setInternalOpen(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setActive(0);
      return;
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") setActive((p) => Math.min(p + 1, images.length - 1));
      if (e.key === "ArrowLeft") setActive((p) => Math.max(p - 1, 0));
    };
    window.addEventListener("keydown", handleKey);
    document.documentElement.classList.add("overflow-hidden");
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [isOpen, images.length]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* ── BOTÓN DEFAULT (se oculta en modo headless) ── */}
      {!headless && (
        <button
          onClick={() => setInternalOpen(true)}
          type="button"
          className={
            buttonClassName ??
            `group relative w-fit px-6 py-2 sm:px-8 sm:py-3
            bg-[var(--accent)] text-theme-btn rounded-lg
            transition-all duration-300 flex items-center gap-2
            overflow-hidden isolation-auto
            shadow-[2px_-1px_4px_2px_rgba(0,0,0,0.08)]
            hover:bg-[var(--accent-hover)] hover:scale-105 hover:gap-4
            hover:[box-shadow:0_0_20px_var(--accent),inset_0_0_20px_rgba(255,255,255,0.1)]
            before:content-[''] before:absolute before:top-0 before:left-[-100%]
            before:w-full before:h-full
            before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent
            before:transition-all before:duration-500 hover:before:left-[100%]`
          }
        >
          <FaImages className="w-4 h-4" />
          {buttonLabel}
        </button>
      )}

      {/* ── MODAL ── */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[2147483647] bg-gradient-theme flex flex-col animate-fadeIn"
            onClick={handleClose}
          >
            {/* CLOSE */}
            <button
              onClick={handleClose}
              aria-label="Cerrar galería"
              title="Cerrar galería"
              type="button"
              className="absolute right-4 w-12 h-12 bottom-8 rounded-full p-3 hover:rotate-12 bg-theme-accent text-theme-btn hover:bg-[var(--bg-accent)]/20 hover:text-theme-btn text-theme flex items-center justify-center transition z-50"
            >
              <FaTimes size={18} aria-hidden="true" />
            </button>

            {/* HEADER */}
            <div
              className="text-center py-5 bg-gradient-theme"
              onClick={(e) => e.stopPropagation()}
            >
              <SplitText
                text={title || "Galería del Tour"}
                className="text-lg uppercase leading-tight mb-2 text-[var(--accent)]"
                delay={25}
                duration={0.5}
                splitType="chars"
                from={{ opacity: 0, y: 20 }}
                to={{ opacity: 1, y: 0 }}
                textAlign="center"
              />
              <p className="text-theme text-xs mt-1">
                {active + 1} / <span className="opacity-70">{images.length}</span>
              </p>
            </div>

            {/* IMAGE */}
            <div
              className="flex-1 relative flex items-center justify-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <CardsSlideShow
                images={[images[active]]}
                interval={9999999}
                className="w-full h-full lg:w-1/2"
              />
            </div>

            {/* THUMBNAILS */}
            <div
              className="flex w-full lg:w-1/2 mx-auto gap-3 overflow-x-auto px-6 py-4 border-t border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, i) => (
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
        )}
    </>
  );
}