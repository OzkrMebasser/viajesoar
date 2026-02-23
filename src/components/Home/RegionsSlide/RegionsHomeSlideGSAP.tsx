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
// import { useDestinationRegions, useRegionsHome } from "@/lib/hooks/useDestinations";
import { useRegionsHome } from "@/lib/hooks/Useregionshome";
import SplitText from "@/components/SplitText";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import RegionsHomeSlideGSAPSkeleton from "./RegionsHomeSlideGSAPSkeleton";
import ButtonArrow from "@/components/ui/ButtonArrow";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CardsSlideShow from "@/components/CardsSlideShow";
import ButtonGlower from "@/components/ui/ButtonGlower";

gsap.registerPlugin(ScrollTrigger);

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

export default function RegionsHomeSlideGSAP() {
  const locale = useLocale() as Locale;
  const { regions, loading, error } = useRegionsHome(locale);
  // console.log(regions)
  const router = useRouter();

  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Detectar mobile vs desktop
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // 🎨 GSAP Scroll Horizontal - SOLO DESKTOP

  useEffect(() => {
    if (isMobile || loading || !regions.length) return;

    const section = sectionRef.current;
    const carousel = carouselRef.current;
    const container = scrollContainerRef.current;

    if (!section || !carousel || !container) return;

    // Limpiar ScrollTriggers previos de esta sección
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.id === "destinations-scroll") {
        trigger.kill();
      }
    });

    // Esperar a que el DOM esté listo
    const timer = setTimeout(() => {
      const scrollDistance = carousel.scrollWidth - container.offsetWidth;

      // 🔥 Timeline principal con ScrollTrigger
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
          id: "destinations-scroll",
          markers: false, // 👈 Cambia a true para debugging
        },
      });

      tl.to(carousel, {
        x: -scrollDistance,
        ease: "none",
      }).to(
        container,
        {
          scale: 0,
          ease: "power1.in",
        },
        "-=0.02",
      );
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.id === "destinations-scroll") {
          trigger.kill();
        }
      });
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

  // / Justo antes del return, agrega esto:
  useEffect(() => {
    if (regions.length > 0) {
      console.log("🔍 DEBUGGING REGIONS:");
      regions.forEach((region, index) => {
        // console.log(`\n📍 Region ${index}:`, region.name);
        // console.log("   images type:", typeof region.images);
        // console.log("   images value:", region.images);
        // console.log("   is array?:", Array.isArray(region.images));

        if (typeof region.images === "string") {
          console.log("   ⚠️ images es STRING, necesita parsearse");
          try {
            const parsed = JSON.parse(region.images);
            console.log("   ✅ parsed:", parsed);
          } catch (e) {
            console.log("   ❌ parse error:", e);
          }
        }
      });
    }
  }, [regions]);

  // 🔍 Zoom out/in effect SOLO MOBILE - ligado al scroll de página
  useEffect(() => {
    if (!isMobile || loading) return;

    const section = scrollContainerRef.current;
    if (!section) return;

    section.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    section.style.transformOrigin = "center center";

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Qué tanto ha salido del viewport hacia arriba (0 = justo entrando, 1 = completamente fuera)
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / (rect.height * 0.5)),
      );

      const scale = 1 - progress * 1; // De 1 a 0
      const opacity = 1 - progress; // De 1 a 0

      section.style.transform = `scale(${scale})`;
      section.style.opacity = String(opacity);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (section) {
        section.style.transform = "";
        section.style.opacity = "";
        section.style.transition = "";
      }
    };
  }, [isMobile, loading]);

  return (
    <div ref={sectionRef} className="relative pt-8 lg:pt-4 bg-gradient-theme">
      {loading ? (
        <div className="min-h-screen">
          <RegionsHomeSlideGSAPSkeleton />
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="relative px-4 py-2 lg:py-8 overflow-hidden"
          style={{ minHeight: isMobile ? "" : "100vh" }}
        >
          <ParticlesCanvas />

          <div className="relative mx-auto z-20 max-w-7xl">
            {/* 🎯 Header compacto */}
            <div className="text-center mb-8">
              <SplitText
                text={
                  locale === "es" ? "Descubre el Mundo" : "Discover the World"
                }
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-theme-tittles mb-3 uppercase"
                delay={25}
                duration={0.5}
                ease="power2.out"
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
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg h-12 w-12">
                  {isAtEnd ? (
                    <img src="/swipe-right.svg" alt="Swipe right indicator" className="text-2xl hand-icon-right " />
                  ) : (
                    <img src="/swipe-left.svg" alt="Swipe left indicator" className="text-2xl hand-icon-left"/>
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
                  {/* 🗺️ Region Cards */}
                  {regions.map((region, index) => {
                    const IconComponent =
                      iconMap[region.icon] || MdTravelExplore;

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
                          {/* <div className="relative h-80">
                            <img
                              src={region.image}
                              alt={region.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              draggable={false}
                              loading={index < 3 ? "eager" : "lazy"}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          </div> */}
                          <div className="relative h-80">
                            <CardsSlideShow
                              images={region.images}
                              interval={4000}
                              className="w-full h-full"
                              maxImages={5}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
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
                              {/* <button
                                onClick={() => {
                                  const basePath =
                                    locale === "es"
                                      ? "destinos"
                                      : "destinations";
                                  router.push(
                                    `/${locale}/${basePath}/${region.slug}`,
                                  );
                                }}
                                className="bg-white text-slate-900 px-5 py-2 rounded-full font-semibold hover:bg-slate-100 transition-colors duration-300"
                              >
                                {locale === "es" ? "Explorar" : "Explore"}
                              </button> */}
                              <ButtonGlower
                                // href={`/${locale}${locale === "es" ? "/destinos" : "/destinations"}`}
                                onClick={() => {
                                  const basePath =
                                    locale === "es"
                                      ? "destinos"
                                      : "destinations";
                                  router.push(
                                    `/${locale}/${basePath}/${region.slug}`,
                                  );
                                }}
                              >
                                {locale === "es" ? "Ver más" : "See more"}{" "}
                              </ButtonGlower>
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
            {/* {isMobile && regions.length > 2 && (
              <div className="flex justify-center gap-3 mt-6">
                {regions.map((_, index) => {
                  const isActive = index === activeCardIndex;

                  return (
                    <div
                      key={index}
                      className={`
    transition-all duration-500 ease-in-out
    transform
    will-change-transform
    ${
      isActive
        ? "w-2.5 h-2.5 bg-theme-accent shadow-lg scale-105 rotate-45"
        : "w-2 h-2 bg-gray-200 scale-100 rotate-0"
    }
  `}
                    />
                  );
                })}
              </div>
            )} */}
            {/* 📱 Mobile scroll indicator - Estilo slideshow */}
            {isMobile && regions.length > 2 && (
              <div className="flex justify-center gap-1.5 mt-6">
                {regions.map((_, index) => {
                  const isActive = index === activeCardIndex;

                  return (
                    <div
                      key={index}
                      style={{
                        width: isActive ? "6px" : "6px",
                        height: "6px",
                        transition: "all 0.3s ease-in-out",
                        rotate: isActive ? "45deg" : "0deg",
                      }}
                      className={`
            
            ${isActive ? "bg-theme-accent shadow-lg scale-105" : "bg-gray-200"}
          `}
                    />
                  );
                })}
              </div>
            )}

            {/* 🎯 CTA Button */}
            <div className="flex justify-center mt-8 mb-8 ">
              <ButtonArrow
                title={
                  locale === "es"
                    ? "Ver todas las regiones"
                    : "View all regions"
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
