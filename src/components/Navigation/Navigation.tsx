"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@/app/i18n/navigation";
import { useTranslations } from "next-intl";
import { CircleFlag } from "react-circle-flags";
import ScrollIndicator from "@/components/ScrollIndicator";
import ThemeSelector from "@/components/ThemeSelector";
import TrueFocusLogo from "@/components/Navigation/TrueFocusLogo";
import Logo from "@/components/Navigation/Logo";
import { MegaMenuDestinations } from "@/components/Navigation/MegaMenuDestinations";

import {
  Search,
  User,
  IndentIncrease,
  IndentDecrease,
  Package,
  MapPin,
  Globe,
  Compass,
  Loader2,
  ChevronDown,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import UserMenu from "../Auth/UserMenu";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { usePathname, useRouter } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";
import type { NavRegion } from "@/lib/data/destinations";

// ─── Types ─────────────────────────────────────────────────────────────────────

type SearchResult = {
  id: string;
  title: string;
  description: string;
  category: "package" | "tour" | "destination" | "country";
  slug: string;
  image?: string | null;
  price?: number | null;
  currency?: string | null;
};

type Locale = "es" | "en";

const CATEGORY_LABELS: Record<SearchResult["category"], Record<Locale, string>> = {
  package: { es: "Paquete", en: "Package" },
  tour: { es: "Tour", en: "Tour" },
  destination: { es: "Destino", en: "Destination" },
  country: { es: "País", en: "Country" },
};

const CATEGORY_ICONS: Record<SearchResult["category"], React.ReactNode> = {
  package: <Package className="w-4 h-4" />,
  tour: <Compass className="w-4 h-4" />,
  destination: <MapPin className="w-4 h-4" />,
  country: <Globe className="w-4 h-4" />,
};

function buildHref(result: SearchResult, locale: Locale): string {
  const base = {
    package: locale === "es" ? "/paquetes" : "/packages",
    tour: "/tours",
    destination: locale === "es" ? "/destinos" : "/destinations",
    country: locale === "es" ? "/destinos" : "/destinations",
  }[result.category];
  return `${base}/${result.slug}`;
}

// ── Normaliza: minúsculas + sin acentos ──────────────────────────────────────
function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const POPULAR: Record<Locale, string[]> = {
  es: ["Cancún", "Europa", "Safari", "Caribe", "Asia"],
  en: ["Cancún", "Europe", "Safari", "Caribbean", "Asia"],
};

const routes: Record<string, { [key in Locale]: string }> = {
  home: { es: "/", en: "/" },
  packages: { es: "/paquetes", en: "/packages" },
  destinations: { es: "/destinos", en: "/destinations" },
  tours: { es: "/tours", en: "/tours" },
  offers: { es: "/ofertas", en: "/offers" },
  blog: { es: "/blog", en: "/blog" },
  contact: { es: "/contacto", en: "/contact" },
};

const routeMapping: Record<Locale, Record<string, string>> = {
  es: {
    "/": "/",
    "/iniciar-sesion": "/login",
    "/servicios": "/services",
    "/destinos": "/destinations",
    "/tours": "/tours",
    "/ofertas": "/offers",
    "/blog": "/blog",
    "/contacto": "/contact",
  },
  en: {
    "/": "/",
    "/login": "/iniciar-sesion",
    "/services": "/servicios",
    "/destinations": "/destinos",
    "/tours": "/tours",
    "/offers": "/ofertas",
    "/blog": "/blog",
    "/contact": "/contacto",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

const Navigation = ({ navRegions }: { navRegions: NavRegion[] }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoChange, setLogoChange] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [user, setUser] = useState<SupabaseUser | null>(null);

  // ── Data para búsqueda local ─────────────────────────────────────────────
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale() as Locale;

  const navItems = [
    { label: t("home"), href: routes.home[locale] },
    { label: t("packages"), href: routes.packages[locale] },
    {
      label: t("destinations"),
      href: routes.destinations[locale],
      isDestinations: true,
    },
    { label: t("tours"), href: routes.tours[locale] },
    { label: t("offers"), href: routes.offers[locale] },
    { label: t("blog"), href: routes.blog[locale] },
    { label: t("contact"), href: routes.contact[locale] },
  ];

  // ── Scroll ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setLogoChange(window.scrollY > 1000);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Auth ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // ── Focus search ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  // ── Escape closes search ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isSearchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isSearchOpen]);

  // ── Carga toda la data UNA sola vez al abrir el search ───────────────────
  useEffect(() => {
    if (!isSearchOpen || dataLoaded) return;
    setIsSearching(true);
    fetch(`/api/search/all?locale=${locale}`)
      .then((r) => r.json())
      .then((json) => {
        setAllResults(json.results ?? []);
        setDataLoaded(true);
      })
      .catch(console.error)
      .finally(() => setIsSearching(false));
  }, [isSearchOpen, dataLoaded, locale]);

  // ── Filtrado local con normalize (igual que AllRegions) ──────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const q = normalize(searchQuery);
      if (q.length < 2) {
        setSearchResults([]);
        return;
      }
      const filtered = allResults.filter(
        (r) =>
          normalize(r.title).includes(q) ||
          normalize(r.description).includes(q),
      );
      setSearchResults(filtered);
    }, 150);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, allResults]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchToggle = () => {
    if (isSearchOpen) closeSearch();
    else setIsSearchOpen(true);
  };

  const toggleLanguage = () => {
    const next: Locale = locale === "es" ? "en" : "es";
    const newPath = routeMapping[locale][pathname] ?? "/";
    router.replace(newPath as any, { locale: next });
  };

  const handleLoginRedirect = () => {
    const loginPath = locale === "es" ? "/iniciar-sesion" : "/login";
    router.push(loginPath as any);
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(buildHref(result, locale) as any);
    closeSearch();
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Navbar ── */}
      <nav
        className={`nav fixed left-0 top-0 right-0 z-40 transition-all duration-500 ease-in-out backdrop-blur-[2px] ${
          isScrolled ? "text-theme bg-gradient-theme" : "text-theme-nav"
        }`}
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="w-full mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Hamburger */}
            <button
              type="button"
              title="Toggle menu"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="p-2 rounded-lg transition-all duration-300 relative z-[10000] pointer-events-auto"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <IndentIncrease
                className={`w-6 h-6 text-nav ${!isScrolled ? "drop-shadow-[0_0_10px_rgba(1,1,1,0.9)]" : ""}`}
              />
            </button>

            {/* Logo */}
            <Link
              href="/"
              onClick={() => setActiveItem("Home")}
              className="flex items-center gap-2 group cursor-pointer absolute left-1/2 transform -translate-x-1/2 z-[10000] pointer-events-auto"
            >
              {logoChange ? (
                <Logo isScrolled={logoChange} />
              ) : (
                <TrueFocusLogo
                  sentence="VIAJE SOAR"
                  focusClassName="bg-gradient-theme"
                  bgPadding={4}
                  manualMode={false}
                  blurAmount={2}
                  borderColor="#12f8dd"
                  animationDuration={0.5}
                  pauseBetweenAnimations={1}
                  wordColors={["var(--text)", "var(--accent)"]}
                />
              )}
            </Link>

            {/* Right icons */}
            <div className="flex items-center gap-3 relative z-[10000]">
              {/* ── Destinations mega menu (desktop only) ── */}
              {/* <MegaMenuDestinations
                locale={locale}
                regions={navRegions}
                trigger={
                  <div
                    className="flex items-center gap-1 p-2 rounded-full transition-all duration-300
                                  hover:scale-110 pointer-events-auto z-[10001] hidden md:flex"
                  >
                    <MapPin
                      className={`w-5 h-5 text-nav ${
                        !isScrolled
                          ? "drop-shadow-[0_0_10px_rgba(1,1,1,0.9)]"
                          : ""
                      }`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 text-nav ${
                        !isScrolled
                          ? "drop-shadow-[0_0_10px_rgba(1,1,1,0.9)]"
                          : ""
                      }`}
                    />
                  </div>
                }
              /> */}

              {/* Search */}
              <button
                type="button"
                className="p-2 rounded-full transition-all duration-300 hover:scale-110 pointer-events-auto z-[10001] hidden md:block"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSearchToggle();
                }}
                aria-label="Buscar"
              >
                <Search
                  className={`w-5 h-5 text-nav ${!isScrolled ? "drop-shadow-[0_0_10px_rgba(1,1,1,0.9)]" : ""}`}
                />
              </button>

              {/* Language */}
              <div
                onClick={toggleLanguage}
                className="flex items-center justify-center p-2 rounded-full transition-all duration-300 hover:scale-110 pointer-events-auto z-[10001] hidden md:flex cursor-pointer"
                aria-label="Cambiar idioma"
              >
                <button
                  className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center"
                  type="button"
                >
                  {locale === "es" ? (
                    <CircleFlag countryCode="mx" />
                  ) : (
                    <CircleFlag countryCode="us" />
                  )}
                </button>
              </div>

              {/* User */}
              <div className="relative pointer-events-auto z-[10001]">
                {user ? (
                  <UserMenu isMobile={false} />
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLoginRedirect();
                    }}
                    className="p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/90 pointer-events-auto z-[10002]"
                    aria-label="Iniciar sesión"
                  >
                    <User
                      className={`w-5 h-5 text-nav ${!isScrolled ? "drop-shadow-[0_0_10px_rgba(1,1,1,0.9)]" : ""}`}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
          <ScrollIndicator />
        </div>
      </nav>

      {/* ── Search overlay ── */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 text-theme ${
          isSearchOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 backdrop-blur-sm"
          onClick={closeSearch}
        />
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 mt-16">
          <div className="rounded-2xl shadow-2xl overflow-hidden bg-theme">
            <div className="p-6">
              <div className="relative">
                {isSearching ? (
                  <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin opacity-50" />
                ) : (
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
                )}
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={
                    locale === "es"
                      ? "Buscar destinos, paquetes, tours…"
                      : "Search destinations, packages, tours…"
                  }
                  className="w-full pl-12 pr-4 py-4 text-lg border-0 focus:outline-none focus:ring-0 bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                {searchResults.map((result) => (
                  <button
                    key={`${result.category}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200 flex items-center gap-3"
                  >
                    {result.image ? (
                      <img
                        src={result.image}
                        alt={result.title}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center flex-shrink-0 text-gray-400">
                        {CATEGORY_ICONS[result.category]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{result.title}</p>
                      {result.description && (
                        <p className="text-sm opacity-60 truncate mt-0.5">
                          {result.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-xs bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 px-2 py-0.5 rounded-full">
                        {CATEGORY_LABELS[result.category][locale]}
                      </span>
                      {result.price != null && (
                        <span className="text-xs font-medium opacity-70">
                          {result.currency ?? "USD"}{" "}
                          {result.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 &&
              !isSearching &&
              searchResults.length === 0 && (
                <div className="p-8 text-center opacity-60">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">
                    {locale === "es"
                      ? `Sin resultados para "${searchQuery}"`
                      : `No results for "${searchQuery}"`}
                  </p>
                  <p className="text-sm mt-1">
                    {locale === "es"
                      ? "Prueba con otras palabras"
                      : "Try different keywords"}
                  </p>
                </div>
              )}

            {searchQuery.length === 0 && (
              <div className="p-6">
                <h3 className="font-semibold opacity-60 mb-4 text-sm uppercase tracking-wide">
                  {locale === "es" ? "Búsquedas populares" : "Popular searches"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {POPULAR[locale].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSearchQuery(s)}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-white/10 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div
        className={`nav fixed inset-0 z-40 transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        id="mobile-menu"
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          className="absolute inset-0 bg-[var(--accent)]/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setIsMobileMenuOpen(false);
          }}
          aria-label="Cerrar menú"
        />

        <div
          className={`absolute top-0 left-0 h-full w-80 bg-gradient-theme transform transition-transform duration-500 z-50 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-(--text) ">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-theme rounded-lg transition-colors hover:bg-[var(--bg-secondary)]"
              aria-label="Cerrar menú"
            >
              <IndentDecrease className="w-6 h-6" />
            </button>

            <button
              type="button"
              className="p-2 text-theme rounded-lg transition-colors hover:bg-[var(--bg-secondary)]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSearchToggle();
                setIsMobileMenuOpen(false);
              }}
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={toggleLanguage}
              className="p-2 text-theme rounded-lg transition-colors hover:bg-[var(--bg-secondary)]"
              aria-label="Cambiar idioma"
            >
              {locale === "es" ? (
                <CircleFlag className="w-5 h-5" countryCode="mx" />
              ) : (
                <CircleFlag className="w-5 h-5" countryCode="us" />
              )}
            </button>

            <ThemeSelector />
          </div>

          <div className="px-5 flex flex-col justify-evenly h-full relative z-50">
            <div className="space-y-12 lg:space-y-10 bottom-20 lg:bottom-14 relative z-50">
              {navItems.map((item, index) => {
                // ── Destinations: MegaMenuDestinations en modo mobile ──
                // En Navigation.tsx, donde renderizas el MegaMenuDestinations mobile:
                if (item.isDestinations) {
                  return (
                    <div
                      key={index}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: isMobileMenuOpen
                          ? "slideInLeft 0.6s ease-out forwards"
                          : "none",
                      }}
                    >
                      <MegaMenuDestinations
                        locale={locale}
                        regions={navRegions}
                        isMobile
                        mobileLabel={item.label}
                        onNavigate={() => setIsMobileMenuOpen(false)}
                        trigger={null}
                      />
                    </div>
                  );
                }
                return (
                  <Link
                    key={index}
                    href={item.href as any}
                    onClick={() => {
                      setActiveItem(item.label);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left font-medium transition-all duration-300 transform hover:translate-x-2 tracking-wider uppercase text-sm ${
                      activeItem === item.label
                        ? "text-theme accent"
                        : "text-theme hover:accent-hover"
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: isMobileMenuOpen
                        ? "slideInLeft 0.6s ease-out forwards"
                        : "none",
                    }}
                    aria-current={
                      activeItem === item.label ? "page" : undefined
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;