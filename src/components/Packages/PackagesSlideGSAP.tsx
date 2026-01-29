"use client";
import { useTheme } from "@/lib/context/ThemeContext";

import React, { useEffect, useRef, useState } from "react";
import { MdTravelExplore, MdAttachMoney } from "react-icons/md";
import { FaSuitcase, FaMapMarkedAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import SplitText from "@/components/SplitText";
import { useLocale } from "next-intl";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Locale = "es" | "en";

interface HardcodedPackage {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  price_from: number;
  currency: string;
  visited_countries: { name: string }[];
}

export default function PackagesSlideGSAP() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { theme } = useTheme();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // 🎯 Datos hardcodeados temporales
  const hardcodedPackages: Record<Locale, HardcodedPackage[]> = {
    es: [
      {
        id: "1",
        name: "Mega Europa iniciando en Barcelona",
        slug: "mega-europa-vs-mt-12017",
        description: "Circuito europeo de 17 días iniciando en Barcelona, visitando Francia e Italia con visitas panorámicas y tiempo libre.",
        images: ["https://one.cdnmega.com/images/viajes/covers/12341-mega-europa-desde-barcelona-1024x575-68dc5e3513363_68e0d068b099f.webp"],
        price_from: 1499,
        currency: "USD",
        visited_countries: [{ name: "España" }, { name: "Francia" }, { name: "Italia" }]
      },
      {
        id: "2",
        name: "Maravillas de Asia",
        slug: "maravillas-asia",
        description: "Descubre los templos ancestrales y la cultura milenaria de Tailandia, Camboya y Vietnam en 14 días inolvidables.",
        images: ["https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800"],
        price_from: 2199,
        currency: "USD",
        visited_countries: [{ name: "Tailandia" }, { name: "Camboya" }, { name: "Vietnam" }]
      },
      {
        id: "3",
        name: "Safari Africano Premium",
        slug: "safari-africano-premium",
        description: "Vive la aventura africana con safaris fotográficos en Kenia y Tanzania. Incluye los Big 5 y playas de Zanzíbar.",
        images: ["https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800"],
        price_from: 3499,
        currency: "USD",
        visited_countries: [{ name: "Kenia" }, { name: "Tanzania" }]
      },
      {
        id: "4",
        name: "Japón Tradicional y Moderno",
        slug: "japon-tradicional-moderno",
        description: "Sumérgete en la fascinante mezcla de tradición y tecnología. Tokio, Kioto, Osaka y Monte Fuji en 12 días.",
        images: ["https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800"],
        price_from: 2899,
        currency: "USD",
        visited_countries: [{ name: "Japón" }]
      },
      {
        id: "5",
        name: "Patagonia Extrema",
        slug: "patagonia-extrema",
        description: "Glaciares milenarios, montañas imponentes y lagos turquesa. Recorre Argentina y Chile en esta aventura de 10 días.",
        images: ["https://images.unsplash.com/photo-1591642425143-1fb5e1f9682b?w=800"],
        price_from: 1899,
        currency: "USD",
        visited_countries: [{ name: "Argentina" }, { name: "Chile" }]
      },
      {
        id: "6",
        name: "Ruta de los Incas",
        slug: "ruta-incas",
        description: "Machu Picchu, Valle Sagrado, Cusco y el Lago Titicaca. Explora la civilización Inca en 8 días mágicos.",
        images: ["https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800"],
        price_from: 1299,
        currency: "USD",
        visited_countries: [{ name: "Perú" }]
      },
      {
        id: "7",
        name: "Islas Griegas de Ensueño",
        slug: "islas-griegas",
        description: "Santorini, Mykonos, Creta y Atenas. Playas de arena blanca, arquitectura única y gastronomía mediterránea.",
        images: ["https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800"],
        price_from: 1799,
        currency: "USD",
        visited_countries: [{ name: "Grecia" }]
      }
    ],
    en: [
      {
        id: "1",
        name: "Mega Europe starting in Barcelona",
        slug: "mega-europa-vs-mt-12017",
        description: "17-day European tour starting in Barcelona, visiting France and Italy with panoramic tours and free time.",
        images: ["https://one.cdnmega.com/images/viajes/covers/12341-mega-europa-desde-barcelona-1024x575-68dc5e3513363_68e0d068b099f.webp"],
        price_from: 1499,
        currency: "USD",
        visited_countries: [{ name: "Spain" }, { name: "France" }, { name: "Italy" }]
      },
      {
        id: "2",
        name: "Asian Wonders",
        slug: "maravillas-asia",
        description: "Discover ancient temples and millennial culture in Thailand, Cambodia and Vietnam on an unforgettable 14-day journey.",
        images: ["https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800"],
        price_from: 2199,
        currency: "USD",
        visited_countries: [{ name: "Thailand" }, { name: "Cambodia" }, { name: "Vietnam" }]
      },
      {
        id: "3",
        name: "Premium African Safari",
        slug: "safari-africano-premium",
        description: "Live the African adventure with photo safaris in Kenya and Tanzania. Includes the Big 5 and Zanzibar beaches.",
        images: ["https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800"],
        price_from: 3499,
        currency: "USD",
        visited_countries: [{ name: "Kenya" }, { name: "Tanzania" }]
      },
      {
        id: "4",
        name: "Traditional & Modern Japan",
        slug: "japon-tradicional-moderno",
        description: "Immerse yourself in the fascinating blend of tradition and technology. Tokyo, Kyoto, Osaka and Mount Fuji in 12 days.",
        images: ["https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800"],
        price_from: 2899,
        currency: "USD",
        visited_countries: [{ name: "Japan" }]
      },
      {
        id: "5",
        name: "Extreme Patagonia",
        slug: "patagonia-extrema",
        description: "Ancient glaciers, imposing mountains and turquoise lakes. Explore Argentina and Chile on this 10-day adventure.",
        images: ["https://images.unsplash.com/photo-1591642425143-1fb5e1f9682b?w=800"],
        price_from: 1899,
        currency: "USD",
        visited_countries: [{ name: "Argentina" }, { name: "Chile" }]
      },
      {
        id: "6",
        name: "Inca Trail Route",
        slug: "ruta-incas",
        description: "Machu Picchu, Sacred Valley, Cusco and Lake Titicaca. Explore the Inca civilization on 8 magical days.",
        images: ["https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800"],
        price_from: 1299,
        currency: "USD",
        visited_countries: [{ name: "Peru" }]
      },
      {
        id: "7",
        name: "Dreamy Greek Islands",
        slug: "islas-griegas",
        description: "Santorini, Mykonos, Crete and Athens. White sand beaches, unique architecture and Mediterranean cuisine.",
        images: ["https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800"],
        price_from: 1799,
        currency: "USD",
        visited_countries: [{ name: "Greece" }]
      }
    ]
  };

  const limitedPackages = hardcodedPackages[locale];

  // 🔥 Detectar mobile vs desktop
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsDesktop(!mobile);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // 🔥 GSAP Horizontal Scroll - DERECHA A IZQUIERDA EN DESKTOP
  useEffect(() => {
    if (!carouselRef.current || !scrollContainerRef.current || !isDesktop) {
      return;
    }

    const carousel = carouselRef.current;
    const scrollContainer = scrollContainerRef.current;
    
    // Calcular distancia de scroll
    const carouselWidth = carousel.scrollWidth;
    const containerWidth = scrollContainer.offsetWidth;
    const scrollDistance = carouselWidth - containerWidth;

    // Solo crear animación si hay contenido para scrollear
    if (scrollDistance <= 0) return;

    // 🎨 Crear animación GSAP - INVERTIDA (positivo en lugar de negativo)
    const scrollTween = gsap.to(carousel, {
      x: scrollDistance, // 👈 POSITIVO = se mueve a la DERECHA (contenido entra por derecha)
      ease: "none",
      scrollTrigger: {
        trigger: scrollContainer,
        start: "bottom bottom",
        end: () => `+=${scrollDistance * 1.5}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        pinSpacing: true,
      },
    });

    // 🧹 Cleanup
    return () => {
      scrollTween.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === scrollContainer) {
          trigger.kill();
        }
      });
    };
  }, [limitedPackages, isDesktop]);

  // 🌊 Efecto de Peek/Tilt - SOLO EN MOBILE (invertido también)
  useEffect(() => {
    if (!isMobile || !mobileScrollRef.current || hasScrolled) return;

    const scrollElement = mobileScrollRef.current;

    // Observer para detectar cuando el carousel es visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasScrolled) {
          setTimeout(() => {
            if (!hasScrolled) {
              // 🌊 Animación de "peek" invertida - mueve a la derecha y vuelve
              gsap.to(scrollElement, {
                scrollLeft: -80, // 👈 Negativo para mover a la derecha
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                  gsap.to(scrollElement, {
                    scrollLeft: 0,
                    duration: 0.6,
                    ease: "power2.inOut",
                    delay: 0.3,
                  });
                },
              });
            }
          }, 600);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(scrollElement);

    const handleScroll = () => {
      if (Math.abs(scrollElement.scrollLeft) > 5) {
        setHasScrolled(true);
      }
    };

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, hasScrolled]);

  return (
    <div 
      ref={scrollContainerRef}
      className="relative  py-16 px-4 overflow-hidden bg-gradient-theme"
    >
      {/* Particles Background */}
      <ParticlesCanvas />

      <div className="relative max-w-8xl mx-auto z-20">
        {/* 🎯 Header con SplitText */}
        <div className="text-center mb-10">
          <SplitText
            text={locale === "es" ? "Paquetes Turísticos" : "Travel Packages"}
            className="text-2xl sm:text-4xl md:text-7xl font-semibold text-theme-tittles mb-4 uppercase"
            delay={50}
            duration={0.5}
            ease="power2.out"
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="center"
          />
          <p className="text-[var(--accent)] text-base md:text-xl px-6">
            {locale === "es"
              ? "Vive experiencias únicas con nuestros paquetes diseñados para ti"
              : "Live unique experiences with our packages designed for you"}
          </p>
        </div>

        {/* 🎨 Carousel - Híbrido: nativo mobile / GSAP desktop */}
        <div 
          ref={isMobile ? mobileScrollRef : undefined}
          className={`
            ${isMobile ? 'overflow-x-auto overflow-y-hidden' : 'overflow-hidden'}
            ${isMobile ? 'snap-x snap-mandatory scroll-smooth' : ''}
            ${isMobile ? '-mx-4 px-4' : ''}
          `}
          style={isMobile ? {
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          } : {}}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          <div 
            ref={carouselRef}
            className={`
              flex gap-6 md:gap-8
              ${!isMobile ? 'will-change-transform' : ''}
              ${isMobile ? 'pb-4' : ''}
            `}
            style={isDesktop ? {
              transform: `translateX(-${limitedPackages.length > 0 ? 100 : 0}%)` // 👈 Inicia fuera por la DERECHA
            } : {}}
          >
            {/* 📦 Package Cards */}
            {limitedPackages.map((pkg) => {
              const mainImage = pkg.images?.[0] || "/placeholder-package.jpg";

              return (
                <div
                  key={pkg.id}
                  className={`
                    min-w-[280px] w-[280px] 
                    sm:min-w-[300px] sm:w-[300px]
                    md:min-w-[350px] md:w-[350px] 
                    flex-shrink-0
                    ${isMobile ? 'snap-center' : ''}
                  `}
                >
                  <div className="bg-white/5 rounded-2xl overflow-hidden relative group h-full">
                    {/* Image */}
                    <div className="relative h-80">
                      <img
                        src={mainImage}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        draggable={false}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Price Badge */}
                      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
                        <div className="flex items-center gap-1 text-white font-bold">
                          <MdAttachMoney className="text-xl" />
                          <span>{pkg.price_from.toLocaleString()} {pkg.currency}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      {/* Icon */}
                      <div className="flex justify-end">
                        <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                          <FaSuitcase className="text-white text-2xl" />
                        </div>
                      </div>

                      {/* Text & Button */}
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {pkg.name}
                        </h3>
                        <p className="text-slate-200 text-sm mb-4 line-clamp-2">
                          {pkg.description}
                        </p>
                        
                        {/* Visited Countries */}
                        {pkg.visited_countries && pkg.visited_countries.length > 0 && (
                          <div className="flex items-center gap-1 text-slate-300 text-xs mb-3">
                            <FaMapMarkedAlt />
                            <span>
                              {pkg.visited_countries.slice(0, 2).map(c => c.name).join(", ")}
                              {pkg.visited_countries.length > 2 && "..."}
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            const basePath = locale === "es" ? "paquetes" : "packages";
                            router.push(`/${locale}/${basePath}/${pkg.slug}`);
                          }}
                          className="bg-white text-slate-900 px-5 py-2 rounded-full font-semibold hover:bg-slate-100 transition-colors duration-300"
                        >
                          {locale === "es" ? "Ver Detalles" : "View Details"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 📱 Mobile scroll indicator */}
        {isMobile && limitedPackages.length > 2 && (
          <div className="flex justify-center gap-2 mt-6">
            {limitedPackages.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-white/30"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}