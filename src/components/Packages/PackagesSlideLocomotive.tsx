"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaSuitcase, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import SplitText from "@/components/SplitText";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import ButtonArrow from "@/components/ui/ButtonArrow";
import { supabase } from "@/lib/supabase";

type Locale = "es" | "en";

interface Package {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  price_from: number;
  currency: string;
  visited_countries: string[];
}

// 🔥 DATOS HARDCODEADOS TEMPORALES
const hardcodedPackages: Record<Locale, Package[]> = {
  es: [
    {
      id: "temp-1",
      name: "Maravillas de Asia",
      slug: "maravillas-asia",
      description: "Descubre los templos ancestrales y la cultura milenaria de Tailandia, Camboya y Vietnam en 14 días inolvidables.",
      images: ["https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800"],
      price_from: 2199,
      currency: "USD",
      visited_countries: [],
    },
    {
      id: "temp-2",
      name: "Safari Africano Premium",
      slug: "safari-africano-premium",
      description: "Vive la aventura africana con safaris fotográficos en Kenia y Tanzania. Incluye los Big 5 y playas de Zanzíbar.",
      images: ["https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800"],
      price_from: 3499,
      currency: "USD",
      visited_countries: [],
    },
    {
      id: "temp-3",
      name: "Patagonia Extrema",
      slug: "patagonia-extrema",
      description: "Glaciares milenarios, montañas imponentes y lagos turquesa. Recorre Argentina y Chile en esta aventura de 10 días.",
      images: ["https://images.unsplash.com/photo-1591642425143-1fb5e1f9682b?w=800"],
      price_from: 1899,
      currency: "USD",
      visited_countries: [],
    },
    {
      id: "temp-4",
      name: "Ruta de los Incas",
      slug: "ruta-incas",
      description: "Machu Picchu, Valle Sagrado, Cusco y el Lago Titicaca. Explora la civilización Inca en 8 días mágicos.",
      images: ["https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800"],
      price_from: 1299,
      currency: "USD",
      visited_countries: [],
    },
    {
      id: "temp-5",
      name: "Islas Griegas de Ensueño",
      slug: "islas-griegas",
      description: "Santorini, Mykonos, Creta y Atenas. Playas de arena blanca, arquitectura única y gastronomía mediterránea.",
      images: ["https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800"],
      price_from: 1799,
      currency: "USD",
      visited_countries: [],
    },
  ],
  en: [
    {
      id: "temp-1",
      name: "Asian Wonders",
      slug: "maravillas-asia",
      description: "Discover ancient temples and millennial culture in Thailand, Cambodia and Vietnam on an unforgettable 14-day journey.",
      images: ["https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800"],
      price_from: 2199,
      currency: "USD",
      visited_countries: [],
    },
    {
      id: "temp-2",
      name: "Premium African Safari",
      slug: "safari-africano-premium",
      description: "Live the African adventure with photo safaris in Kenya and Tanzania. Includes the Big 5 and Zanzibar beaches.",
      images: ["https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800"],
      price_from: 3499,
      currency: "USD",
      visited_countries: [],
    },
    {
      id: "temp-3",
      name: "Extreme Patagonia",
      slug: "patagonia-extrema",
      description: "Ancient glaciers, imposing mountains and turquoise lakes. Explore Argentina and Chile on this 10-day adventure.",
      images: ["https://images.unsplash.com/photo-1591642425143-1fb5e1f9682b?w=800"],
      price_from: 1899,
      currency: "USD",
      visited_countries: [],
    },
    {
      id: "temp-4",
      name: "Inca Trail",
      slug: "ruta-incas",
      description: "Machu Picchu, Sacred Valley, Cusco and Lake Titicaca. Explore the Inca civilization on an 8-day magical journey.",
      images: ["https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800"],
      price_from: 1299,
      currency: "USD",
      visited_countries: [],
    },
    {
      id: "temp-5",
      name: "Dreamy Greek Islands",
      slug: "islas-griegas",
      description: "Santorini, Mykonos, Crete and Athens. White sandy beaches, unique architecture and Mediterranean cuisine.",
      images: ["https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800"],
      price_from: 1799,
      currency: "USD",
      visited_countries: [],
    },
  ],
};

