"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  FaEuroSign,
  FaGlobeAmericas,
  FaGlobeAsia,
  FaGlobeAfrica,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { GiEarthAmerica, GiPalmTree, GiAztecCalendarSun } from "react-icons/gi";
import { MdTravelExplore } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  useDestinationRegions,
} from "@/lib/hooks/useDestinations";
import SplitText from "@/components/SplitText";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import DestinationsSlideGSAPSkeleton from "./DestinationsSlideGSAPSkeleton";
import ButtonArrow from "@/components/ui/ButtonArrow";

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

export default function DestinationsSlideLocomotive() {
  const locale = useLocale() as Locale;
  const { regions, loading, error } = useDestinationRegions(locale);
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

  // 🚂 Scroll horizontal terminando en #finish-scroll + 200px
  useEffect(() => {
    if (isMobile || !scrollContainerRef.current || !carouselRef.current || !sectionRef.current || !finishScrollRef.current || loading) return;

    const section = sectionRef.current;
    const container = scrollContainerRef.current;
    const carousel = carouselRef.current;
    const finishElement = finishScrollRef.current;
    
    const OVERSCROLL_BUFFER = 300; // 🔥 200px después de #finish-scroll

    const calculateBounds = () => {
      const sectionRect = section.getBoundingClientRect();
      const finishRect = finishElement.getBoundingClientRect();
      const sectionTop = window.scrollY + sectionRect.top;
      const finishTop = window.scrollY + finishRect.top;
      
      // 🔥 Distancia total del scroll horizontal (ESTO ES CLAVE)
      const scrollDistance = carousel.scrollWidth - container.offsetWidth;
      
      // 🔥 El scroll del carousel necesita esta altura para completarse
      const carouselScrollHeight = scrollDistance;
      
      // 🔥 Después del carousel, añadimos espacio hasta #finish-scroll + 200px
      const finishDistance = finishTop - sectionTop + finishRect.height + OVERSCROLL_BUFFER;
      
      // 🔥 La altura total es lo que sea mayor
      const totalHeight = Math.max(carouselScrollHeight + window.innerHeight, finishDistance);
      section.style.height = `${totalHeight}px`;
      
      const scrollStart = sectionTop;
      const scrollEnd = sectionTop + totalHeight;
      
      return { scrollDistance, scrollStart, scrollEnd };
    };

    let bounds = calculateBounds();

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const { scrollDistance, scrollStart, scrollEnd } = bounds;
      
      // 🔥 Progreso total (0 a 1)
      const totalScrollDistance = scrollEnd - scrollStart;
      const scrolled = currentScroll - scrollStart;
      const progress = Math.max(0, Math.min(scrolled / totalScrollDistance, 1));

      // 🔥 Progreso del carousel (considerando todo el ancho)
      const carouselScrollDistance = scrollDistance;
      const carouselProgress = Math.min(scrolled / carouselScrollDistance, 1);

      // 🔥 Aplicar sticky
      if (progress > 0 && progress < 1) {
        container.style.position = "sticky";
        container.style.top = "0";
        
        // Transformación horizontal
        const translateX = -carouselProgress * scrollDistance;
        carousel.style.transform = `translate3d(${translateX}px, 0, 0)`;
        carousel.style.willChange = "transform";
        
        // 🔥 Fade out después de terminar el carousel
        if (carouselProgress >= 1) {
          const overscrollProgress = (scrolled - carouselScrollDistance) / (totalScrollDistance - carouselScrollDistance);
          const fadeAmount = Math.min(Math.max(overscrollProgress, 0), 1);
          container.style.opacity = `${1 - fadeAmount * 0.4}`;
          
          // Zoom out sutil
          const scale = 1 - (fadeAmount * 0.03);
          carousel.style.transform = `translate3d(-${scrollDistance}px, 0, 0) scale(${scale})`;
        } else {
          container.style.opacity = "1";
        }
        
      } else if (progress <= 0) {
        container.style.position = "relative";
        carousel.style.transform = "translate3d(0, 0, 0)";
        container.style.opacity = "1";
      } else {
        container.style.position = "relative";
        carousel.style.transform = `translate3d(-${scrollDistance}px, 0, 0)`;
        container.style.opacity = "0.6";
      }
    };

    const handleResize = () => {
      bounds = calculateBounds();
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    
    setTimeout(() => handleScroll(), 100);

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
  }, [isMobile, loading, regions.length]);

  // 👆 Scroll mobile
  useEffect(() => {
    if (!isMobile || loading) return;

    const timeoutId = setTimeout(() => {
      const scrollElement = mobileScrollRef.current;
      if (!scrollElement) return;

      const handleScroll = () => {
        const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
        const maxScroll = scrollWidth - clientWidth;

        const cardWidth = 300;
        const newActiveIndex = Math.round(scrollLeft / cardWidth);
        setActiveCardIndex(Math.min(newActiveIndex, regions.length - 1));

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
  }, [isMobile, loading, regions.length]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-theme"
    >
      {loading ? (
        <div className="min-h-screen">
          <DestinationsSlideGSAPSkeleton />
        </div>
      ) : (
        <>
          <div
            ref={scrollContainerRef}
            className="relative px-4 py-8"
            style={{ minHeight: isDesktop ? "100vh" : "auto" }}
          >
            <ParticlesCanvas />

            <div className="relative mx-auto z-20 max-w-7xl">
              {/* 🎯 Header compacto */}
              <div className="text-center mb-8">
                <SplitText
                  text={locale === "es" ? "Descubre el Mundo" : "Discover the World"}
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-theme-tittles mb-3 uppercase"
                  delay={25}
                  duration={0.5}
                  ease="power2.out"
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
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>

                  <div
                    ref={carouselRef}
                    className={`flex gap-6 md:gap-8 ${isMobile ? "pb-4" : ""}`}
                  >
                    {/* 🗺️ Region Cards */}
                    {regions.map((region, index) => {
                      const IconComponent = iconMap[region.icon] || MdTravelExplore;

                      return (
                        <div
                          key={region.id}
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
                                src={region.image}
                                alt={region.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                draggable={false}
                                loading={index < 3 ? "eager" : "lazy"}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            </div>

                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                              <div className="flex justify-end">
                                <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                                  <IconComponent className="text-white text-2xl" />
                                </div>
                              </div>

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
              </div>

              {/* 📱 Mobile scroll indicator */}
              {isMobile && regions.length > 2 && (
                <div className="flex justify-center gap-3 mt-6">
                  {regions.map((_, index) => {
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
              <div 
                ref={finishScrollRef}
                className="flex justify-center mt-8"
              >
                <ButtonArrow 
                  title={locale === "es" ? "Ver todas las regiones" : "View all regions"} 
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}