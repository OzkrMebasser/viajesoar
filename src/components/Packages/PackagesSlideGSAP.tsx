"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaSuitcase, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import SplitText from "@/components/SplitText";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import ButtonArrow from "@/components/ui/ButtonArrow";
import { supabase } from "@/lib/supabase";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
      description:
        "Descubre los templos ancestrales y la cultura milenaria de Tailandia, Camboya y Vietnam en 14 días inolvidables.",
      images: [
        "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800",
      ],
      price_from: 2199,
      currency: "USD",
      visited_countries: [],
    },
    {
      id: "temp-2",
      name: "Safari Africano Premium",
      slug: "safari-africano-premium",
      description:
        "Vive la aventura africana con safaris fotográficos en Kenia y Tanzania. Incluye los Big 5 y playas de Zanzíbar.",
      images: [
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
      ],
      price_from: 3499,
      currency: "USD",
      visited_countries: [],
    },
    {
      id: "temp-3",
      name: "Patagonia Extrema",
      slug: "patagonia-extrema",
      description:
        "Glaciares milenarios, montañas imponentes y lagos turquesa. Recorre Argentina y Chile en esta aventura de 10 días.",
      images: [
        "https://images.unsplash.com/photo-1591642425143-1fb5e1f9682b?w=800",
      ],
      price_from: 1899,
      currency: "USD",
      visited_countries: [],
    },
    {
      id: "temp-4",
      name: "Ruta de los Incas",
      slug: "ruta-incas",
      description:
        "Machu Picchu, Valle Sagrado, Cusco y el Lago Titicaca. Explora la civilización Inca en 8 días mágicos.",
      images: [
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
      ],
      price_from: 1299,
      currency: "USD",
      visited_countries: [],
    },
    {
      id: "temp-5",
      name: "Islas Griegas de Ensueño",
      slug: "islas-griegas",
      description:
        "Santorini, Mykonos, Creta y Atenas. Playas de arena blanca, arquitectura única y gastronomía mediterránea.",
      images: [
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
      ],
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
      description:
        "Discover ancient temples and millennial culture in Thailand, Cambodia and Vietnam on an unforgettable 14-day journey.",
      images: [
        "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800",
      ],
      price_from: 2199,
      currency: "USD",
      visited_countries: [],
    },
    {
      id: "temp-2",
      name: "Premium African Safari",
      slug: "safari-africano-premium",
      description:
        "Live the African adventure with photo safaris in Kenya and Tanzania. Includes the Big 5 and Zanzibar beaches.",
      images: [
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
      ],
      price_from: 3499,
      currency: "USD",
      visited_countries: [],
    },
    {
      id: "temp-3",
      name: "Extreme Patagonia",
      slug: "patagonia-extrema",
      description:
        "Ancient glaciers, imposing mountains and turquoise lakes. Explore Argentina and Chile on this 10-day adventure.",
      images: [
        "https://images.unsplash.com/photo-1591642425143-1fb5e1f9682b?w=800",
      ],
      price_from: 1899,
      currency: "USD",
      visited_countries: [],
    },
    {
      id: "temp-4",
      name: "Inca Trail",
      slug: "ruta-incas",
      description:
        "Machu Picchu, Sacred Valley, Cusco and Lake Titicaca. Explore the Inca civilization on an 8-day magical journey.",
      images: [
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
      ],
      price_from: 1299,
      currency: "USD",
      visited_countries: [],
    },
    {
      id: "temp-5",
      name: "Dreamy Greek Islands",
      slug: "islas-griegas",
      description:
        "Santorini, Mykonos, Crete and Athens. White sandy beaches, unique architecture and Mediterranean cuisine.",
      images: [
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
      ],
      price_from: 1799,
      currency: "USD",
      visited_countries: [],
    },
  ],
};

