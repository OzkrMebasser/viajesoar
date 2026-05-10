"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFavorites, type EntityType } from "@/lib/context/FavoritesProvider";
import { supabase } from "@/lib/supabase";
import SplitText from "@/components/SplitText";
import ButtonArrow from "@/components/ui/ButtonArrow";
import FavoriteButton from "@/components/ui/FavoriteButton";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import ParticlesCanvas from "@/components/ui/Particles/ParticlesCanvas";
import CardParticlesCanvas from "@/components/ui/Particles/CardParticlesCanvas";
import CardsSlideShow from "@/components/CardsSlideShow";
import {
  Heart as HeartIcon,
  MapPin,
  Package,
  Activity,
  BookOpen,
  Globe,
  Tag,
} from "lucide-react";
import { MdTravelExplore } from "react-icons/md";
import type { Locale } from "@/types/locale";
import { DestinationCountry, DestinationRegion } from "@/types/destinations";

interface ResolvedFavorite {
  favId: string;
  entityType: EntityType;
  entityId: string;
  name: string;
  images: string[];
  description?: string;
  subtitle?: string;
  href: string;
  badge?: string;
}

// En FavoritesPage.tsx — solo cambia entityConfig

const entityConfig: Record<
  EntityType,
  {
    table: string;
    select: string;
    imageField: string;
    imageFieldFallback?: string;
    nameField: string;
    descriptionField: string;
    subtitleField?: string;
    hrefFn: (locale: Locale, row: any) => string;
    label: string;
    labelEn: string;
    icon: React.ReactNode;
  }
> = {
  destination: {
    table: "destinations",
    select:
      "*, destinations_countries!country_id(slug, destinations_regions!region_id(slug))",
    imageField: "images",
    imageFieldFallback: "image",
    nameField: "name",
    descriptionField: "long_description",
    subtitleField: "country",
    hrefFn: (locale, row) => {
      const basePath = locale === "es" ? "destinos" : "destinations";
      const regionSlug =
        row.destinations_countries?.destinations_regions?.slug ?? "";
      const countrySlug = row.destinations_countries?.slug ?? "";
      return `/${locale}/${basePath}/${regionSlug}/${countrySlug}/${row.slug}`;
    },
    label: "Ciudad",
    labelEn: "City",
    icon: <MapPin className="h-3 w-3" />,
  },

  destination_country: {
    table: "destinations_countries",
    select: "*, destinations_regions!region_id(slug)",
    imageField: "images",
    imageFieldFallback: "image",
    nameField: "name",
    descriptionField: "long_description",
    subtitleField: "country_code",
    hrefFn: (locale, row) => {
      const basePath = locale === "es" ? "destinos" : "destinations";
      const regionSlug = row.destinations_regions?.slug ?? "";
      return `/${locale}/${basePath}/${regionSlug}/${row.slug}`;
    },
    label: "País",
    labelEn: "Country",
    icon: <Globe className="h-3 w-3" />,
  },

  package: {
    table: "packages",
    select: "*",
    imageField: "images",
    nameField: "name",
    descriptionField: "description",
    subtitleField: "duration",
    hrefFn: (locale, row) =>
      `/${locale === "es" ? "es/paquetes" : "en/packages"}/${row.slug}`,
    label: "Paquete",
    labelEn: "Package",
    icon: <Package className="h-3 w-3" />,
  },

  activity: {
    table: "destinations_activities",
    select:
      "*, destinations!destination_id(slug, country_id, destinations_countries!country_id(slug, destinations_regions!region_id(slug)))",
    imageField: "photos",
    imageFieldFallback: "cover_image",
    nameField: "name",
    descriptionField: "description",
    subtitleField: "category",
    hrefFn: (locale, row) => {
      const basePath = locale === "es" ? "destinos" : "destinations";
      const regionSlug =
        row.destinations?.destinations_countries?.destinations_regions?.slug ??
        "";
      const countrySlug = row.destinations?.destinations_countries?.slug ?? "";
      const citySlug = row.destinations?.slug ?? "";
      return `/${locale}/${basePath}/${regionSlug}/${countrySlug}/${citySlug}/${row.slug}`;
    },
    label: "Actividad",
    labelEn: "Activity",
    icon: <Activity className="h-3 w-3" />,
  },

  blog_post: {
    table: "blog_posts",
    select: "*",
    imageField: "cover_image",
    nameField: "title",
    descriptionField: "excerpt",
    subtitleField: "category",
    hrefFn: (locale, row) => `/${locale}/blog/${row.slug}`,
    label: "Blog",
    labelEn: "Blog",
    icon: <BookOpen className="h-3 w-3" />,
  },

  offer: {
    table: "offers",
    select: "*, package:package_id(slug)",
    imageField: "cover_image",
    nameField: "title",
    descriptionField: "description",
    subtitleField: "destination_label",
    hrefFn: (locale, row) => {
      // Si la oferta tiene package con slug, ir al paquete; si no, a la oferta por id
      if (row.package?.slug) {
        return `/${locale === "es" ? "es/paquetes" : "en/packages"}/${row.package.slug}`;
      }
      return `/${locale}/${locale === "es" ? "ofertas" : "offers"}/${row.id}`;
    },
    label: "Oferta",
    labelEn: "Offer",
    icon: <Tag className="h-3 w-3" />,
  },
};
interface Props {
  locale: Locale;
}

