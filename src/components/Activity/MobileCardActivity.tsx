import { useState, useEffect } from "react";
import type { ActivityCardData } from "@/types/activities";
import CardsSlideShow from "@/components/CardsSlideShow";
import BadgeGlower from "@/components/ui/BadgeGlower";
import BadgeAccent from "@/components/ui/BadgeAccent";
import { TbListDetails } from "react-icons/tb";

import {
  FaStar,
  FaImages,
  FaAngleDown,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { MdOutlineTimer } from "react-icons/md";
import { BsWatch } from "react-icons/bs";
import { PiApproximateEqualsBold, PiWarningCircleBold } from "react-icons/pi";
import { BorderBeam } from "@/components/ui/BorderBeam";

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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-[14px]" />

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
          {/* Included */}
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

          {/* Not included */}
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

        {/* Notes */}
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

/* ─── MOBILE CARD ACTIVITY ────────────────────────────────────────────────── */
export default function MobileCardActivity({
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
      className="relative rounded-[14px] overflow-hidden cursor-pointer"
    >
      {/* ── COLLAPSED ── */}
      {!isActive && (
        <div className="relative flex items-center gap-3.5 px-4 py-3.5 min-h-[4rem] overflow-hidden">
          {opt.cover_image && (
            <>
              <img
                src={opt.cover_image}
                alt={opt.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/55" />
            </>
          )}
          <div className="relative flex-1 min-w-0">
            <span className="font-bold text-[0.9rem] truncate text-white block uppercase">
              {opt.name}
            </span>
          </div>
          <span className="relative flex-shrink-0 text-[1.1rem] text-white">
            <FaAngleDown />
          </span>
        </div>
      )}

      {/* ── EXPANDED ── */}
      {isActive && (
        <div className="relative h-[34rem] rounded-[14px]">
          {/* BG slideshow */}
          {allImages.length > 0 ? (
            <CardsSlideShow
              images={allImages}
              interval={4000}
              className="w-full h-full"
              maxImages={5}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-(--accent)/15 to-[#05080f]" />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-[#05080f]/60 to-transparent" />

          {/* Price — top left */}
          <span className="absolute left-4 top-4 z-10">
            {opt.price != null && (
              <BadgeAccent>
                $ {opt.price} {opt.currency ?? "USD"}
              </BadgeAccent>
            )}
          </span>

          {/* Close chevron */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            aria-label={t(locale, "Cerrar", "Close")}
            className="absolute top-4 right-4 z-20 text-white/60 hover:text-white transition-colors"
          >
            <FaAngleDown className="rotate-180 text-xl" />
          </button>

          {/* Inclusions mini modal */}
          {showInclusions && (
            <InclusionsModal
              opt={opt}
              locale={locale}
              onClose={() => setShowInclusions(false)}
            />
          )}

          {/* Content */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end py-2 px-3">
            <h3 className="text-white font-black mb-2 text-[clamp(1.1rem,2vw,1.6rem)] leading-tight uppercase">
              {opt.name}
            </h3>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {opt.category && (
                <BadgeGlower className="uppercase">
                  <CategoryIcon
                    className="text-(--accent)"
                    category={opt.category}
                  />
                  <span className="ml-2">{opt.category}</span>
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

            {/* Description */}
            {opt.description_sections?.length ? (
              <div className="mb-3.5 flex flex-col gap-2">
                {opt.description_sections.map((section, i) => (
                  <div key={i}>
                    {section.subtitle && (
                      <p className="text-white/90 text-[0.7rem] uppercase tracking-wider mb-1">
                        {section.subtitle}
                      </p>
                    )}
                    <p className="text-white/80 text-[0.8rem] leading-relaxed text-justify">
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
                  <PiApproximateEqualsBold className="inline" /> {opt.duration}
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
                      {Icon && <Icon />} {label ?? opt.activity_mode}
                    </span>
                  );
                })()}
              {opt.recommended_time && (
                <span>
                  <BsWatch className="inline" /> {opt.recommended_time}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
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
        </div>
      )}

      {isActive && (
        <BorderBeam
          duration={6}
          size={300}
          colorFrom="var(--accent)"
          colorTo="#014E7D"
          borderWidth={3}
        />
      )}
    </div>
  );
}