export default function PackagesSlideGSAP() {
  const locale = useLocale() as Locale;
  const router = useRouter();

  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
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
          .select(
            `
            id,
            name,
            slug,
            description,
            images,
            price_from,
            currency,
            visited_countries
          `,
          )
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
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // 🎨 GSAP Scroll Horizontal INVERSO (derecha a izquierda) - SOLO DESKTOP
  // useEffect(() => {
  //   if (isMobile || loading || packages.length === 0) return;

  //   const section = sectionRef.current;
  //   const carousel = carouselRef.current;
  //   const container = scrollContainerRef.current;

  //   if (!section || !carousel || !container) return;

  //   // Esperar a que el DOM esté listo
  //   const timer = setTimeout(() => {
  //     const scrollDistance = carousel.scrollWidth - container.offsetWidth;

  //     // 🔥 Posicionar el carousel al FINAL (derecha) inicialmente
  //     gsap.set(carousel, { x: -scrollDistance });

  //     // 🔥 Timeline con ScrollTrigger - DIRECCIÓN INVERSA
  //     const tl = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: section,
  //         start: "top top",
  //         end: () => `+=${scrollDistance + 500}`, // Distancia total + espacio para fade
  //         scrub: 1,
  //         pin: container,
  //         anticipatePin: 1,
  //         invalidateOnRefresh: true,
  //       },
  //     });

  //     // Animación del carousel de DERECHA a IZQUIERDA (de -scrollDistance a 0)
  //     tl.to(carousel, {
  //       x: 0, // 👈 Termina en posición 0 (izquierda)
  //       ease: "none",
  //     })
  //     // Fade out al final
  //     .to(
  //       container,
  //       {
  //         opacity: 0.6,
  //         scale: 0.97,
  //         ease: "power1.in",
  //       },
  //       "-=0.3"
  //     );

  //   }, 100);

  //   return () => {
  //     clearTimeout(timer);
  //     ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  //   };
  // }, [isMobile, loading, packages.length]);
  // 🎨 GSAP Scroll Horizontal INVERSO (derecha a izquierda) - SOLO DESKTOP// 🎨 GSAP Scroll Horizontal INVERSO - SOLO DESKTOP
  useEffect(() => {
    if (isMobile || loading || packages.length === 0) return;

    const section = sectionRef.current;
    const carousel = carouselRef.current;
    const container = scrollContainerRef.current;

    if (!section || !carousel || !container) return;

    // Limpiar ScrollTriggers previos de esta sección
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.id === "packages-scroll") {
        trigger.kill();
      }
    });

    const timer = setTimeout(() => {
      const scrollDistance = carousel.scrollWidth - container.offsetWidth;

      gsap.set(carousel, { x: -scrollDistance });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance + 500}`,
          scrub: 1,
          pin: container,
          pinSpacing: true, // 👈 IMPORTANTE: Agrega espacio después del pin
          anticipatePin: 1,
          invalidateOnRefresh: true,
          id: "packages-scroll",
          markers: false, // 👈 Cambia a true para debugging
        },
      });

      tl.to(carousel, {
        x: 0,
        ease: "none",
      }).to(
      container,
        {
          scale: 0,
          ease: "power1.in"
        },
        "-=0.02",
      );
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.id === "packages-scroll") {
          trigger.kill();
        }
      });
    };
  }, [isMobile, loading, packages.length]);
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
      <div className="relative min-h-screen bg-gradient-theme flex items-center justify-center py-8">
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
      <div
        ref={scrollContainerRef}
        className="relative px-4 py-8 overflow-hidden"
        style={{ minHeight: isMobile ? "" : "100vh" }}
      >
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
                  : "overflow-visible"
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
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              <div
                ref={carouselRef}
                className={`flex gap-6 md:gap-8 ${isMobile ? "pb-4" : ""}`}
              >
                {/* 🗺️ Packages Cards */}
                {packages.map((pkg, index) => (
                  <div
                    key={pkg.id}
                    className={`
                      min-w-[280px] w-[280px] 
                      sm:min-w-[300px] sm:w-[300px]
                      md:min-w-[350px] md:w-[350px] 
                      flex-shrink-0
                      ${isMobile ? "snap-center" : ""}
                    `}
                  >
                    <div className="bg-white/5 rounded-2xl overflow-hidden relative group h-full">
                      <div className="relative h-80">
                        <img
                          src={pkg.images?.[0] || "/placeholder-package.jpg"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          draggable={false}
                          alt={pkg.name}
                          loading={index < 3 ? "eager" : "lazy"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      </div>

                      <div className="absolute inset-0 p-6 flex flex-col justify-between">
                        <div className="flex justify-end">
                          <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
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
                            className="bg-white text-slate-900 px-5 py-2 rounded-full font-semibold hover:bg-slate-100 transition-colors duration-300"
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

          {/* 🎯 CTA Button */}
          <div className="flex justify-center mt-8">
            <ButtonArrow
              title={
                locale === "es" ? "Ver mas paquetes" : "View more packages"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
//**
// const hardcodedPackages: Record<Locale, HardcodedPackage[]> = {
//   es: [
//     {
//       id: "1",
//       name: "Mega Europa iniciando en Barcelona",
//       slug: "mega-europa-vs-mt-12017",
//       description:
//         "Circuito europeo de 17 días iniciando en Barcelona, visitando Francia e Italia con visitas panorámicas y tiempo libre.",
//       images: [
//         "https://one.cdnmega.com/images/viajes/covers/12341-mega-europa-desde-barcelona-1024x575-68dc5e3513363_68e0d068b099f.webp",
//       ],
//       price_from: 1499,
//       currency: "USD",
//       visited_countries: [
//         { name: "España" },
//         { name: "Francia" },
//         { name: "Italia" },
//       ],
//     },
//     {
//       id: "2",
//       name: "Maravillas de Asia",
//       slug: "maravillas-asia",
//       description:
//         "Descubre los templos ancestrales y la cultura milenaria de Tailandia, Camboya y Vietnam en 14 días inolvidables.",
//       images: [
//         "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800",
//       ],
//       price_from: 2199,
//       currency: "USD",
//       visited_countries: [
//         { name: "Tailandia" },
//         { name: "Camboya" },
//         { name: "Vietnam" },
//       ],
//     },
//     {
//       id: "3",
//       name: "Safari Africano Premium",
//       slug: "safari-africano-premium",
//       description:
//         "Vive la aventura africana con safaris fotográficos en Kenia y Tanzania. Incluye los Big 5 y playas de Zanzíbar.",
//       images: [
//         "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
//       ],
//       price_from: 3499,
//       currency: "USD",
//       visited_countries: [{ name: "Kenia" }, { name: "Tanzania" }],
//     },
//     {
//       id: "4",
//       name: "Japón Tradicional y Moderno",
//       slug: "japon-tradicional-moderno",
//       description:
//         "Sumérgete en la fascinante mezcla de tradición y tecnología. Tokio, Kioto, Osaka y Monte Fuji en 12 días.",
//       images: [
//         "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
//       ],
//       price_from: 2899,
//       currency: "USD",
//       visited_countries: [{ name: "Japón" }],
//     },
//     {
//       id: "5",
//       name: "Patagonia Extrema",
//       slug: "patagonia-extrema",
//       description:
//         "Glaciares milenarios, montañas imponentes y lagos turquesa. Recorre Argentina y Chile en esta aventura de 10 días.",
//       images: [
//         "https://images.unsplash.com/photo-1591642425143-1fb5e1f9682b?w=800",
//       ],
//       price_from: 1899,
//       currency: "USD",
//       visited_countries: [{ name: "Argentina" }, { name: "Chile" }],
//     },
//     {
//       id: "6",
//       name: "Ruta de los Incas",
//       slug: "ruta-incas",
//       description:
//         "Machu Picchu, Valle Sagrado, Cusco y el Lago Titicaca. Explora la civilización Inca en 8 días mágicos.",
//       images: [
//         "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
//       ],
//       price_from: 1299,
//       currency: "USD",
//       visited_countries: [{ name: "Perú" }],
//     },
//     {
//       id: "7",
//       name: "Islas Griegas de Ensueño",
//       slug: "islas-griegas",
//       description:
//         "Santorini, Mykonos, Creta y Atenas. Playas de arena blanca, arquitectura única y gastronomía mediterránea.",
//       images: [
//         "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
//       ],
//       price_from: 1799,
//       currency: "USD",
//       visited_countries: [{ name: "Grecia" }],
//     },
//   ],
//   en: [
//     {
//       id: "1",
//       name: "Mega Europe starting in Barcelona",
//       slug: "mega-europa-vs-mt-12017",
//       description:
//         "17-day European tour starting in Barcelona, visiting France and Italy with panoramic tours and free time.",
//       images: [
//         "https://one.cdnmega.com/images/viajes/covers/12341-mega-europa-desde-barcelona-1024x575-68dc5e3513363_68e0d068b099f.webp",
//       ],
//       price_from: 1499,
//       currency: "USD",
//       visited_countries: [
//         { name: "Spain" },
//         { name: "France" },
//         { name: "Italy" },
//       ],
//     },
//     {
//       id: "2",
//       name: "Asian Wonders",
//       slug: "maravillas-asia",
//       description:
//         "Discover ancient temples and millennial culture in Thailand, Cambodia and Vietnam on an unforgettable 14-day journey.",
//       images: [
//         "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800",
//       ],
//       price_from: 2199,
//       currency: "USD",
//       visited_countries: [
//         { name: "Thailand" },
//         { name: "Cambodia" },
//         { name: "Vietnam" },
//       ],
//     },
//     {
//       id: "3",
//       name: "Premium African Safari",
//       slug: "safari-africano-premium",
//       description:
//         "Live the African adventure with photo safaris in Kenya and Tanzania. Includes the Big 5 and Zanzibar beaches.",
//       images: [
//         "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
//       ],
//       price_from: 3499,
//       currency: "USD",
//       visited_countries: [{ name: "Kenya" }, { name: "Tanzania" }],
//     },
//     {
//       id: "4",
//       name: "Traditional & Modern Japan",
//       slug: "japon-tradicional-moderno",
//       description:
//         "Immerse yourself in the fascinating blend of tradition and technology. Tokyo, Kyoto, Osaka and Mount Fuji in 12 days.",
//       images: [
//         "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
//       ],
//       price_from: 2899,
//       currency: "USD",
//       visited_countries: [{ name: "Japan" }],
//     },
//     {
//       id: "5",
//       name: "Extreme Patagonia",
//       slug: "patagonia-extrema",
//       description:
//         "Ancient glaciers, imposing mountains and turquoise lakes. Explore Argentina and Chile on this 10-day adventure.",
//       images: [
//         "https://images.unsplash.com/photo-1591642425143-1fb5e1f9682b?w=800",
//       ],
//       price_from: 1899,
//       currency: "USD",
//       visited_countries: [{ name: "Argentina" }, { name: "Chile" }],
//     },
//     {
//       id: "6",
//       name: "Inca Trail",
//       slug: "ruta-incas",
//       description:
//         "Machu Picchu, Sacred Valley, Cusco and Lake Titicaca. Explore the Inca civilization on an 8-day magical journey.",
//       images: [
//         "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
//       ],
//       price_from: 1299,
//       currency: "USD",
//       visited_countries: [{ name: "Peru" }],
//     },
//     {
//       id: "7",
//       name: "Dreamy Greek Islands",
//       slug: "islas-griegas",
//       description:
//         "Santorini, Mykonos, Crete and Athens. White sandy beaches, unique architecture and Mediterranean cuisine.",
//       images: [
//         "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
//       ],
//       price_from: 1799,
//       currency: "USD",
//       visited_countries: [{ name: "Greece" }],
//     },
//   ],
// };

/**/

// "use client";
// import { useTheme } from "@/lib/context/ThemeContext";

// import React, { useEffect, useRef, useState } from "react";
// import { MdTravelExplore, MdAttachMoney } from "react-icons/md";
// import { FaSuitcase, FaMapMarkedAlt } from "react-icons/fa";
// import { useRouter } from "next/navigation";
// import SplitText from "@/components/SplitText";
// import { useLocale } from "next-intl";
// import ParticlesCanvas from "@/components/ParticlesCanvas";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// type Locale = "es" | "en";

// interface HardcodedPackage {
//   id: string;
//   name: string;
//   slug: string;
//   description: string;
//   images: string[];
//   price_from: number;
//   currency: string;
//   visited_countries: { name: string }[];
// }

// export default function PackagesSlideGSAP() {
//   const locale = useLocale() as Locale;
//   const router = useRouter();
//   const { theme } = useTheme();

//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const carouselRef = useRef<HTMLDivElement>(null);
//   const mobileScrollRef = useRef<HTMLDivElement>(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isDesktop, setIsDesktop] = useState(false);
//   const [hasScrolled, setHasScrolled] = useState(false);

//   // 🎯 Datos hardcodeados temporales
//   const hardcodedPackages: Record<Locale, HardcodedPackage[]> = {
//     es: [
//       {
//         id: "1",
//         name: "Mega Europa iniciando en Barcelona",
//         slug: "mega-europa-vs-mt-12017",
//         description:
//           "Circuito europeo de 17 días iniciando en Barcelona, visitando Francia e Italia con visitas panorámicas y tiempo libre.",
//         images: [
//           "https://one.cdnmega.com/images/viajes/covers/12341-mega-europa-desde-barcelona-1024x575-68dc5e3513363_68e0d068b099f.webp",
//         ],
//         price_from: 1499,
//         currency: "USD",
//         visited_countries: [
//           { name: "España" },
//           { name: "Francia" },
//           { name: "Italia" },
//         ],
//       },
//       {
//         id: "2",
//         name: "Maravillas de Asia",
//         slug: "maravillas-asia",
//         description:
//           "Descubre los templos ancestrales y la cultura milenaria de Tailandia, Camboya y Vietnam en 14 días inolvidables.",
//         images: [
//           "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800",
//         ],
//         price_from: 2199,
//         currency: "USD",
//         visited_countries: [
//           { name: "Tailandia" },
//           { name: "Camboya" },
//           { name: "Vietnam" },
//         ],
//       },
//       {
//         id: "3",
//         name: "Safari Africano Premium",
//         slug: "safari-africano-premium",
//         description:
//           "Vive la aventura africana con safaris fotográficos en Kenia y Tanzania. Incluye los Big 5 y playas de Zanzíbar.",
//         images: [
//           "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
//         ],
//         price_from: 3499,
//         currency: "USD",
//         visited_countries: [{ name: "Kenia" }, { name: "Tanzania" }],
//       },
//       {
//         id: "4",
//         name: "Japón Tradicional y Moderno",
//         slug: "japon-tradicional-moderno",
//         description:
//           "Sumérgete en la fascinante mezcla de tradición y tecnología. Tokio, Kioto, Osaka y Monte Fuji en 12 días.",
//         images: [
//           "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
//         ],
//         price_from: 2899,
//         currency: "USD",
//         visited_countries: [{ name: "Japón" }],
//       },
//       {
//         id: "5",
//         name: "Patagonia Extrema",
//         slug: "patagonia-extrema",
//         description:
//           "Glaciares milenarios, montañas imponentes y lagos turquesa. Recorre Argentina y Chile en esta aventura de 10 días.",
//         images: [
//           "https://images.unsplash.com/photo-1591642425143-1fb5e1f9682b?w=800",
//         ],
//         price_from: 1899,
//         currency: "USD",
//         visited_countries: [{ name: "Argentina" }, { name: "Chile" }],
//       },
//       {
//         id: "6",
//         name: "Ruta de los Incas",
//         slug: "ruta-incas",
//         description:
//           "Machu Picchu, Valle Sagrado, Cusco y el Lago Titicaca. Explora la civilización Inca en 8 días mágicos.",
//         images: [
//           "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
//         ],
//         price_from: 1299,
//         currency: "USD",
//         visited_countries: [{ name: "Perú" }],
//       },
//       {
//         id: "7",
//         name: "Islas Griegas de Ensueño",
//         slug: "islas-griegas",
//         description:
//           "Santorini, Mykonos, Creta y Atenas. Playas de arena blanca, arquitectura única y gastronomía mediterránea.",
//         images: [
//           "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
//         ],
//         price_from: 1799,
//         currency: "USD",
//         visited_countries: [{ name: "Grecia" }],
//       },
//     ],
//     en: [
//       {
//         id: "1",
//         name: "Mega Europe starting in Barcelona",
//         slug: "mega-europa-vs-mt-12017",
//         description:
//           "17-day European tour starting in Barcelona, visiting France and Italy with panoramic tours and free time.",
//         images: [
//           "https://one.cdnmega.com/images/viajes/covers/12341-mega-europa-desde-barcelona-1024x575-68dc5e3513363_68e0d068b099f.webp",
//         ],
//         price_from: 1499,
//         currency: "USD",
//         visited_countries: [
//           { name: "Spain" },
//           { name: "France" },
//           { name: "Italy" },
//         ],
//       },
//       {
//         id: "2",
//         name: "Asian Wonders",
//         slug: "maravillas-asia",
//         description:
//           "Discover ancient temples and millennial culture in Thailand, Cambodia and Vietnam on an unforgettable 14-day journey.",
//         images: [
//           "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800",
//         ],
//         price_from: 2199,
//         currency: "USD",
//         visited_countries: [
//           { name: "Thailand" },
//           { name: "Cambodia" },
//           { name: "Vietnam" },
//         ],
//       },
//       {
//         id: "3",
//         name: "Premium African Safari",
//         slug: "safari-africano-premium",
//         description:
//           "Live the African adventure with photo safaris in Kenya and Tanzania. Includes the Big 5 and Zanzibar beaches.",
//         images: [
//           "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
//         ],
//         price_from: 3499,
//         currency: "USD",
//         visited_countries: [{ name: "Kenya" }, { name: "Tanzania" }],
//       },
//       {
//         id: "4",
//         name: "Traditional & Modern Japan",
//         slug: "japon-tradicional-moderno",
//         description:
//           "Immerse yourself in the fascinating blend of tradition and technology. Tokyo, Kyoto, Osaka and Mount Fuji in 12 days.",
//         images: [
//           "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
//         ],
//         price_from: 2899,
//         currency: "USD",
//         visited_countries: [{ name: "Japan" }],
//       },
//       {
//         id: "5",
//         name: "Extreme Patagonia",
//         slug: "patagonia-extrema",
//         description:
//           "Ancient glaciers, imposing mountains and turquoise lakes. Explore Argentina and Chile on this 10-day adventure.",
//         images: [
//           "https://images.unsplash.com/photo-1591642425143-1fb5e1f9682b?w=800",
//         ],
//         price_from: 1899,
//         currency: "USD",
//         visited_countries: [{ name: "Argentina" }, { name: "Chile" }],
//       },
//       {
//         id: "6",
//         name: "Inca Trail",
//         slug: "ruta-incas",
//         description:
//           "Machu Picchu, Sacred Valley, Cusco and Lake Titicaca. Explore the Inca civilization on an 8-day magical journey.",
//         images: [
//           "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
//         ],
//         price_from: 1299,
//         currency: "USD",
//         visited_countries: [{ name: "Peru" }],
//       },
//       {
//         id: "7",
//         name: "Dreamy Greek Islands",
//         slug: "islas-griegas",
//         description:
//           "Santorini, Mykonos, Crete and Athens. White sandy beaches, unique architecture and Mediterranean cuisine.",
//         images: [
//           "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
//         ],
//         price_from: 1799,
//         currency: "USD",
//         visited_countries: [{ name: "Greece" }],
//       },
//     ],
//   };

//   const limitedPackages = hardcodedPackages[locale].slice(0, 7);

//   // 🔥 Detectar mobile vs desktop
//   useEffect(() => {
//     const checkDevice = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       setIsDesktop(!mobile);
//     };

//     checkDevice();
//     window.addEventListener("resize", checkDevice);
//     return () => window.removeEventListener("resize", checkDevice);
//   }, []);

//   // 🔥 GSAP Horizontal Scroll RTL (derecha a izquierda) - SOLO EN DESKTOP
//   useEffect(() => {
//     if (!carouselRef.current || !scrollContainerRef.current || !isDesktop) {
//       return;
//     }

//     const carousel = carouselRef.current;
//     const scrollContainer = scrollContainerRef.current;

//     // Calcular distancia de scroll
//     const carouselWidth = carousel.scrollWidth;
//     const containerWidth = scrollContainer.offsetWidth;
//     const scrollDistance = carouselWidth - containerWidth;

//     // Solo crear animación si hay contenido para scrollear
//     if (scrollDistance <= 0) return;

//     // 🎨 Crear animación GSAP - INVERTIDA (positivo = hacia la derecha)
//     const scrollTween = gsap.to(carousel, {
//       x: scrollDistance, // 👈 POSITIVO para scroll RTL (derecha a izquierda visual)
//       ease: "none",
//       scrollTrigger: {
//         trigger: scrollContainer,
//         start: "center top",
//         end: "70% bottom",
//         id: "packages-scroll",
//         scrub: 1,
//         pin: true,
//         anticipatePin: 1,
//         invalidateOnRefresh: false,
//       },
//     });

//     // 🧹 Cleanup
//     return () => {
//       scrollTween.kill();
//       ScrollTrigger.getAll().forEach((trigger) => {
//         if (trigger.trigger === scrollContainer) {
//           trigger.kill();
//         }
//       });
//     };
//   }, [isDesktop, limitedPackages.length]);

//   // 🌊 Efecto de Peek/Tilt/Ola INVERTIDO - SOLO EN MOBILE
//   useEffect(() => {
//     if (!isMobile || !mobileScrollRef.current || hasScrolled) return;

//     const scrollElement = mobileScrollRef.current;

//     // Observer para detectar cuando el carousel es visible
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && !hasScrolled) {
//           setTimeout(() => {
//             if (!hasScrolled) {
//               // Calcular el ancho total del scroll
//               const maxScroll = scrollElement.scrollWidth - scrollElement.clientWidth;

//               // 🌊 Animación de "peek" INVERTIDA - mueve hacia el final (derecha) y vuelve
//               gsap.to(scrollElement, {
//                 scrollLeft: -80, // Límite seguro
//                 duration: 0.8,
//                 ease: "power2.out",
//                 onComplete: () => {
//                   // Volver al inicio suavemente
//                   gsap.to(scrollElement, {
//                     scrollLeft: 0,
//                     duration: 0.6,
//                     ease: "power2.inOut",
//                     delay: 0.3,
//                   });
//                 },
//               });
//             }
//           }, 600);
//         }
//       },
//       { threshold: 0.3 }
//     );

//     observer.observe(scrollElement);

//     const handleScroll = () => {
//       if (scrollElement.scrollLeft < 5) {
//         setHasScrolled(true);
//       }
//     };

//     scrollElement.addEventListener("scroll", handleScroll, { passive: true });

//     return () => {
//       observer.disconnect();
//       scrollElement.removeEventListener("scroll", handleScroll);
//     };
//   }, [isMobile, hasScrolled]);

//   return (
//     <div
//       ref={scrollContainerRef}
//       className="relative min-h-screen py-16 px-4 overflow-hidden bg-gradient-theme"
//     >
//       {/* Particles Background */}
//       <ParticlesCanvas />

//       <div className="relative max-w-8xl mx-auto z-20 ">
//         {/* 🎯 Header con SplitText */}
//         <div className="text-center mb-10">
//           <SplitText
//             text={locale === "es" ? "Paquetes Turísticos" : "Travel Packages"}
//             className="text-2xl sm:text-4xl md:text-7xl font-semibold text-theme-tittles mb-4 uppercase"
//             delay={50}
//             duration={0.5}
//             ease="power2.out"
//             splitType="chars"
//             from={{ opacity: 0, y: 20 }}
//             to={{ opacity: 1, y: 0 }}
//             textAlign="center"
//           />
//           <p className="text-[var(--accent)] text-base md:text-xl px-6">
//             {locale === "es"
//               ? "Vive experiencias únicas con nuestros paquetes diseñados para ti"
//               : "Live unique experiences with our packages designed for you"}
//           </p>
//         </div>

//         {/* 🎨 Carousel - Híbrido: nativo mobile / GSAP desktop */}
//         <div
//           ref={isMobile ? mobileScrollRef : undefined}
//           className={`
//             ${isMobile ? "overflow-x-auto overflow-y-hidden" : "overflow-hidden"}
//             ${isMobile ? "snap-x snap-mandatory scroll-smooth" : ""}
//             ${isMobile ? "-mx-4 px-4" : ""}
//           `}
//         >
//           <style jsx>{`
//             div::-webkit-scrollbar {
//               display: none;
//             }
//           `}</style>

//           <div
//             ref={carouselRef}
//             className={`
//               flex gap-6 md:gap-8
//               ${!isMobile ? "will-change-transform" : ""}
//               ${isMobile ? "pb-4" : ""}
//             `}
//           >
//             {/* 📦 Package Cards */}
//             {limitedPackages.map((pkg) => {
//               const mainImage = pkg.images?.[0] || "/placeholder-package.jpg";

//               return (
//                 <div
//                   key={pkg.id}
//                   className={`
//                     min-w-[280px] w-[280px]
//                     sm:min-w-[300px] sm:w-[300px]
//                     md:min-w-[350px] md:w-[350px]
//                     flex-shrink-0
//                     ${isMobile ? "snap-center" : ""}
//                   `}
//                 >
//                   <div className="bg-white/5 rounded-2xl overflow-hidden relative group h-full">
//                     {/* Image */}
//                     <div className="relative h-80">
//                       <img
//                         src={mainImage}
//                         alt={pkg.name}
//                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                         draggable={false}
//                         loading="lazy"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

//                       {/* Price Badge */}
//                       <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
//                         <div className="flex items-center gap-1 text-white font-bold">
//                           <MdAttachMoney className="text-xl" />
//                           <span>
//                             {pkg.price_from.toLocaleString()} {pkg.currency}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Content Overlay */}
//                     <div className="absolute inset-0 p-6 flex flex-col justify-between">
//                       {/* Icon */}
//                       <div className="flex justify-end">
//                         <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
//                           <FaSuitcase className="text-white text-2xl" />
//                         </div>
//                       </div>

//                       {/* Text & Button */}
//                       <div>
//                         <h3 className="text-2xl font-bold text-white mb-2">
//                           {pkg.name}
//                         </h3>
//                         <p className="text-slate-200 text-sm mb-4 line-clamp-2">
//                           {pkg.description}
//                         </p>

//                         {/* Visited Countries */}
//                         {pkg.visited_countries &&
//                           pkg.visited_countries.length > 0 && (
//                             <div className="flex items-center gap-1 text-slate-300 text-xs mb-3">
//                               <FaMapMarkedAlt />
//                               <span>
//                                 {pkg.visited_countries
//                                   .slice(0, 2)
//                                   .map((c) => c.name)
//                                   .join(", ")}
//                                 {pkg.visited_countries.length > 2 && "..."}
//                               </span>
//                             </div>
//                           )}

//                         <button
//                           onClick={() => {
//                             const basePath =
//                               locale === "es" ? "paquetes" : "packages";
//                             router.push(`/${locale}/${basePath}/${pkg.slug}`);
//                           }}
//                           className="bg-white text-slate-900 px-5 py-2 rounded-full font-semibold hover:bg-slate-100 transition-colors duration-300"
//                         >
//                           {locale === "es" ? "Ver Detalles" : "View Details"}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* 📱 Mobile scroll indicator */}
//         {isMobile && limitedPackages.length > 2 && (
//           <div className="flex justify-center gap-2 mt-6">
//             {limitedPackages.map((_, index) => (
//               <div key={index} className="w-2 h-2 rounded-full bg-white/30" />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
