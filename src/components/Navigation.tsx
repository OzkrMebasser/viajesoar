"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "@/app/i18n/navigation";
import { useTranslations } from "next-intl";

import { Globe, Search, User, Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
// import { useRouter } from "next/navigation";
import UserMenu from "./Auth/UserMenu";
import Fuse from "fuse.js";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { usePathname, useRouter } from "@/app/i18n/navigation"; // 👈 usa tu navegación
import { useLocale } from "next-intl";

type SearchResult = {
  id: number;
  title: string;
  category: string;
  description: string;
};

type Locale = "es" | "en";

// Solo las rutas que quieres mostrar en la navegación principal
const routes: Record<string, { [key in Locale]: string }> = {
  home: { es: "/", en: "/" },
  services: { es: "/servicios", en: "/services" }, // Cambiado de "holidays" a "services"
  destinations: { es: "/destinos", en: "/destinations" },
  flights: { es: "/vuelos", en: "/flights" },
  offers: { es: "/ofertas", en: "/offers" },
  contact: { es: "/contacto", en: "/contact" },
};

const LogoBig = () => (
  <>
    <div className="relative">
      <img
        src="/viajesoar-logo.png"
        alt="ViajeSoar Logo"
        className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px]"
      />
      <div className="absolute inset-0 bg-teal-400 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
    </div>
    <strong>
      <span className="text-xl lg:text-3xl font-bold tracking-wider transition-colors duration-300 text-white">
        VIAJE
        <span className="soar text-[#ccfb08] ">SOAR</span>
      </span>
    </strong>
  </>
);

