"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "@/app/i18n/navigation";
import { useTranslations } from "next-intl";
import ScrollIndicator from "./ScrollIndicator";
import { useTheme } from "@/lib/context/ThemeContext";

import {
  Globe,
  Search,
  User,
  Menu,
  IndentIncrease,
  IndentDecrease,
  Palette,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import UserMenu from "./Auth/UserMenu";
import Fuse from "fuse.js";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { usePathname, useRouter } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";

type SearchResult = {
  id: number;
  title: string;
  category: string;
  description: string;
};

type Locale = "es" | "en";
type Theme = "dark" | "light" | "vibrant";

interface ThemeOption {
  value: Theme;
  label: string;
  emoji: string;
  description: string;
}

const routes: Record<string, { [key in Locale]: string }> = {
  home: { es: "/", en: "/" },
  services: { es: "/servicios", en: "/services" }, 
  destinations: { es: "/destinos", en: "/destinations" },
  flights: { es: "/vuelos", en: "/flights" },
  offers: { es: "/ofertas", en: "/offers" },
  contact: { es: "/contacto", en: "/contact" },
};

const themeOptions: ThemeOption[] = [
  { value: "dark", label: "Dark", emoji: "🌙", description: "Professional & Elegant" },
  { value: "light", label: "Light", emoji: "☀️", description: "Fresh & Clean" },
  { value: "vibrant", label: "Vibrant", emoji: "🌴", description: "Tropical & Bold" },
];

const LogoBig = () => (
  <>
    <div className="relative">
      <img
        src="/VIAJES-soar-logo-blues.png"
        alt="ViajeSoar Logo"
        className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px]"
      />
      <div className="absolute inset-0 bg-dark-accent dark:bg-dark-accent light:bg-light-accent vibrant:bg-vibrant-accent blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
    </div>
    <strong>
      <span className="text-xl lg:text-3xl font-bold tracking-wider transition-colors duration-300 dark:text-dark-text light:text-light-text vibrant:text-vibrant-text">
        VIAJE
        <span className="soar dark:text-dark-accent light:text-light-accent vibrant:text-vibrant-accent">
          SOAR
        </span>
      </span>
    </strong>
  </>
);

const LogoSmall = () => (
  <>
    <div className="relative group">
      <img
        src="/VIAJES-soar-logo-blues.png"
        alt="ViajeSoar Logo"
        className="mt-8 w-[70px] h-[70px] lg:w-[90px] lg:h-[90px] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-5"
      />
      <div className="absolute inset-0 dark:bg-dark-accent/50 light:bg-light-accent/50 vibrant:bg-vibrant-accent/50 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
    </div>
  </>
);

