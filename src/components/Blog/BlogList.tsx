"use client";

import { useState, useMemo } from "react";
import type { Locale } from "@/types/locale";
import type { BlogPost } from "@/types/blog";
import { Paginator } from "@/components/ui/paginator";
import CardsSlideShow from "@/components/CardsSlideShow";
import ButtonArrow from "@/components/ui/ButtonArrow";
import SplitText from "@/components/SplitText";
import ParticlesCanvas from "@/components/ui/Particles/ParticlesCanvas";
import CardParticlesCanvas from "@/components/ui/Particles/CardParticlesCanvas";
import {
  FaSearch,
  FaTimes,
  FaTag,
  FaUser,
  FaCalendarAlt,
  FaBookOpen,
} from "react-icons/fa";
import { MdTravelExplore } from "react-icons/md";

interface Props {
  locale: Locale;
  data: BlogPost[];
  page: number;
  totalPages: number;
  total: number;
}

const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

const normalize = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function formatDate(dateStr: string, locale: Locale) {
  return new Date(dateStr).toLocaleDateString(
    locale === "es" ? "es-MX" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
}

// Extrae categorías únicas del listado
function getCategories(posts: BlogPost[]): string[] {
  const cats = posts
    .map((p) => p.category)
    .filter((c): c is string => Boolean(c));
  return Array.from(new Set(cats));
}

export default function BlogList({
  locale,
  data,
  page,
  totalPages,
  total,
}: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => getCategories(data), [data]);

  const filtered = useMemo(() => {
    let list = data;
    if (activeCategory) {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (query.trim()) {
      const q = normalize(query);
      list = list.filter(
        (p) =>
          normalize(p.title).includes(q) ||
          normalize(p.excerpt ?? "").includes(q) ||
          normalize(p.category ?? "").includes(q) ||
          p.tags?.some((tag) => normalize(tag).includes(q)),
      );
    }
    return list;
  }, [query, activeCategory, data]);

  const heroImage =
    data.find((p) => p.is_featured && p.cover_image)?.cover_image ??
    data.find((p) => p.cover_image)?.cover_image ??
    null;

  const blogPath = locale === "es" ? "blog" : "blog";

  return (
    <div className="min-h-screen bg-gradient-theme">
      {/* ── HERO ── */}
      <section className="relative h-[80vh] sm:h-[70vh] lg:h-[80vh] flex flex-col justify-end overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          {heroImage ? (
            <img
              src={heroImage}
              alt="blog hero"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-20 pt-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <FaBookOpen className="text-[var(--accent)] w-4 h-4" />
            <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
              {t(locale, "Blog de Viajes", "Travel Blog")}
            </span>
          </div>

          <SplitText
            text={t(locale, "Historias del Mundo", "Stories from the World")}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 uppercase"
            delay={25}
            duration={0.5}
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="left"
          />

          <p className="text-white/70 mt-2 max-w-md text-xs sm:text-sm [text-shadow:2px_2px_3px_#000000]">
            {t(
              locale,
              `${total} artículos de viaje, guías, tips y cultura para inspirar tu próxima aventura.`,
              `${total} travel articles, guides, tips and culture to inspire your next adventure.`,
            )}
          </p>
        </div>
      </section>

      {/* ── SEARCH + CATEGORÍAS ── */}
      <div className="bg-gradient-theme py-5 sticky top-0 z-30 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search */}
          <div className="relative max-w-xs w-full">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] text-sm pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(locale, "Buscar artículo...", "Search article...")}
              className="w-full text-[var(--accent)] border border-[var(--accent)] focus:border-[var(--accent)]/60 rounded-sm pl-10 pr-10 py-2.5 text-sm outline-none transition-colors duration-200 bg-transparent"
            />
            {query && (
              <button
                title="Clear search"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--accent)] hover:text-white/60 transition-colors"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>

          {/* Category pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-sm border transition-all duration-200 ${
                  activeCategory === null
                    ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-white/20 text-[var(--text)]/50 hover:border-[var(--accent)]/40"
                }`}
              >
                {t(locale, "Todos", "All")}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setActiveCategory(activeCategory === cat ? null : cat)
                  }
                  className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-sm border transition-all duration-200 ${
                    activeCategory === cat
                      ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10"
                      : "border-white/20 text-[var(--text)]/50 hover:border-[var(--accent)]/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {(query || activeCategory) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-2">
            <p className="text-[var(--accent)] text-xs tracking-widest uppercase">
              {filtered.length} {t(locale, "resultado(s)", "result(s)")}
            </p>
          </div>
        )}
      </div>

      {/* ── GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Section header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]/40" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-theme-tittles">
              {t(locale, "Artículos", "Articles")}
            </h2>
          </div>
          <p className="text-[var(--accent)] text-xs tracking-widest uppercase ml-7">
            {t(
              locale,
              "Guías, tips y destinos para tu próximo viaje",
              "Guides, tips and destinations for your next trip",
            )}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="min-h-[30vh] flex flex-col items-center justify-center gap-4">
            <MdTravelExplore className="text-white/20 text-6xl" />
            <p className="text-[var(--text)]/30 text-sm tracking-widest uppercase">
              {t(locale, "No se encontraron artículos", "No articles found")}
            </p>
            <ButtonArrow
              title={t(locale, "Limpiar filtros", "Clear filters")}
              onClick={() => {
                setQuery("");
                setActiveCategory(null);
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ParticlesCanvas />

            {filtered.map((post) => {
              const images = [post.cover_image, ...(post.photos ?? [])].filter(
                Boolean,
              ) as string[];

              const href = `/${locale}/${blogPath}/${post.slug}`;

              return (
                <article
                  key={post.id}
                  className="glass-card border border-white/10 rounded-sm overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300 group h-full flex flex-col relative"
                >
                  <div className="absolute inset-0 opacity-90 pointer-events-none">
                    <CardParticlesCanvas />
                  </div>

                  {/* ── Image ── */}
                  <div className="relative h-52 overflow-hidden flex-shrink-0">
                    {images.length > 0 ? (
                      <CardsSlideShow
                        images={images}
                        interval={5000}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <FaBookOpen className="text-white/20 text-4xl" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />

                    {/* Category badge */}
                    {post.category && (
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <span className="text-[var(--accent)] text-[10px] tracking-[0.25em] uppercase font-semibold border border-white/40 px-2 py-0.5 rounded-sm bg-black/40 backdrop-blur-sm">
                          {post.category}
                        </span>
                      </div>
                    )}

                    {/* Featured badge */}
                    {post.is_featured && (
                      <div className="absolute top-3 right-3 pointer-events-none">
                        <span className="text-white text-[9px] tracking-widest uppercase font-bold px-2 py-0.5 rounded-sm bg-[var(--accent)]/80">
                          {t(locale, "Destacado", "Featured")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── Content ── */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Date + Author */}
                    <div className="flex items-center gap-3 mb-3 text-[var(--text)]/40 text-[10px] uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-[var(--accent)]" />
                        {formatDate(post.published_at, locale)}
                      </span>
                      {post.author_name && (
                        <>
                          <span className="text-[var(--accent)]/50">·</span>
                          <span className="flex items-center gap-1">
                            <FaUser className="text-[var(--accent)]" />
                            {post.author_name}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <SplitText
                      text={post.title}
                      className="font-bold text-base uppercase leading-tight mb-2 text-[var(--accent)]"
                      delay={20}
                      duration={0.4}
                      splitType="chars"
                      from={{ opacity: 0, y: 20 }}
                      to={{ opacity: 1, y: 0 }}
                      textAlign="left"
                    />

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-[var(--text)]/70 text-sm leading-relaxed line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Tags */}
                    {(post.tags?.length ?? 0) > 0 && (
                      <>
                        <div className="border-t border-white/10 opacity-45 mb-3" />
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          <FaTag className="text-[var(--accent)] text-[0.6rem] mt-0.5 flex-shrink-0" />
                          {post.tags!.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="text-[var(--text)]/50 text-[10px] uppercase tracking-wide border border-white/10 rounded-sm px-1.5 py-0.5"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Separator + CTA */}
                    <div className="border-t border-white/10 opacity-45 mb-4 mt-auto" />
                    <ButtonArrow
                      href={href}
                      title={t(locale, "Leer artículo", "Read article")}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Paginator */}
        {!query && !activeCategory && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Paginator page={page} totalPages={totalPages} />
          </div>
        )}

        {/* Back to home */}
        <ButtonArrow
          href={`/${locale}`}
          className="mx-auto mt-12 mb-20 animate-pulse"
          title={t(locale, "Regresar al Inicio", "Return to Home")}
        />
      </div>
    </div>
  );
}
