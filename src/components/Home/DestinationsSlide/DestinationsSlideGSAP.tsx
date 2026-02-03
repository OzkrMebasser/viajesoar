"use client";
import { useTheme } from "@/lib/context/ThemeContext";

import React, { useEffect, useRef, useState } from "react";
import {
  FaEuroSign,
  FaGlobeAmericas,
  FaGlobeAsia,
  FaGlobeAfrica,
} from "react-icons/fa";
import { GiEarthAmerica, GiPalmTree, GiAztecCalendarSun } from "react-icons/gi";
import { MdTravelExplore } from "react-icons/md";
import { useRouter } from "next/navigation";
import SplitText from "@/components/SplitText";
import { useLocale } from "next-intl";
import {
  useDestinationRegions,
  useCountriesByRegion,
} from "@/lib/hooks/useDestinations";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

// Icon map
const iconMap: Record<string, React.ComponentType<any>> = {
  FaEuroSign,
  MdTravelExplore,
  GiEarthAmerica,
  FaGlobeAsia,
  FaGlobeAmericas,
  GiPalmTree,
  FaGlobeAfrica,
  GiAztecCalendarSun,
};

type Locale = "es" | "en";

export default function DestinationsSlideGSAP() {
  const locale = useLocale() as Locale;
  const { regions, loading, error } = useDestinationRegions(locale);
  const { countries } = useCountriesByRegion(locale);
  const router = useRouter();
  const { theme } = useTheme();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

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

  // 🔥 GSAP Horizontal Scroll - SOLO EN DESKTOP
  useEffect(() => {
    if (!carouselRef.current || !scrollContainerRef.current || loading || !isDesktop) {
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

    // 🎨 Crear animación GSAP
    const scrollTween = gsap.to(carousel, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: scrollContainer,
        start: "top top",
        end: "200% bottom",
        // markers: true,
         id: "regions-scroll",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
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
  }, [loading, regions, isDesktop]);

  // 🌊 Efecto de Peek/Tilt/Ola - SOLO EN MOBILE
  useEffect(() => {
    if (!isMobile || !mobileScrollRef.current || loading || hasScrolled) return;

    const scrollElement = mobileScrollRef.current;

    // Observer para detectar cuando el carousel es visible
    const observer = new IntersectionObserver(
      
      ([entry]) => {
       
        if (entry.isIntersecting && !hasScrolled) {
          
          // Esperar un poco después de que sea visible
          setTimeout(() => {
            if (!hasScrolled) {
              // 🌊 Animación de "peek/tilt" - mueve un poco a la izquierda y vuelve
              gsap.to(scrollElement, {
                scrollLeft: 80,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                  // Volver al inicio suavemente
                  gsap.to(scrollElement, {
                    scrollLeft: 0,
                    duration: 0.6,
                    ease: "power2.inOut",
                    delay: 0.3,
                  });
                },
              });
            }
          }, 600); // Espera 600ms después de ser visible
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(scrollElement);

    // Detectar cuando el usuario hace scroll manualmente
    const handleScroll = () => {
      if (scrollElement.scrollLeft > 5) {
        setHasScrolled(true);
      }
    };

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, loading, hasScrolled]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        {locale === "es" ? "Cargando regiones..." : "Loading destinations..."}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="relative min-h-screen py-16 px-4 overflow-hidden bg-gradient-theme"
    >
      {/* Particles Background */}
      <ParticlesCanvas />

      <div className="relative max-w-8xl mx-auto z-20">
        {/* 🎯 Header con SplitText */}
        <div className="text-center mb-10">
          <SplitText
            text={locale === "es" ? "Descubre el Mundo" : "Discover the World"}
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
              ? "Explora destinos increíbles alrededor del planeta"
              : "Explore amazing destinations around the world"}
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
          >
            {/* 🗺️ Regions Cards */}
            {regions.map((region) => {
              const IconComponent = iconMap[region.icon] || MdTravelExplore;

              return (
                <div
                  key={region.id}
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
                        src={region.image}
                        alt={region.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        draggable={false}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      {/* Icon */}
                      <div className="flex justify-end">
                        <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                          <IconComponent className="text-white text-2xl" />
                        </div>
                      </div>

                      {/* Text & Button */}
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {region.name}
                        </h3>
                        <p className="text-slate-200 text-sm mb-4 line-clamp-2">
                          {region.description}
                        </p>
                        <button
                          onClick={() => {
                            const basePath = locale === "es" ? "destinos" : "destinations";
                            router.push(`/${locale}/${basePath}/${region.slug}`);
                          }}
                          className="bg-white text-slate-900 px-5 py-2 rounded-full font-semibold hover:bg-slate-100 transition-colors duration-300"
                        >
                          {locale === "es" ? "Explorar" : "Explore"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 📱 Mobile scroll indicator (opcional) */}
        {isMobile && regions.length > 2 && (
          <div className="flex justify-center gap-2 mt-6">
            {regions.map((_, index) => (
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