const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

export default function FavoritesPage({ locale }: Props) {
  const router = useRouter();
  const { userId, favoritesData, removeFavorite, loading, error } =
    useFavorites();
  const [resolved, setResolved] = useState<ResolvedFavorite[]>([]);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (!favoritesData.length) {
      setResolved([]);
      return;
    }

    const load = async () => {
      setResolving(true);

      const grouped = favoritesData.reduce<Record<string, string[]>>(
        (acc, f) => {
          if (!acc[f.entity_type]) acc[f.entity_type] = [];
          acc[f.entity_type].push(f.entity_id);
          return acc;
        },
        {},
      );

      const results: ResolvedFavorite[] = [];

      for (const [type, ids] of Object.entries(grouped) as [
        EntityType,
        string[],
      ][]) {
        const config = entityConfig[type];
        if (!config) continue;

        const result = await supabase
          .from(config.table)
          .select(config.select)
          .in("id", ids);

        const data = result.data as any[] | null;
        if (!data) continue;

        for (const row of data) {
          const fav = favoritesData.find(
            (f) => f.entity_type === type && f.entity_id === row.id,
          );
          if (!fav) continue;

          // Imagen con fallback
          const rawImage =
            row[config.imageField] ??
            (config.imageFieldFallback
              ? row[config.imageFieldFallback]
              : undefined);

          // Añade este parse
          let parsedImage = rawImage;
          if (typeof rawImage === "string" && rawImage.startsWith("[")) {
            try {
              parsedImage = JSON.parse(rawImage);
            } catch {}
          }

          const images: string[] = Array.isArray(parsedImage)
            ? parsedImage.filter(Boolean)
            : parsedImage
              ? [parsedImage]
              : [];

          const subtitleRaw = config.subtitleField
            ? row[config.subtitleField]
            : undefined;
          const subtitle =
            subtitleRaw && typeof subtitleRaw === "object"
              ? subtitleRaw?.name
              : subtitleRaw;

          results.push({
            favId: fav.id,
            entityType: type,
            entityId: row.id,
            name: row[config.nameField] || "Sin nombre",
            images,
            description: row[config.descriptionField],
            subtitle,
            href: config.hrefFn(locale, row),
            badge: row.internal_pkg_id || row.badge_label || undefined,
          });
        }
      }

      // Mantener orden original de creación
      results.sort((a, b) => {
        const ai = favoritesData.findIndex((f) => f.id === a.favId);
        const bi = favoritesData.findIndex((f) => f.id === b.favId);
        return ai - bi;
      });

      setResolved(results);
      setResolving(false);
    };

    load();
  }, [favoritesData, locale]);

  // ── Sin sesión ──
  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-theme flex items-center justify-center p-4">
        <div className="text-center">
          <HeartIcon className="w-16 h-16 text-[var(--accent)]/30 mx-auto mb-4" />
          <p className="text-lg text-theme mb-4">
            {t(
              locale,
              "Debes iniciar sesión para ver tus favoritos",
              "You must log in to see your favorites",
            )}
          </p>
          <ButtonArrow
            title={t(locale, "Iniciar sesión", "Log in")}
            href={locale === "es" ? "/es/iniciar-sesion" : "/en/login"}
          />
        </div>
      </div>
    );
  }

  // ── Cargando ──
  if (loading || resolving) {
    return (
      <div className="min-h-screen bg-gradient-theme flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)] mx-auto mb-4" />
          <p className="text-theme">
            {t(locale, "Cargando favoritos...", "Loading favorites...")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-theme">
      {/* ── HERO INFO ── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 sm:px-6 pb-0 lg:pb-8 text-white pointer-events-none">
        <SplitText
          text={t(locale, "Mis Favoritos", "My Favorites")}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 uppercase"
          delay={25}
          duration={0.5}
          splitType="chars"
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="left"
        />
        <div className="text-white mt-2 w-full sm:w-80 md:w-140 text-xs sm:text-sm md:text-base [text-shadow:2px_2px_3px_#000000]">
          {resolved.length}{" "}
          {t(
            locale,
            resolved.length === 1 ? "elemento guardado" : "elementos guardados",
            resolved.length === 1 ? "saved item" : "saved items",
          )}
        </div>
      </div>

      {/* ── HERO BAND ── */}
      <div className="relative h-[100dvh] flex flex-col justify-end overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          {resolved[0]?.images[0] ? (
            <img
              src={resolved[0].images[0]}
              alt="hero"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>
      </div>

      <ScrollIndicator targetId="favorites-grid" />

      {/* ── GRID ── */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 py-12 bg-gradient-theme"
        id="favorites-grid"
      >
        {/* Section header */}
        <div className="mb-4 pt-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-theme-tittles">
              {t(locale, "Guardados", "Saved")}
            </h2>
          </div>
          <p className="text-[var(--accent)] text-xs tracking-widest uppercase ml-7">
            {t(
              locale,
              "Tu colección personal de viajes",
              "Your personal travel collection",
            )}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 text-red-400 rounded-sm">
            {error}
          </div>
        )}

        {resolved.length === 0 ? (
          <div className="min-h-[30vh] flex flex-col items-center justify-center gap-4">
            <MdTravelExplore className="text-white/20 text-6xl" />
            <p className="text-white/30 text-sm tracking-widest uppercase">
              {t(locale, "No tienes favoritos aún", "No favorites yet")}
            </p>
            <ButtonArrow
              title={t(locale, "Ver paquetes", "View packages")}
              href={locale === "es" ? "/es/paquetes" : "/en/packages"}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ParticlesCanvas />

            {resolved.map((item) => {
              const config = entityConfig[item.entityType];
              const label = locale === "es" ? config.label : config.labelEn;
              return (
                <article
                  key={item.favId}
                  className="glass-card border border-white/10 rounded-sm overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300 group h-full flex flex-col"
                >
                  {/* Partículas internas */}
                  <div className="absolute inset-0 opacity-90 pointer-events-none">
                    <CardParticlesCanvas />
                  </div>

                  {/* ── Image ── */}
                  <div className="relative h-56 flex-shrink-0">
                    <div className="absolute inset-0 overflow-hidden">
                      {item.images.length > 1 ? (
                        <CardsSlideShow
                          images={item.images}
                          interval={4000}
                          className="w-full h-full"
                        />
                      ) : item.images[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 text-4xl">
                          {config.icon}
                        </div>
                      )}
                    </div>

                    {/* Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />

                    {/* Entity type badge */}
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="flex items-center gap-1 text-[var(--accent)] text-[10px] tracking-[0.25em] uppercase font-semibold border border-white/40 px-2 py-0.5 rounded-sm bg-black/40 backdrop-blur-sm">
                        {config.icon}
                        {label}
                        {item.badge && ` · ${item.badge}`}
                      </span>
                    </div>

                    {/* Favorite button */}
                    <FavoriteButton
                      entityId={item.entityId}
                      entityType={item.entityType}
                      variant="floating"
                      size="md"
                      locale={locale}
                      className="absolute top-3 right-3 z-10"
                    />
                  </div>

                  {/* ── Content ── */}
                  <div className="p-5 flex flex-col flex-1">
                    <SplitText
                      text={item.name}
                      className="font-bold text-lg uppercase leading-tight text-theme-tittles mb-1"
                      delay={25}
                      duration={0.5}
                      splitType="chars"
                      from={{ opacity: 0, y: 20 }}
                      to={{ opacity: 1, y: 0 }}
                      textAlign="left"
                    />

                    {item.subtitle && (
                      <div className="flex items-center gap-1.5 text-[var(--accent)] text-xs uppercase tracking-widest mb-2">
                        <MapPin className="h-3 w-3" />
                        {item.subtitle}
                      </div>
                    )}

                    {item.description && (
                      <p className="text-[var(--text)]/80 text-sm leading-relaxed line-clamp-3 mb-4">
                        {item.description}
                      </p>
                    )}

                    <div className="border-t border-theme opacity-45 mb-4 mt-auto" />

                    <ButtonArrow
                      type="button"
                      href={item.href}
                      title={t(
                        locale,
                        `Ver ${config.label.toLowerCase()}`,
                        `View ${config.labelEn.toLowerCase()}`,
                      )}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
