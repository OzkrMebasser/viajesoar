"use client";
import React, { useState, useEffect } from "react";
import { Globe, Search, User, Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import UserMenu from "./UserMenu";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const router = useRouter();

  const navItems = [
    "Home",
    "Holidays",
    "Destinations",
    "Flights",
    "Offers",
    "Contact",
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginRedirect = () => {
    router.push("/login");
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

  return (
    <>
      <nav
        className={`fixed backdrop-blur-lg left-0 top-0 right-0 z-[9999] transition-all duration-500 ease-in-out pointer-events-auto ${
          isScrolled
            ? "bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-100"
            : "bg-transparent"
        }`}
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-9">
          <div className="flex items-center justify-between py-4 lg:py-5">
            {/* Logo */}
            <div
              className="flex items-center gap-3 group cursor-pointer relative z-[10000] pointer-events-auto"
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
                {/* <Globe
                  className={`w-6 h-6 transition-all duration-300 group-hover:rotate-12 ${
                    isScrolled ? "text-blue-600" : "text-white"
                  }`}
                /> */}
                <img src="/viajesoar-logo-2.png" alt="ViajeSoar Logo" className="w-[50px] h-[50px]" />
                <div className="absolute inset-0 bg-blue-400 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              </div>
              <span
                className={` text-3xl lg:text-5xl font-bold tracking-wider transition-colors duration-300 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                VIAJE<strong className="text-indigo-600 logo-text-bg" >SOAR</strong>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 relative z-[10000]">
              {navItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveItem(item);
                    console.log(`Clicked on ${item}`);
                  }}
                  className={`cursor-pointer relative text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:scale-105 pointer-events-auto relative z-[10001] ${
                    isScrolled
                      ? "text-gray-700 hover:text-blue-600"
                      : "text-white/90 hover:text-white"
                  }`}
                  aria-current={activeItem === item ? "page" : undefined}
                >
                  {item}
                  {activeItem === item && (
                    <div className="absolute -bottom-2 left-0 right-0">
                      <div className="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transform scale-x-100 transition-transform duration-300" />
                      <div className="h-1 bg-gradient-to-r from-blue-400 to-cyan-300 blur-sm rounded-full opacity-60 -mt-0.5" />
                    </div>
                  )}
                  {activeItem !== item && (
                    <div className="absolute -bottom-2 left-0 right-0">
                      <div className="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </div>
                  )}
                </button>
              ))}

              {/* Action Icons */}
              <div className="flex items-center gap-4 ml-6 relative z-[10000]">
                <button
                  type="button"
                  className={`p-2 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 pointer-events-auto z-[10001] ${
                    isScrolled
                      ? "hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                      : "hover:bg-white/10 text-white/90 hover:text-white"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Search clicked");
                  }}
                  aria-label="Buscar"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* User Menu */}
                <div className="relative pointer-events-auto z-[10001]">
                  {user ? (
                    <UserMenu isMobile={false} />
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Login button clicked");
                        handleLoginRedirect();
                      }}
                      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/50 pointer-events-auto z-[10002] ${
                        isScrolled
                          ? "hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                          : "hover:bg-white/10 text-white/90 hover:text-white"
                      }`}
                      aria-label="Iniciar sesión"
                    >
                      <User className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Mobile menu clicked");
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className={`lg:hidden p-2 rounded-lg transition-all duration-300 relative z-[10000] pointer-events-auto ${
                isScrolled
                  ? "hover:bg-gray-100 text-gray-700"
                  : "hover:bg-white/10 text-white"
              }`}
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
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[9998] transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        id="mobile-menu"
        aria-hidden={isMobileMenuOpen ? "true" : "false"}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
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
          className={`absolute top-0 right-0 h-full w-80 bg-white transform transition-transform duration-500 z-[9999] ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 pt-20">
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
                    console.log(`Mobile: Clicked on ${item}`);
                  }}
                  className={`block w-full text-left text-lg font-medium transition-all duration-300 transform hover:translate-x-2 relative z-[10000] pointer-events-auto ${
                    activeItem === item
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isMobileMenuOpen
                      ? "slideInRight 0.6s ease-out forwards"
                      : "none",
                  }}
                  aria-current={activeItem === item ? "page" : undefined}
                >
                  {item}
                </button>
              ))}

              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300 pointer-events-auto z-[10000]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Mobile search clicked");
                  }}
                  aria-label="Buscar"
                >
                  <Search className="w-5 h-5" />
                </button>

                <div className="flex-1 pointer-events-auto z-[10000]">
                  {user ? (
                    <UserMenu isMobile={true} />
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Mobile login clicked");
                        handleLoginRedirect();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300 pointer-events-auto z-[10001]"
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        Iniciar Sesión
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