export default function PackagesSlideLocomotive() {
  const locale = useLocale() as Locale;
  const router = useRouter();

  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const finishScrollRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch packages from Supabase + merge with hardcoded
  useEffect(() => {
    async function fetchPackages() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("packages")
          .select(`
            id,
            name,
            slug,
            description,
            images,
            price_from,
            currency,
            visited_countries
          `)
          .eq("locale", locale)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching packages:", error);
        }

        // 🔥 Combinar datos reales con hardcoded
        const realPackages = data || [];
        const hardcoded = hardcodedPackages[locale] || [];
        
        // Merge: primero los reales, luego los hardcoded
        setPackages([...realPackages, ...hardcoded]);
      } catch (err) {
        console.error("Unexpected error:", err);
        // En caso de error, usar solo hardcoded
        setPackages(hardcodedPackages[locale] || []);
      } finally {
        setLoading(false);
      }
    }

    fetchPackages();
  }, [locale]);

  // 🔥 Detectar mobile vs desktop
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsDesktop(!mobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // 🚂 Scroll horizontal
  useEffect(() => {
    if (
      isMobile ||
      !scrollContainerRef.current ||
      !carouselRef.current ||
      !sectionRef.current ||
      loading ||
      packages.length === 0
    )
      return;

    const section = sectionRef.current;
    const container = scrollContainerRef.current;
    const carousel = carouselRef.current;

    const calculateBounds = () => {
      const sectionRect = section.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const sectionTop = window.scrollY + sectionRect.top;
      const containerTop = window.scrollY + containerRect.top;

      const scrollDistance = carousel.scrollWidth - container.offsetWidth;
      const scrollStart = containerTop + containerRect.height - window.innerHeight;
      const totalHeight = scrollDistance + window.innerHeight;

      section.style.height = `${totalHeight}px`;

      const scrollEnd = scrollStart + scrollDistance;

      return { scrollDistance, scrollStart, scrollEnd };
    };

    let bounds = calculateBounds();

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const { scrollDistance, scrollStart, scrollEnd } = bounds;

      const progress = Math.min(
        Math.max((scrollY - scrollStart) / (scrollEnd - scrollStart), 0),
        1
      );

      if (scrollY >= scrollStart && scrollY <= scrollEnd) {
        container.style.position = "sticky";
        container.style.top = "0";

        const translateX = -progress * scrollDistance;
        carousel.style.transform = `translate3d(${translateX}px, 0, 0)`;
        carousel.style.willChange = "transform";
        container.style.opacity = "1";
      } else if (scrollY < scrollStart) {
        container.style.position = "relative";
        carousel.style.transform = `translate3d(0, 0, 0)`;
        container.style.opacity = "1";
      } else {
        container.style.position = "relative";
        carousel.style.transform = `translate3d(-${scrollDistance}px, 0, 0)`;
        container.style.opacity = "1";
      }
    };

    const handleResize = () => {
      bounds = calculateBounds();
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (carousel) {
        carousel.style.transform = "";
        carousel.style.willChange = "";
      }
      if (container) {
        container.style.position = "";
        container.style.opacity = "";
      }
      if (section) {
        section.style.height = "";
      }
    };
  }, [isMobile, packages.length, loading]);

  // 👆 Scroll mobile
  useEffect(() => {
    if (!isMobile || loading || packages.length === 0) return;

    const timeoutId = setTimeout(() => {
      const scrollElement = mobileScrollRef.current;
      if (!scrollElement) return;

      const handleScroll = () => {
        const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
        const maxScroll = scrollWidth - clientWidth;

        const cardWidth = 300;
        const newActiveIndex = Math.round(scrollLeft / cardWidth);
        setActiveCardIndex(Math.min(newActiveIndex, packages.length - 1));

        if (scrollLeft >= maxScroll - 5) {
          setIsAtEnd(true);
          setShowScrollIndicator(true);
        } else if (scrollLeft <= 5) {
          setIsAtEnd(false);
          setShowScrollIndicator(true);
        } else {
          setShowScrollIndicator(false);
        }
      };

      scrollElement.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      return () => {
        scrollElement.removeEventListener("scroll", handleScroll);
      };
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [isMobile, packages.length, loading]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-theme flex items-center justify-center">
        <div className="text-white text-xl">
          {locale === "es" ? "Cargando paquetes..." : "Loading packages..."}
        </div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="relative min-h-screen bg-gradient-theme flex items-center justify-center">
        <div className="text-white text-xl">
          {locale === "es"
            ? "No hay paquetes disponibles"
            : "No packages available"}
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="relative bg-gradient-theme">
      <>
        <div ref={scrollContainerRef} className="relative px-4 py-8">
          <ParticlesCanvas />

          <div className="relative mx-auto z-20 max-w-7xl">
            {/* 🎯 Header compacto */}
            <div className="text-center mb-8">
              <SplitText
                text={locale === "es" ? "Nuestros Paquetes" : "Our Packages"}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-theme-tittles mb-3 uppercase"
                delay={25}
                duration={0.5}
                splitType="chars"
                from={{ opacity: 0, y: 20 }}
                to={{ opacity: 1, y: 0 }}
                textAlign="center"
                threshold={0.3}
                rootMargin="-50px"
              />
              <p className="text-[var(--accent)] text-sm md:text-lg px-6">
                {locale === "es"
                  ? "Explora destinos increíbles alrededor del planeta"
                  : "Explore amazing destinations around the world"}
              </p>
            </div>

            {/* 🎨 Carousel Container */}
            <div className="relative">
              {/* 👉 Indicador de Scroll - SOLO MOBILE */}
              {isMobile && showScrollIndicator && (
                <div
                  className={`absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none transition-all duration-300 ${
                    isAtEnd ? "left-0" : "right-0"
                  }`}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg animate-pulse">
                    {isAtEnd ? (
                      <FaChevronLeft className="text-slate-900 text-xl" />
                    ) : (
                      <FaChevronRight className="text-slate-900 text-xl" />
                    )}
                  </div>
                </div>
              )}

              {/* 🎨 Carousel */}
              <div
                ref={mobileScrollRef}
                className={`${
                  isMobile
                    ? "overflow-x-auto snap-x snap-mandatory -mx-4 px-4"
                    : "overflow-hidden"
                }`}
                style={
                  isMobile
                    ? {
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        WebkitOverflowScrolling: "touch",
                      }
                    : {}
                }
              >
                <div
                  ref={carouselRef}
                  className={`flex gap-6 md:gap-8 ${isMobile ? "pb-4" : ""}`}
                >
                  {/* 🗺️ Packages Cards */}
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="min-w-[280px] w-[280px] sm:min-w-[300px] sm:w-[300px] md:min-w-[350px] md:w-[350px] flex-shrink-0"
                    >
                      <div className="bg-white/5 rounded-2xl overflow-hidden relative h-full">
                        <img
                          src={pkg.images?.[0] || "/placeholder-package.jpg"}
                          className="w-full h-80 object-cover"
                          draggable={false}
                          alt={pkg.name}
                        />

                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                          <div className="flex justify-end">
                            <div className="bg-white/20 rounded-full p-3">
                              <FaSuitcase className="text-white text-2xl" />
                            </div>
                          </div>

                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {pkg.name}
                            </h3>

                            <p className="text-slate-200 text-sm mb-4 line-clamp-2">
                              {pkg.description}
                            </p>

                            <button
                              onClick={() =>
                                router.push(`/${locale}/paquetes/${pkg.slug}`)
                              }
                              className="bg-white text-slate-900 px-5 py-2 rounded-full font-semibold"
                            >
                              {locale === "es" ? "Ver paquete" : "View package"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 📱 Mobile scroll indicator */}
            {isMobile && packages.length > 2 && (
              <div className="flex justify-center gap-3 mt-6">
                {packages.map((_, index) => {
                  const isActive = index === activeCardIndex;

                  return (
                    <div
                      key={index}
                      className={`rounded-full transition-all duration-500 ease-in-out ${
                        isActive
                          ? "w-3 h-3 bg-theme-accent shadow-lg scale-110"
                          : "w-2.5 h-2.5 bg-white/40"
                      }`}
                    />
                  );
                })}
              </div>
            )}

            {/* 🎯 CTA Button - Punto de finalización */}
            <div ref={finishScrollRef} className="flex justify-center mt-8">
              <ButtonArrow
                title={
                  locale === "es"
                    ? "Ver mas paquetes"
                    : "View more packages"
                }
              />
            </div>
          </div>
        </div>
      </>
    </div>
  );
}