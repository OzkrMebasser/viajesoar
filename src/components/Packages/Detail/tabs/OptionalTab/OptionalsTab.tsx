"use client";

import { useState, useRef, useEffect } from "react";
import type { OptionalActivity } from "@/types/activities";
import ImageGalleryModal from "@/components/ui/Modals/ImageGalleryModal";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import DesktopCard from "./TourCards/DesktopCard";
// import MobileCard from "./TourCards/MobileCard";
// import { t, type Locale } from "./OptionalsTab.utils";
import DesktopCardActivity from "@/components/Activity/DesktopCardActivity";
import MobileCardActivity from "@/components/Activity/MobileCardActivity";
import { t, type Locale } from "@/types/activities.utils";

/* ─── MAIN ────────────────────────────────────────────────────────────────── */
interface Props {
  locale: Locale;
  optionals: OptionalActivity[];
  packageSlug: string;
}

export default function OptionalsTab({
  locale,
  optionals,
  packageSlug,
}: Props) {

const basePath = locale === "es" ? "paquetes" : "packages";
const activitiesPath = locale === "es" ? "actividades" : "activities"; 
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [galleryActivity, setGalleryActivity] =
    useState<OptionalActivity | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchX = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[active] as HTMLElement | undefined;
    if (!card) return;
    const center = track.clientWidth / 2;
    track.scrollTo({
      left: card.offsetLeft + card.clientWidth / 2 - center,
      behavior: "smooth",
    });
  }, [active, isMobile]);

  useEffect(() => {
    if (galleryActivity) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight")
        setActive((p) => Math.min(p + 1, optionals.length - 1));
      if (e.key === "ArrowLeft") setActive((p) => Math.max(p - 1, 0));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [galleryActivity, optionals.length]);

  const go = (dir: number) =>
    setActive((p) => Math.min(Math.max(p + dir, 0), optionals.length - 1));

  /* ── Empty state ── */
  if (optionals.length === 0) {
    return (
      <div>
        <h2 className="text-2xl sm:text-4xl font-bold text-theme-tittles uppercase mb-2">
          {t(locale, "Tours Opcionales", "Optional Tours")}
        </h2>
        <p className="text-[var(--text)]/60 text-sm mb-8">
          {t(
            locale,
            "Enriquece tu viaje con estas experiencias únicas.",
            "Enrich your trip with these unique experiences.",
          )}
        </p>
        <div className="rounded-xl p-12 text-center bg-white/[0.03] border border-white/[0.07]">
          <p className="text-white/30 text-[0.85rem]">
            {t(
              locale,
              "Opcionales disponibles próximamente",
              "Optional tours coming soon",
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/*
        CSS vars para el slider horizontal — Tailwind no soporta valores
        dinámicos arbitrarios en flex-basis, así que necesitamos estas dos líneas.
        Todo lo demás es Tailwind puro.
      */}
      <style>{`
        .opt-track { --card-closed: 5rem; --card-open: 28rem; }
        @media (max-width: 640px) { .opt-track { --card-closed: 3.5rem; --card-open: 20rem; } }
      `}</style>

      {/* Gallery modal (headless) */}
      <ImageGalleryModal
        headless
        images={
          galleryActivity
            ? ([
                galleryActivity.cover_image,
                ...(galleryActivity.photos ?? []),
              ].filter(Boolean) as string[])
            : []
        }
        title={galleryActivity?.name}
        open={!!galleryActivity}
        onClose={() => setGalleryActivity(null)}
      />

      {/* ── Header ── */}
      <div className="flex items-end justify-between flex-wrap gap-4 mb-7">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold text-theme-tittles uppercase mb-2">
            {t(locale, "Tours Opcionales", "Optional Tours")}
          </h2>
          <p className="text-[var(--text)]/60 text-sm">
            {t(
              locale,
              "Enriquece tu viaje con estas experiencias únicas.",
              "Enrich your trip with these unique experiences.",
            )}
          </p>
        </div>

        {/* Nav arrows — desktop only */}
        {!isMobile && optionals.length > 1 && (
          <div className="flex gap-2">
            {([-1, 1] as const).map((dir) => {
              const disabled =
                dir === -1 ? active === 0 : active === optionals.length - 1;
              return (
                <button
                  key={dir}
                  onClick={() => go(dir)}
                  disabled={disabled}
                  className={`
    w-10 h-10 rounded-full flex items-center justify-center
    border border-[var(--border)] bg-white/[0.06] text-[var(--text)]
    text-xl cursor-pointer
    hover:bg-[var(--accent)] hover:text-white hover:border-transparent
    transition-[background,color,border] duration-200
    ${disabled ? "opacity-20 cursor-not-allowed" : "opacity-100"}
  `}
                >
                  {dir === -1 ? (
                    <FaChevronLeft size={14} />
                  ) : (
                    <FaChevronRight size={14} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Desktop slider ── */}
      {!isMobile && (
        <>
          <div
            ref={trackRef}
            className="opt-track flex gap-3 overflow-x-hidden pb-2"
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 60) go(dx > 0 ? -1 : 1);
            }}
          >
            {optionals.map((opt, i) => (
              <DesktopCardActivity
                key={opt.id}
                opt={{
                  ...opt,
               href: `/${locale}/${basePath}/${packageSlug}/${activitiesPath}/${opt.slug}`,
                }}
                isActive={active === i}
                onClick={() => setActive(i)}
                onOpenGallery={() => setGalleryActivity(opt)}
                locale={locale}
              />
            ))}
          </div>

          {/* Dot indicators */}
          {optionals.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-6">
              {optionals.map((_, i) => (
                <button
                  title="dot indicator"
                  key={i}
                  onClick={() => setActive(i)}
                  className={`
                    h-[6px]  border-none cursor-pointer p-0
                    transition-[width,background] duration-300
                    ${active === i ? "w-8 bg-[var(--accent)]" : "w-[6px] bg-gray-500/15"}
                  `}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Mobile accordion ── */}
      {isMobile && (
        <div className="flex flex-col gap-2.5">
          {optionals.map((opt, i) => (
            <MobileCardActivity
              key={opt.id}
              opt={{
                ...opt,
              href: `/${locale}/${basePath}/${packageSlug}/${activitiesPath}/${opt.slug}`,
              }}
              isActive={active === i}
              onClick={() => setActive(active === i ? -1 : i)}
              onOpenGallery={() => setGalleryActivity(opt)}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
