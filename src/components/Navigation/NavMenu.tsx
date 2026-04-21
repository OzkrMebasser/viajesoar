"use client";
import React, { useState, useEffect } from "react";
import { Link } from "@/app/i18n/navigation";
import { useTranslations } from "next-intl";
import { IndentIncrease } from "lucide-react";
import ScrollIndicator from "@/components/ScrollIndicator";
import TrueFocusLogo from "@/components/Navigation/TrueFocusLogo";
import Logo from "@/components/Navigation/Logo";

import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { usePathname, useRouter } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";
import type { NavRegion } from "@/lib/data/destinations";
import type { SearchLocale } from "@/types/search";

// ─── Extracted components & hooks ────────────────────────────────────────────
import { useSearch } from "@/lib/hooks/useSearch";
import { SearchOverlay } from "@/components/Navigation/SearchOverlay";
import { NavIcons } from "@/components/Navigation/NavIcons";
import { MobileMenu } from "@/components/Navigation/MobileMenu";

// ─── Rutas localizadas ────────────────────────────────────────────────────────

const routes: Record<string, Record<SearchLocale, string>> = {
  home:         { es: "/",         en: "/"            },
  packages:     { es: "/paquetes", en: "/packages"    },
  destinations: { es: "/destinos", en: "/destinations"},
  tours:        { es: "/tours",    en: "/tours"       },
  offers:       { es: "/ofertas",  en: "/offers"      },
  blog:         { es: "/blog",     en: "/blog"        },
  contact:      { es: "/contacto", en: "/contact"     },
};

const routeMapping: Record<SearchLocale, Record<string, string>> = {
  es: {
    "/":                "/",
    "/iniciar-sesion":  "/login",
    "/servicios":       "/services",
    "/destinos":        "/destinations",
    "/tours":           "/tours",
    "/ofertas":         "/offers",
    "/blog":            "/blog",
    "/contacto":        "/contact",
  },
  en: {
    "/":              "/",
    "/login":         "/iniciar-sesion",
    "/services":      "/servicios",
    "/destinations":  "/destinos",
    "/tours":         "/tours",
    "/offers":        "/ofertas",
    "/blog":          "/blog",
    "/contact":       "/contacto",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

const NavMenu = ({ navRegions }: { navRegions: NavRegion[] }) => {
  const [isScrolled, setIsScrolled]           = useState(false);
  const [logoChange, setLogoChange]           = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem]           = useState("Home");
  const [user, setUser]                       = useState<SupabaseUser | null>(null);

  const t       = useTranslations("Navigation");
  const pathname = usePathname();
  const router  = useRouter();
  const locale  = useLocale() as SearchLocale;

  // ── Search (hook) ────────────────────────────────────────────────────────────
  const {
    isSearchOpen,
    searchQuery,
    searchResults,
    isSearching,
    loadStatus,
    setSearchQuery,
    closeSearch,
    handleSearchToggle,
  } = useSearch(locale);

  const navItems = [
    { label: t("home"),         href: routes.home[locale]         },
    { label: t("packages"),     href: routes.packages[locale]     },
    { label: t("destinations"), href: routes.destinations[locale], isDestinations: true },
    { label: t("tours"),        href: routes.tours[locale]        },
    { label: t("offers"),       href: routes.offers[locale]       },
    { label: t("blog"),         href: routes.blog[locale]         },
    { label: t("contact"),      href: routes.contact[locale]      },
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

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const toggleLanguage = () => {
    const next: SearchLocale = locale === "es" ? "en" : "es";
    const newPath = routeMapping[locale][pathname] ?? "/";
    router.replace(newPath as any, { locale: next });
  };

  const handleLoginRedirect = () => {
    const loginPath = locale === "es" ? "/iniciar-sesion" : "/login";
    router.push(loginPath as any);
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
            <NavIcons
              isScrolled={isScrolled}
              locale={locale}
              user={user}
              onSearchToggle={handleSearchToggle}
              onLanguageToggle={toggleLanguage}
              onLoginRedirect={handleLoginRedirect}
              onDestinationsClick={() => setIsMobileMenuOpen(true)}
            />
          </div>
          <ScrollIndicator />
        </div>
      </nav>

      {/* ── Search overlay ── */}
      <SearchOverlay
        isSearchOpen={isSearchOpen}
        searchQuery={searchQuery}
        searchResults={searchResults}
        isSearching={isSearching}
        loadStatus={loadStatus}
        locale={locale}
        setSearchQuery={setSearchQuery}
        closeSearch={closeSearch}
      />

      {/* ── Mobile menu ── */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        navItems={navItems}
        locale={locale}
        activeItem={activeItem}
        navRegions={navRegions}
        onClose={() => setIsMobileMenuOpen(false)}
        onSearchToggle={handleSearchToggle}
        onLanguageToggle={toggleLanguage}
        onNavItemClick={setActiveItem}
      />
    </>
  );
};

export default NavMenu;