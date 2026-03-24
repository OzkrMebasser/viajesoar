import { useState, useEffect } from "react";
import type { ActivityCardData } from "@/types/activities";
import CardsSlideShow from "@/components/CardsSlideShow";
import BadgeGlower from "@/components/ui/BadgeGlower";
import BadgeAccent from "@/components/ui/BadgeAccent";
import { FaStar, FaImages, FaTimes, FaCheck } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";

import { MdOutlineTimer } from "react-icons/md";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { PiApproximateEqualsBold, PiWarningCircleBold } from "react-icons/pi";
import { BsWatch } from "react-icons/bs";

// import {
//   t,
//   DIFFICULTY_COLOR,
//   DIFFICULTY_LABEL,
//   CategoryIcon,
//   ACTIVITY_MODE_ICON,
//   ACTIVITY_MODE_LABEL,
//   type Locale,
//   type Difficulty,
//   type ActivityMode,
// } from "../OptionalsTab.utils";

import { t, DIFFICULTY_COLOR, DIFFICULTY_LABEL, CategoryIcon,
         ACTIVITY_MODE_ICON, ACTIVITY_MODE_LABEL } from "@/types/activities.utils";
import type { Locale, Difficulty, ActivityMode } from "@/types/activities.utils";

/* ─── INCLUSIONS MINI MODAL ───────────────────────────────────────────────── */
function InclusionsModal({
  opt,
  locale,
  onClose,
}: {
  opt: ActivityCardData;
  locale: Locale;
  onClose: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl" />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm bg-gradient-theme border border-white/10 rounded-2xl p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label={t(locale, "Cerrar", "Close")}
          className="absolute top-3 right-3 text-theme hover:text-(--text)/80 transition-colors"
        >
          <FaTimes />
        </button>

        <h4 className="text-theme font-bold text-[0.85rem] uppercase tracking-wider mb-4">
          {t(locale, "Detalles", "Details")}
        </h4>

        <div className="flex gap-4 mb-4">
          {(opt.included?.length ?? 0) > 0 && (
            <div className="flex-1">
              <p className="text-(--text)/80 text-[0.6rem] uppercase tracking-wider mb-2">
                {t(locale, "Incluye", "Includes")}
              </p>
              <div className="flex flex-col gap-1.5">
                {opt.included!.map((inc, i) => (
                  <span
                    key={i}
                    className="flex items-start gap-1.5 text-[0.72rem] text-(--text)/90 "
                  >
                    <FaCheck className="flex-shrink-0 mt-0.5 text-[0.6rem] text-green-400" />
                    {inc}
                  </span>
                ))}
              </div>
            </div>
          )}
          {(opt.not_included?.length ?? 0) > 0 && (
            <div className="flex-1">
              <p className="text-(--text)/80 text-[0.6rem] uppercase tracking-wider mb-2">
                {t(locale, "No incluye", "Not included")}
              </p>
              <div className="flex flex-col gap-1.5">
                {opt.not_included!.map((exc, i) => (
                  <span
                    key={i}
                    className="flex items-start gap-1.5 text-[0.72rem] text-(--text)/90 "
                  >
                    <FaTimes className="flex-shrink-0 mt-0.5 text-[0.6rem] text-red-500" />
                    {exc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {opt.notes && (
          <div className="flex items-start gap-1.5 ">
            <PiWarningCircleBold className="text-amber-500 flex-shrink-0 mt-0.5 text-sm" />
            <p className="text-(--text) text-[0.68rem] leading-snug ">
              {opt.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── DESKTOP CARD ACTIVITY ───────────────────────────────────────────────── */
export default function DesktopCardActivity({
  opt,
  isActive,
  onClick,
  onOpenGallery,
  locale,
}: {
  opt: ActivityCardData;
  isActive: boolean;
  onClick: () => void;
  onOpenGallery: () => void;
  locale: Locale;
}) {
  const [showInclusions, setShowInclusions] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setShowInclusions(false);
    }
  }, [isActive]);

  const allImages = [opt.cover_image, ...(opt.photos ?? [])].filter(
    Boolean,
  ) as string[];
  const diff = opt.difficulty_level?.toLowerCase() as Difficulty | undefined;

  const hasInclusions =
    (opt.included?.length ?? 0) > 0 ||
    (opt.not_included?.length ?? 0) > 0 ||
    !!opt.notes;

  return (
    <div
      onClick={onClick}
      onMouseEnter={onClick}
      className={`
        relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer
        transition-[flex-basis,transform,box-shadow] duration-500 h-[28rem]
        ${isActive ? "[flex-basis:var(--card-open)]" : "translate-y-0 shadow-none [flex-basis:var(--card-closed)]"}
      `}
    >
      {/* BG image */}
      {isActive ? (
        allImages.length > 0 ? (
          <CardsSlideShow
            images={allImages}
            interval={4000}
            className="w-full h-full"
            maxImages={5}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-(--accent)/15 to-[#05080f]" />
        )
      ) : opt.cover_image ? (
        <img
          src={opt.cover_image}
          alt={opt.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-(--accent)/15 to-[#05080f]" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/[0.60] via-[#05080f]/40 to-transparent" />

      {/* — Collapsed state — */}
      <div
        className={`
          absolute inset-0 z-10 flex flex-col items-center justify-center gap-2
          transition-opacity duration-200
          ${isActive ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        <span
          className="text-white/85 font-bold text-[0.78rem] tracking-[0.18em] uppercase text-center"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {opt.name}
        </span>
      </div>

      {/* — Expanded state — */}
      <div
        className={`
          absolute inset-0 z-10 flex flex-col justify-end p-7
          transition-[opacity,transform] duration-[350ms] delay-[80ms]
          ${isActive ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}
        `}
      >
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {opt.category && (
            <BadgeGlower className="uppercase">
              <CategoryIcon
                className="text-(--accent)"
                category={opt.category}
              />
              <span className="ml-2"> {opt.category}</span>
            </BadgeGlower>
          )}
          {diff && (
            <BadgeGlower className="uppercase flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 ${DIFFICULTY_COLOR[diff]}`} />
              {DIFFICULTY_LABEL[diff]?.[locale as "es" | "en"]}
            </BadgeGlower>
          )}
          {opt.is_featured && (
            <BadgeGlower className="uppercase flex items-center gap-1.5">
              <FaStar className="text-amber-300" />{" "}
              {t(locale, "Destacado", "Featured")}
            </BadgeGlower>
          )}
        </div>

        <h3 className="text-white font-black mb-2 text-[clamp(1.1rem,2vw,1.6rem)] leading-tight uppercase">
          {opt.name}
        </h3>

        {/* Description */}
        {opt.description_sections?.length ? (
          <div className="mb-3.5 flex flex-col gap-2">
            {opt.description_sections.map((section, i) => (
              <div key={i}>
                {section.subtitle && (
                  <p className="text-white/50 text-[0.7rem] uppercase tracking-wider mb-0.5">
                    {section.subtitle}
                  </p>
                )}
                <p className="text-white/80 text-[0.8rem] leading-relaxed">
                  {section.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/80 text-[0.8rem] leading-relaxed mb-3.5">
            {opt.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-white/50">
          {opt.duration && (
            <span>
              <MdOutlineTimer className="inline" />{" "}
              <PiApproximateEqualsBold className="inline" /> {opt.duration}{" "}
            </span>
          )}
          {opt.activity_mode &&
            (() => {
              const Icon =
                ACTIVITY_MODE_ICON[opt.activity_mode as ActivityMode];
              const label =
                ACTIVITY_MODE_LABEL[opt.activity_mode as ActivityMode]?.[
                  locale as "es" | "en"
                ];
              return (
                <span className="flex items-center gap-1">
                  · {Icon && <Icon />} {label ?? opt.activity_mode}
                </span>
              );
            })()}
          {opt.recommended_time && (
            <span>
              · <BsWatch className="inline" /> {opt.recommended_time}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {opt.price != null && <BadgeAccent>$ {opt.price} USD</BadgeAccent>}
          {allImages.length > 0 && (
            <BadgeGlower
              onClick={(e) => {
                e.stopPropagation();
                onOpenGallery();
              }}
              className="uppercase flex items-center gap-1.5"
            >
              {t(locale, "Ver fotos", "View photos")}{" "}
              <FaImages className="w-4 h-4" />
            </BadgeGlower>
          )}
          {hasInclusions && (
            <BadgeGlower
              onClick={(e) => {
                e.stopPropagation();
                setShowInclusions(true);
              }}
              className="uppercase flex items-center gap-1.5"
            >
              {t(locale, "Más detalles", "More details")}{" "}
              <TbListDetails className="text-white text-[1rem]" />
            </BadgeGlower>
          )}
        </div>
      </div>

      {/* Inclusions mini modal */}
      {showInclusions && (
        <InclusionsModal
          opt={opt}
          locale={locale}
          onClose={() => setShowInclusions(false)}
        />
      )}

      {/* Border beam */}
      {isActive && (
        <BorderBeam
          duration={6}
          size={400}
          colorFrom="var(--accent)"
          colorTo="#014E7D"
          borderWidth={3.5}
        />
      )}
    </div>
  );
}