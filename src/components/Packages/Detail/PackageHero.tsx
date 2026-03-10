import CardsSlideShow from "@/components/CardsSlideShow";
import ButtonGlower from "@/components/ui/ButtonGlower";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import PackagesImagesModal from "@/components/Packages/Detail/PackagesImagesModal";
import ImageGalleryModal from "./ImageGalleryModal";
import SplitText from "@/components/SplitText";
import { FaPlane, FaMoon, FaSun } from "react-icons/fa";
import type { PackageDetail } from "@/types/packages";

type Locale = "es" | "en";
const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

type HeroPkg = Pick<
  PackageDetail,
  | "name"
  | "internal_pkg_id"
  | "home_carousel_images"
  | "images"
  | "description"
  | "days"
  | "nights"
  | "includes_flight"
  | "price_from"
  | "currency"
  | "taxes"
>;

interface Props {
  pkg: HeroPkg;
  locale: Locale;
  onCotizar?: () => void;
}

export default function PackageHero({ pkg, locale, onCotizar }: Props) {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] lg:min-h-screen flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CardsSlideShow
            images={pkg.home_carousel_images || pkg.images || []}
            interval={5000}
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>

        <div className="absolute inset-0 z-[1]">
          <ParticlesCanvas />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-12 pt-32">
          <SplitText
            text={pkg.name}
            className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 uppercase "
            delay={25}
            duration={0.5}
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="left"
          />

          <div className="flex items-center gap-2">
            <span className="text-[var(--accent)] bg-white/6 backdrop-blur-md border border-[var(--border)]/40 text-xs tracking-[0.25em] uppercase font-semibold px-3 py-1 rounded-sm">
              {pkg.internal_pkg_id ?? "VS-0000"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-8 mt-2">
            {pkg.days && (
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <FaSun className="text-[var(--accent)]" />
                <span>
                  <strong className="text-white">{pkg.days}</strong>{" "}
                  {t(locale, "días", "days")}
                </span>
              </div>
            )}
            {pkg.days && pkg.nights && (
              <span className="text-[var(--accent)]/70">|</span>
            )}
            {pkg.nights && (
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <FaMoon className="text-[var(--accent)]" />
                <span>
                  <strong className="text-white">{pkg.nights}</strong>{" "}
                  {t(locale, "noches", "nights")}
                </span>
              </div>
            )}
            {pkg.includes_flight && (
              <>
                <span className="text-[var(--accent)]/70">|</span>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <FaPlane className="text-[var(--accent)]" />
                  <span>{t(locale, "Vuelo incluido", "Flight included")}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-end gap-6">
            <div className="bg-white/6 backdrop-blur-md border border-[var(--border)]/40 rounded-sm px-6 py-4">
              <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-1">
                {t(locale, "Desde", "From")}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-[var(--accent)] font-bold text-4xl">
                  ${Number(pkg.price_from).toLocaleString()}
                </span>
                <span className="text-white/50 text-sm">{pkg.currency}</span>
              </div>
              {pkg.taxes && (
                <p className="text-white/40 text-xs mt-1">
                  + ${Number(pkg.taxes).toLocaleString()}{" "}
                  {t(locale, "impuestos aéreos", "air taxes")}
                </p>
              )}
            </div>
            <ButtonGlower onClick={onCotizar}>
              {t(locale, "Cotizar ahora", "Get a quote")}
            </ButtonGlower>
          </div>
        </div>
      </section>

      {/* ── DESCRIPTION BAND ── */}
      <div className="bg-white/5 border-y border-[var(--border)]/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-12 flex flex-wrap gap-4 items-center justify-between">
          <p className="text-[var(--accent)] text-sm sm:text-base leading-relaxed max-w-3xl">
            {pkg.description}
          </p>
          {/* <PackagesImagesModal
            images={pkg.home_carousel_images || []}
            title={pkg.name}
          /> */}
          <ImageGalleryModal images={pkg.home_carousel_images || []}
            title={pkg.name} />
        </div>
      </div>
    </>
  );
}