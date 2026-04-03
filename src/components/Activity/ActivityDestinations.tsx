"use client";

import type { Locale } from "@/types/locale";
import type { DestinationCountry, Destination } from "@/types/destinations";
import type { DestinationActivity } from "@/types/activities";
import { t } from "@/types/activities.utils";
import { useRouter } from "next/navigation";

import ButtonArrow from "@/components/ui/ButtonArrow";
import CardsSlideShow from "@/components/CardsSlideShow";
import ImageGalleryModal from "@/components/ui/Modals/ImageGalleryModal";
import SplitText from "@/components/SplitText";

import { MapPin, Ticket, DollarSign } from "lucide-react";
import { FaGlobe } from "react-icons/fa";
import { useState } from "react";

interface Props {
  locale: Locale;
  regionSlug: string;
  cityName: string;
  countryName: string;
  country: DestinationCountry;
  city: Destination;
  activity: DestinationActivity;
   backHref?: string; 
}

export default function ActivityDestination({
  locale,
  regionSlug,
  cityName,
  countryName,
  country,
  city,
  activity,
   backHref, 
}: Props) {
  const basePath = locale === "es" ? "destinos" : "destinations";
  const [galleryOpen, setGalleryOpen] = useState(false);

  const galleryImages = [
    activity.cover_image,
    ...(activity.photos ?? []),
  ].filter(Boolean) as string[];

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-theme">
      {/* Gallery modal */}
      <ImageGalleryModal
        headless
        images={galleryImages}
        title={activity.name}
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />

      {/* ── HERO ── */}
      <section className="relative h-[80vh] sm:h-[70vh] lg:h-[80vh] flex flex-col justify-end overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          {galleryImages.length > 0 ? (
            <CardsSlideShow
              images={galleryImages}
              interval={5000}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-white/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-20 pt-10">
          {activity.category && (
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="text-[var(--accent)] w-4 h-4" />
              <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
                {activity.category}
              </span>
            </div>
          )}

          <SplitText
            text={activity.name}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 uppercase"
            delay={25}
            duration={0.5}
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="left"
          />

          <p className="text-white/60 text-sm flex items-center gap-1.5 mt-1 mb-2">
            <FaGlobe className="text-[var(--accent)] text-xs" />
            {cityName}, {countryName}
          </p>

          {activity.description && (
            <div className="text-white/80 mt-2 w-full sm:w-80 md:w-140 text-xs sm:text-sm md:text-base md:text-justify [text-shadow:2px_2px_3px_#000000]">
              {activity.description}
            </div>
          )}

          {activity.price !== null && activity.price !== undefined && (
            <p className="text-white/70 text-sm flex items-center gap-1.5 mt-4">
              <DollarSign className="text-[var(--accent)] w-4 h-4" />
              {t(locale, "Desde", "From")} ${activity.price}
            </p>
          )}
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-gradient-theme">
        {/* Section header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]/40" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-theme-tittles">
              {t(locale, "Detalles", "Details")}
            </h2>
          </div>
          <p className="text-[var(--accent)] text-xs tracking-widest uppercase ml-7">
            {t(
              locale,
              `Conoce más sobre ${activity.name}`,
              `Learn more about ${activity.name}`,
            )}
          </p>
        </div>

        {/* Description card */}
        <div className="glass-card border border-white/10 rounded-sm p-6 mb-6">
          <p className="text-[var(--text)]/80 text-sm leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Inclusions */}
        {((activity.included?.length ?? 0) > 0 ||
          (activity.not_included?.length ?? 0) > 0) && (
          <div className="glass-card border border-white/10 rounded-sm p-6 mb-6">
            <h3 className="text-theme-tittles font-bold text-sm uppercase tracking-widest mb-4">
              {t(locale, "Incluye / No incluye", "Includes / Not included")}
            </h3>
            <div className="flex gap-6">
              {(activity.included?.length ?? 0) > 0 && (
                <div className="flex-1">
                  <p className="text-[var(--accent)] text-[0.6rem] uppercase tracking-wider mb-2">
                    {t(locale, "Incluye", "Includes")}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {activity.included!.map((inc, i) => (
                      <span
                        key={i}
                        className="flex items-start gap-1.5 text-[0.8rem] text-[var(--text)]/80"
                      >
                        <span className="text-green-400 mt-0.5 flex-shrink-0">
                          ✓
                        </span>
                        {inc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(activity.not_included?.length ?? 0) > 0 && (
                <div className="flex-1">
                  <p className="text-[var(--accent)] text-[0.6rem] uppercase tracking-wider mb-2">
                    {t(locale, "No incluye", "Not included")}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {activity.not_included!.map((exc, i) => (
                      <span
                        key={i}
                        className="flex items-start gap-1.5 text-[0.8rem] text-[var(--text)]/80"
                      >
                        <span className="text-red-400 mt-0.5 flex-shrink-0">
                          ✗
                        </span>
                        {exc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {activity.notes && (
          <div className="glass-card border border-amber-500/20 rounded-sm p-6 mb-6 flex items-start gap-3">
            <span className="text-amber-500 text-lg flex-shrink-0">⚠</span>
            <p className="text-[var(--text)]/80 text-sm leading-relaxed">
              {activity.notes}
            </p>
          </div>
        )}

        {/* Gallery button */}
        {galleryImages.length > 0 && (
          <button
            onClick={() => setGalleryOpen(true)}
            className="mb-8 text-[var(--accent)] text-xs tracking-widest uppercase border border-[var(--accent)]/40 px-4 py-2 rounded-sm hover:bg-[var(--accent)]/10 transition-colors"
          >
            {t(
              locale,
              `Ver galería (${galleryImages.length} fotos)`,
              `View gallery (${galleryImages.length} photos)`,
            )}
          </button>
        )}

        {/* Separator */}
        <div className="border-t border-theme opacity-45 mb-8" />

        {/* Go back */}
        {/* <ButtonArrow
          href={`/${locale}/${basePath}/${regionSlug}/${country.slug}/${city.slug}`}
          className="mx-auto mt-4 mb-20 animate-pulse"
          title={t(
            locale,
            `Regresar a más actividades de ${cityName}`,
            `Return to more activities in ${cityName}`,
          )}
        /> */}

        <ButtonArrow
          onClick={backHref ? () => router.push(backHref) : () => router.back()}
          className="mx-auto mt-4 mb-20 animate-pulse"
          title={t(
            locale,
            "Regresar a página anterior",
            "Go back to previous page",
          )}
        />
      </div>
    </div>
  );
}