const Navigation = () => {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeItem, setActiveItem] = useState("Home");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const themeMenuRef = useRef<HTMLDivElement | null>(null);

  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale() as Locale;

  const navItems = [
    { label: t("home"), href: routes.home[locale] },
    { label: t("holidays"), href: routes.services[locale] },
    { label: t("destinations"), href: routes.destinations[locale] },
    { label: t("flights"), href: routes.flights[locale] },
    { label: t("offers"), href: routes.offers[locale] },
    { label: t("contact"), href: routes.contact[locale] },
  ];

  const toggleLanguage = () => {
    const next: Locale = locale === "es" ? "en" : "es";
    const routeMapping: Record<string, string> = {
      "/": "/",
      "/iniciar-sesion": "/login",
      "/servicios": "/services",
      "/destinos": "/destinations",
      "/vuelos": "/flights",
      "/ofertas": "/offers",
      "/contacto": "/contact",
      "/login": "/iniciar-sesion",
      "/services": "/servicios",
      "/destinations": "/destinos",
      "/flights": "/vuelos",
      "/offers": "/ofertas",
      "/contact": "/contacto",
    };
    const newPath = routeMapping[pathname] || "/";
    router.replace(newPath as any, { locale: next });
  };

  const searchData = [
    {
      id: 1,
      title: "Beach Holiday in Maldives",
      category: "Holidays",
      description: "Luxury resort with crystal clear waters",
    },
    {
      id: 2,
      title: "Paris City Break",
      category: "Destinations",
      description: "Explore the city of lights",
    },
    {
      id: 3,
      title: "Cheap Flights to Tokyo",
      category: "Flights",
      description: "Best deals for flights to Japan",
    },
    {
      id: 4,
      title: "Safari Adventure Kenya",
      category: "Holidays",
      description: "Wildlife experience in Africa",
    },
    {
      id: 5,
      title: "Rome Historical Tour",
      category: "Destinations",
      description: "Ancient history and culture",
    },
    {
      id: 6,
      title: "Last Minute Offers",
      category: "Offers",
      description: "Special discounts available now",
    },
    {
      id: 7,
      title: "Contact Support",
      category: "Contact",
      description: "Get help with your booking",
    },
    {
      id: 8,
      title: "New York Flight Deals",
      category: "Flights",
      description: "Affordable flights to NYC",
    },
    {
      id: 9,
      title: "Thailand Beach Resort",
      category: "Holidays",
      description: "Tropical paradise vacation",
    },
    {
      id: 10,
      title: "Barcelona City Guide",
      category: "Destinations",
      description: "Art, culture and architecture",
    },
  ];

  const fuseOptions = {
    keys: ["title", "category", "description"],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2,
  };

  const fuse = React.useMemo(() => new Fuse(searchData, fuseOptions), []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = fuse.search(searchQuery);
      setSearchResults(results.map((result) => result.item));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, fuse]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsThemeOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    if (isSearchOpen || isThemeOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isSearchOpen, isThemeOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeOpen(false);
      }
    };
    if (isThemeOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isThemeOpen]);

  const handleLoginRedirect = () => {
    const loginPath = locale === "es" ? "/iniciar-sesion" : "/login";
    router.push(loginPath as any);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsThemeOpen(false);
    if (!isSearchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsThemeOpen(false);
  };

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user || null);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSearchResultClick = (result: (typeof searchData)[number]) => {
    console.log("Selected:", result);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const getThemeColors = () => {
    switch (theme) {
      case "light":
        return {
          nav: "bg-light-bg",
          navScroll: "backdrop-blur-sm bg-light-bg/80",
          text: "text-light-text",
          buttonHover: "hover:bg-light-border",
          border: "border-light-border",
          mobileMenu: "bg-light-bg",
          mobileMenuOverlay: "bg-black/20",
          searchBg: "bg-light-bg",
          searchBorder: "border-light-border",
          searchText: "text-light-text",
          searchSecondary: "text-light-text-secondary",
          searchInput: "bg-light-bg-secondary text-light-text",
          themeMenuBg: "bg-light-bg border border-light-border",
        };
      case "vibrant":
        return {
          nav: "bg-vibrant-bg",
          navScroll: "backdrop-blur-sm bg-vibrant-bg/80",
          text: "text-vibrant-text",
          buttonHover: "hover:bg-vibrant-secondary/20",
          border: "border-vibrant-border",
          mobileMenu: "bg-vibrant-bg",
          mobileMenuOverlay: "bg-black/30",
          searchBg: "bg-vibrant-bg",
          searchBorder: "border-vibrant-border",
          searchText: "text-vibrant-text",
          searchSecondary: "text-vibrant-text-secondary",
          searchInput: "bg-vibrant-bg-secondary text-vibrant-text",
          themeMenuBg: "bg-vibrant-bg border border-vibrant-border",
        };
      default:
        return {
          nav: "bg-transparent",
          navScroll: "backdrop-blur-sm bg-black/80",
          text: "text-dark-text",
          buttonHover: "hover:bg-white/10",
          border: "border-gray-800",
          mobileMenu: "bg-black",
          mobileMenuOverlay: "bg-black/70",
          searchBg: "bg-white",
          searchBorder: "border-gray-100",
          searchText: "text-gray-900",
          searchSecondary: "text-gray-600",
          searchInput: "bg-white text-gray-900",
          themeMenuBg: "bg-gray-900 border border-gray-800",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <>
      <nav
        className={`nav fixed left-0 top-0 right-0 z-40 transition-all duration-500 ease-in-out ${
          isScrolled ? colors.navScroll : colors.nav
        }`}
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="w-full mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className={`p-2 rounded-lg transition-all duration-300 ${colors.text} ${colors.buttonHover} relative z-[10000] pointer-events-auto`}
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen ? "true" : "false"}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <IndentDecrease className="w-6 h-6" />
              ) : (
                <IndentIncrease className="w-6 h-6" />
              )}
            </button>

            <Link
              href="/"
              onClick={() => setActiveItem("Home")}
              className="flex items-center gap-2 group cursor-pointer absolute left-1/2 transform -translate-x-1/2 z-[10000] pointer-events-auto"
            >
              {isScrolled ? <LogoBig /> : <LogoSmall />}
            </Link>

            <div className="flex items-center gap-3 relative z-[10000]">
              <button
                type="button"
                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${colors.text} ${colors.buttonHover} pointer-events-auto z-[10001] hidden md:block`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSearchToggle();
                }}
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>

              <div ref={themeMenuRef} className="relative">
                <button
                  type="button"
                  className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${colors.text} ${colors.buttonHover} pointer-events-auto z-[10001] hidden md:flex items-center justify-center`}
                  onClick={() => setIsThemeOpen(!isThemeOpen)}
                  aria-label="Cambiar tema"
                  title="Cambiar tema"
                >
                  <Palette className="w-5 h-5" />
                </button>

                {isThemeOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${colors.themeMenuBg} z-50 overflow-hidden`}>
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleThemeChange(option.value)}
                        className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center gap-3 ${
                          theme === option.value 
                            ? theme === "light" ? "bg-light-border text-light-text font-semibold" :
                              theme === "vibrant" ? "bg-vibrant-secondary/30 text-vibrant-text font-semibold" :
                              "bg-dark-accent/20 text-dark-accent font-semibold"
                            : theme === "light" ? "text-light-text hover:bg-light-border/50" :
                              theme === "vibrant" ? "text-vibrant-text hover:bg-vibrant-secondary/20" :
                              "text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-lg">{option.emoji}</span>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs opacity-70">{option.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={toggleLanguage}
                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${colors.text} ${colors.buttonHover} pointer-events-auto z-[10001] hidden md:block`}
                aria-label="Cambiar idioma"
              >
                <Globe className="w-5 h-5" />
              </button>

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
                    className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${colors.text} ${colors.buttonHover} pointer-events-auto z-[10002]`}
                    aria-label="Iniciar sesión"
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <ScrollIndicator />
        </div>
      </nav>

      {/* Search Modal */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isSearchOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsSearchOpen(false)}
        />
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
          <div className={`${colors.searchBg} rounded-2xl shadow-2xl overflow-hidden`}>
            <div className={`p-6 border-b ${colors.searchBorder}`}>
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  theme === "light" ? "text-light-text-secondary" :
                  theme === "vibrant" ? "text-vibrant-text-secondary" :
                  "text-gray-400"
                }`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search destinations, flights, offers..."
                  className={`w-full pl-12 pr-4 py-4 text-lg border-0 focus:outline-none focus:ring-0 rounded-lg ${colors.searchInput}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSearchResultClick(result)}
                    className={`w-full text-left p-4 transition-colors duration-200 border-b last:border-b-0 ${
                      theme === "light" ? "hover:bg-light-bg-secondary border-light-border text-light-text" :
                      theme === "vibrant" ? "hover:bg-vibrant-bg-secondary border-vibrant-border text-vibrant-text" :
                      "hover:bg-gray-50 border-gray-50 text-gray-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">
                          {result.title}
                        </h3>
                        <p className={`text-sm mt-1 ${colors.searchSecondary}`}>
                          {result.description}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        theme === "light" ? "bg-light-accent/20 text-light-accent" :
                        theme === "vibrant" ? "bg-vibrant-accent/20 text-vibrant-accent" :
                        "bg-teal-100 text-teal-800"
                      }`}>
                        {result.category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className={`p-8 text-center ${colors.searchSecondary}`}>
                <Search className={`w-12 h-12 mx-auto mb-4 ${
                  theme === "light" ? "text-light-border" :
                  theme === "vibrant" ? "text-vibrant-border" :
                  "text-gray-300"
                }`} />
                <p>No results found for "{searchQuery}"</p>
                <p className="text-sm mt-2">Try different keywords</p>
              </div>
            )}

            {searchQuery.length === 0 && (
              <div className="p-6">
                <h3 className={`font-semibold mb-4 ${colors.searchText}`}>
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Maldives", "Paris", "Tokyo", "Safari", "Flights"].map(
                    (suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setSearchQuery(suggestion)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          theme === "light" ? "bg-light-border text-light-text hover:bg-light-accent/20" :
                          theme === "vibrant" ? "bg-vibrant-border text-vibrant-text hover:bg-vibrant-secondary/20" :
                          "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {suggestion}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
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
          className={`absolute inset-0 backdrop-blur-sm ${colors.mobileMenuOverlay}`}
          onClick={() => setIsMobileMenuOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsMobileMenuOpen(false);
            }
          }}
          aria-label="Cerrar menú"
        />

        <div
          className={`absolute top-0 left-0 h-full w-80 transform transition-transform duration-500 z-50 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } ${colors.mobileMenu} border-r ${colors.border}`}
        >
          <div className={`flex items-center justify-between p-6 border-b ${colors.border}`}>
            <button
              type="button"
              className={`p-2 ${colors.text} ${colors.buttonHover} rounded-lg transition-colors`}
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
              onClick={() => setIsMobileMenuOpen(false)}
              className={`p-2 ${colors.text} ${colors.buttonHover} rounded-lg transition-colors`}
              aria-label="Cerrar menú"
            >
              <IndentDecrease className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <span className={`font-medium text-sm tracking-wider uppercase ${
                theme === "light" ? "text-light-accent" :
                theme === "vibrant" ? "text-vibrant-primary" :
                "text-dark-accent"
              }`}>
                Navigation
              </span>
            </div>

            <div className="space-y-6 relative z-50">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href as any}
                  onClick={() => {
                    setActiveItem(item.label);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left font-medium transition-all duration-300 transform hover:translate-x-2 tracking-wider uppercase text-sm ${
                    activeItem === item.label
                      ? theme === "light" ? "text-light-accent" :
                        theme === "vibrant" ? "text-vibrant-primary" :
                        "text-dark-accent"
                      : theme === "light" ? "text-light-text-secondary hover:text-light-text" :
                        theme === "vibrant" ? "text-vibrant-text-secondary hover:text-vibrant-text" :
                        "text-gray-300 hover:text-white"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isMobileMenuOpen
                      ? "slideInLeft 0.6s ease-out forwards"
                      : "none",
                    zIndex: 100000,
                  }}
                  aria-current={activeItem === item.label ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div>
              <button
                type="button"
                onClick={toggleLanguage}
                className={`p-2 mt-4 rounded-full transition-all duration-300 hover:scale-110 ${colors.text} ${colors.buttonHover} pointer-events-auto z-50`}
                aria-label="Cambiar idioma"
              >
                <Globe className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className={`p-2 ml-2 mt-4 rounded-full transition-all duration-300 hover:scale-110 ${colors.text} ${colors.buttonHover} pointer-events-auto z-50`}
                aria-label="Cambiar tema"
              >
                <Palette className="w-5 h-5" />
              </button>

              {isThemeOpen && (
                <div className={`mt-4 rounded-lg p-3 ${
                  theme === "light" ? "bg-light-bg-secondary border border-light-border" :
                  theme === "vibrant" ? "bg-vibrant-bg-secondary border border-vibrant-border" :
                  "bg-gray-800 border border-gray-700"
                }`}>
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleThemeChange(option.value)}
                      className={`w-full px-3 py-2 text-left transition-all duration-200 flex items-center gap-2 rounded-md mb-2 last:mb-0 ${
                        theme === option.value 
                          ? theme === "light" ? "bg-light-border text-light-text font-semibold" :
                            theme === "vibrant" ? "bg-vibrant-secondary/30 text-vibrant-text font-semibold" :
                            "bg-dark-accent/20 text-dark-accent font-semibold"
                          : theme === "light" ? "text-light-text hover:bg-light-border/50" :
                            theme === "vibrant" ? "text-vibrant-text hover:bg-vibrant-secondary/20" :
                            "text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-lg">{option.emoji}</span>
                      <div>
                        <div className="font-medium text-sm">{option.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {user ? (
                <UserMenu isMobile={true} />
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLoginRedirect();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-center gap-2 p-3 mt-4 text-white rounded-lg transition-colors duration-300 pointer-events-auto z-50 font-medium ${
                    theme === "light" ? "bg-light-accent hover:bg-light-accent-hover" :
                    theme === "vibrant" ? "bg-vibrant-primary hover:bg-vibrant-primary/90" :
                    "bg-dark-accent hover:bg-dark-accent-hover"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </button>
              )}
            </div>
          </div>
          <div className={`relative mx-auto h-44 w-44 ${
            theme === "light" ? "bg-light-bg-secondary" :
            theme === "vibrant" ? "bg-vibrant-bg-secondary" :
            "bg-gray-600"
          } flex items-center justify-center rounded-lg`}>
            <p className={theme === "light" ? "text-light-text" : theme === "vibrant" ? "text-vibrant-text" : "text-white"}>
              Logo aquí
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;