const LogoSmall = () => (
  <>
    <div className="relative">
      <img
        src="/viajesoar-logo.png"
        alt="ViajeSoar Logo"  
        className="w-[70px] h-[70px] lg:w-[80px] lg:h-[80px]"
    
      />
      <div className="absolute inset-0 bg-teal-400 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
    </div>
  </>
);

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeItem, setActiveItem] = useState("Home");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const t = useTranslations("Navigation");

  const pathname = usePathname(); // p.ej. "/services"
  const router = useRouter(); // router de next-intl
  const locale = useLocale() as Locale; // 👈 Hacer cast explícito a Locale

  const navItems = [
    { label: t("home"), href: routes.home[locale] },
    { label: t("holidays"), href: routes.services[locale] }, // Usa "holidays" de traducción pero va a services
    { label: t("destinations"), href: routes.destinations[locale] },
    { label: t("flights"), href: routes.flights[locale] },
    { label: t("offers"), href: routes.offers[locale] },
    { label: t("contact"), href: routes.contact[locale] },
  ];

  const toggleLanguage = () => {
    const next: Locale = locale === "es" ? "en" : "es";

    // Mapeo basado en tu configuración de routing real
    const routeMapping: Record<string, string> = {
      // Rutas en español -> inglés
      "/": "/",
      "/iniciar-sesion": "/login",
      "/servicios": "/services",
      "/destinos": "/destinations",
      "/vuelos": "/flights",
      "/ofertas": "/offers",
      "/contacto": "/contact",
      // Rutas en inglés -> español
      "/login": "/iniciar-sesion",
      "/services": "/servicios",
      "/destinations": "/destinos",
      "/flights": "/vuelos",
      "/offers": "/ofertas",
      "/contact": "/contacto",
    };

    // Obtener la ruta correspondiente o usar "/" como fallback
    const newPath = routeMapping[pathname] || "/";

    // Navegar al nuevo path con el locale correcto
    router.replace(newPath as any, { locale: next });
  };

  // const navItems = [
  //   "Home",
  //   "Holidays",
  //   "Destinations",
  //   "Flights",
  //   "Offers",
  //   "Contact",
  // ];

  // Dentro del componente Navbar, después de obtener locale:

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

  // Memoizar la instancia de Fuse para evitar recrearla en cada render
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

  const handleLoginRedirect = () => {
    // Usar la ruta de login correcta según el locale
    const loginPath = locale === "es" ? "/iniciar-sesion" : "/login";
    router.push(loginPath as any);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isSearchOpen]);

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
    // Aquí puedes navegar a la página correspondiente
    // router.push(`/${result.category.toLowerCase()}/${result.id}`);
  };

  return (
    <>
      <nav
        className={`nav fixed  left-0 top-0 right-0 z-40 transition-all duration-500 ease-in-out ${
          isScrolled ? "backdrop-blur-sm bg-black/40 shadow-md" : ""
        }`}
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="p-2 rounded-lg transition-all duration-300 text-white hover:bg-white/10 relative z-[10000] pointer-events-auto"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen ? "true" : "false"}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <div
              className="flex items-center gap-2 group cursor-pointer absolute left-1/2 transform -translate-x-1/2 z-[10000] pointer-events-auto"
              role="button"
              tabIndex={0}
              aria-label="Ir al inicio"
              onClick={() => setActiveItem("Home")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveItem("Home");
                }
              }}
            >
              {/* <div className="relative">
                <img
                  src="/viajesoar-logo.png"
                  alt="ViajeSoar Logo"
                  className={
                    isScrolled
                      ? "w-[40px] h-[40px] lg:w-[50px] lg:h-[50px]"
                      : "w-[70px] h-[70px] lg:w-[80px] lg:h-[80px]"
                  }
                />
                <div className="absolute inset-0 bg-teal-400 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              </div>
              <strong>
                <span
                  className={
                    isScrolled
                      ? "text-xl lg:text-3xl font-bold tracking-wider transition-colors duration-300 text-white"
                      : "text-xl lg:text-4xl font-bold tracking-wider transition-colors duration-300 text-white"
                  }
                >
                  VIAJE
                  <span className="soar text-[#ccfb08] ">SOAR</span>
                </span>
              </strong> */}
              {isScrolled ? <LogoBig /> : <LogoSmall />}
            </div>

            <div className="flex items-center gap-3 relative z-[10000]">
              <button
                type="button"
                className="p-2 rounded-full transition-all duration-300 hover:scale-110 text-white hover:bg-white/10 pointer-events-auto z-[10001] hidden md:block"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSearchToggle();
                }}
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={toggleLanguage}
                className="p-2 rounded-full transition-all duration-300 hover:scale-110 text-white hover:bg-white/10 pointer-events-auto z-[10001] hidden md:block"
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
                    className="p-2 rounded-full transition-all duration-300 hover:scale-110 text-white hover:bg-white/10 pointer-events-auto z-[10002]"
                    aria-label="Iniciar sesión"
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

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
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search destinations, flights, offers..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-0 focus:outline-none focus:ring-0"
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
                    className="w-full text-left p-4 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-50 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {result.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {result.description}
                        </p>
                      </div>
                      <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                        {result.category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No results found for "{searchQuery}"</p>
                <p className="text-sm mt-2">Try different keywords</p>
              </div>
            )}

            {searchQuery.length === 0 && (
              <div className="p-6">
                <h3 className="font-semibold text-gray-700 mb-4">
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Maldives", "Paris", "Tokyo", "Safari", "Flights"].map(
                    (suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setSearchQuery(suggestion)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
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

      <div
        className={`nav fixed inset-0 z-40 transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        id="mobile-menu"
        aria-hidden={!!isMobileMenuOpen}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
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
          className={`absolute top-0 left-0 h-full w-80 bg-[black] transform transition-transform duration-500 z-50 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <button
              type="button"
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
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
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-teal-400 font-medium text-sm tracking-wider uppercase">
                Navigation
              </span>
            </div>

            <div className="space-y-6 relative z-50">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href as any} // Cast para evitar error de tipos estrictos
                  onClick={() => {
                    setActiveItem(item.label);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left font-medium transition-all duration-300 transform hover:translate-x-2 tracking-wider uppercase text-sm ${
                    activeItem === item.label
                      ? "text-teal-400"
                      : "text-gray-300 hover:text-white"
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

            <div className=" ">
              <button
                type="button"
                onClick={toggleLanguage}
                className="p-2 mt-4 rounded-full transition-all duration-300 hover:scale-110 text-white hover:bg-white/10 pointer-events-auto z-50"
                aria-label="Cambiar idioma"
              >
                <Globe className="w-5 h-5" />
              </button>
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
                  className="w-full flex items-center justify-center gap-2 p-3 mt-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-300 pointer-events-auto z-50 font-medium"
                >
                  <User className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </button>
              )}
            </div>
          </div>
          <div className="relative mx-auto h-44 w-44 bg-gray-600">
            <p className="text-white text-center">Logo aqui</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
