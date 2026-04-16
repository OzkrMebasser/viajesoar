"use client";

import type { Locale } from "@/types/locale";
import type { DestinationCountry, Destination } from "@/types/destinations";
import SimilarTours from "@/components/Activity/Tours/SimilarTours";
import type { DestinationActivity } from "@/types/activities";
import { t } from "@/types/activities.utils";
import { useRouter } from "next/navigation";
import { IoTicket } from "react-icons/io5";
import ButtonAccent from "@/components/ui/ButtonAccent";
import BadgeAccent from "@/components/ui/BadgeAccent";
import ButtonArrow from "@/components/ui/ButtonArrow";
import CardsSlideShow from "@/components/CardsSlideShow";
import ImageGalleryModal from "@/components/ui/Modals/ImageGalleryModal";
import SplitText from "@/components/SplitText";
import { FaImages } from "react-icons/fa";
import { RiArrowGoBackFill } from "react-icons/ri";

import { MapPin, Ticket, DollarSign } from "lucide-react";
import { FaGlobe } from "react-icons/fa";
import { useState } from "react";

interface Props {
  locale: Locale;
  regionSlug: string;
  cityName: string;
  countryName: string;
  country?: DestinationCountry | null; // ← opcional
  city?: Destination | null;
  activity: DestinationActivity;
  backHref?: string;
  similarTours?: DestinationActivity[];
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
  similarTours,
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
      <section className="relative h-[70vh] sm:h-[60vh] lg:h-[80vh] flex flex-col justify-end overflow-hidden text-white">
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

        {/*Titulo de la excursion*/}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 h-80 lg:h-full pb-16 lg:pt-28">
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
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 uppercase "
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

          {/* {activity.description && (
            <div className="text-white/80 mt-2 w-full sm:w-80 md:w-140 text-xs sm:text-sm md:text-base md:text-justify [text-shadow:2px_2px_3px_#000000]">
              {activity.description}
            </div>
          )} */}

          {activity.price !== null && activity.price !== undefined && (
            <p className="text-white/70 text-sm flex items-center gap-1.5 mt-4">
              {t(locale, "Desde", "From")}
              {/* {t(locale, "Desde", "From")} ${activity.price} */}
              <BadgeAccent>$ {activity.price} USD</BadgeAccent>
            </p>
          )}
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-re">
        {/* Section header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]/40" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-theme-tittles">
              {t(locale, "Detalles", "Details")}
            </h2>
          </div>
          <p className=" text-[var(--accent)] text-xs tracking-widest uppercase ml-7">
            {t(
              locale,
              `Conoce más sobre ${activity.name}`,
              `Learn more about ${activity.name}`,
            )}
          </p>
        </div>

        {/* Description card */}
        <div className="mb-4 bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 hover:border-[var(--accent)]/20 transition-colors">
          <p className="text-[var(--text)]/80 text-sm leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Inclusions */}
        {((activity.included?.length ?? 0) > 0 ||
          (activity.not_included?.length ?? 0) > 0) && (
          <div className="mb-4 bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 hover:border-[var(--accent)]/20 transition-colors">
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
          <div className="mb-4 bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 hover:border-[var(--accent)]/20 transition-colors">
            <span className="text-amber-500 text-lg flex-shrink-0">⚠</span>
            <p className="text-[var(--text)]/80 text-sm leading-relaxed">
              {activity.notes}
            </p>
          </div>
        )}

        <div className="flex columns-3 flex-wrap">
          {/* Gallery button */}
          {galleryImages.length > 0 && (
            <ButtonAccent
              onClick={() => setGalleryOpen(true)}
              className="mx-auto mt-4 mb-8 "
              title={t(
                locale,
                `Ver galería (${galleryImages.length} fotos)`,
                `View gallery (${galleryImages.length} photos)`,
              )}
              icon={FaImages}
            />
          )}{" "}
          {/* Go back */}
          <ButtonAccent
            // onClick={backHref ? () => router.push(backHref) : () => router.back()}
            className="mx-auto mt-4 mb-8 "
            title={t(locale, "Comprar esta actividad", "Buy this activity")}
            icon={IoTicket}
          />
          <ButtonAccent
            onClick={
              backHref ? () => router.push(backHref) : () => router.back()
            }
            className="mx-auto mt-4 mb-8 animate-pulse"
            title={t(
              locale,
              "Regresar a página anterior",
              "Go back to previous page",
            )}
            icon={RiArrowGoBackFill}
          />
        </div>
        {/* Separator */}
        <div className="border-t border-theme opacity-45 " />
        {similarTours && similarTours.length > 0 && (
          <SimilarTours
            tours={similarTours}
            locale={locale}
            cityName={cityName}
          />
        )}
      </div>
    </div>
  );
}
