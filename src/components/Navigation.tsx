"use client";
import React, { useState, useEffect, useRef } from "react";
import { Globe, Search, User, Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import UserMenu from "./UserMenu";
import Fuse from "fuse.js";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type SearchResult = {
  id: number;
  title: string;
  category: string;
  description: string;
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeItem, setActiveItem] = useState("Home");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const navItems = [
    "Home",
    "Holidays",
    "Destinations",
    "Flights",
    "Offers",
    "Contact",
  ];

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
    router.push("/login");
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
        className={`fixed backdrop-blur-lg left-0 top-0 right-0 z-40 transition-all duration-500 ease-in-out ${
          isScrolled ? "bg-black/95 backdrop-blur-lg" : "bg-black/80"
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
              <div className="relative">
                <img
                  src="/viajesoar-logo-final.png"
                  alt="ViajeSoar Logo"
                  className="w-[30px] h-[30px] lg:w-[50px] lg:h-[50px]"
                />
                <div className="absolute inset-0 bg-teal-400 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              </div>
              <strong>
                <span className="text-xl lg:text-3xl font-bold tracking-wider transition-colors duration-300">
                  VIAJE
                  <span className="soar">SOAR</span>
                </span>
              </strong>
            </div>

            <div className="flex items-center gap-3 relative z-[10000]">
              <button
                type="button"
                className="p-2 rounded-full transition-all duration-300 hover:scale-110 text-white hover:bg-white/10 pointer-events-auto z-[10001]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSearchToggle();
                }}
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
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
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        id="mobile-menu"
        aria-hidden={isMobileMenuOpen ? "false" : "true"}
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
          className={`absolute top-0 left-0 h-full w-80 bg-black transform transition-transform duration-500 z-[9999] ${
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

            <div className="space-y-6">
              {navItems.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveItem(item);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left font-medium transition-all duration-300 transform hover:translate-x-2 relative z-[10000] pointer-events-auto tracking-wider uppercase text-sm ${
                    activeItem === item
                      ? "text-teal-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isMobileMenuOpen
                      ? "slideInLeft 0.6s ease-out forwards"
                      : "none",
                  }}
                  aria-current={activeItem === item ? "page" : undefined}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="absolute bottom-6 left-6 right-6">
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
                  className="w-full flex items-center justify-center gap-2 p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-300 pointer-events-auto z-[10001] font-medium"
                >
                  <User className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
