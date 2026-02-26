"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  FaEuroSign,
  FaGlobeAmericas,
  FaGlobeAsia,
  FaGlobeAfrica,
} from "react-icons/fa";
import { GiEarthAmerica, GiPalmTree, GiAztecCalendarSun } from "react-icons/gi";
import { MdTravelExplore } from "react-icons/md";

// types
import type { RegionHome } from "@/types/destinations";
import type { Locale } from "@/types/locale";

//components
import SplitText from "@/components/SplitText";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import ButtonArrow from "@/components/ui/ButtonArrow";
import CardsSlideShow from "@/components/CardsSlideShow";
import ButtonGlower from "@/components/ui/ButtonGlower";

//gsap
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RegionsHomeSlideGSAPSkeleton from "./RegionsHomeSlideGSAPSkeleton";
gsap.registerPlugin(ScrollTrigger);

// iconos dinamicos
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

// Props del componente
interface Props {
  locale: Locale;
  regions: RegionHome[];
}

export default function RegionsHomeSlideGSAP({ locale, regions }: Props) {
  // Estados para manejo de cliente, mobile, scroll y animaciones

  const [isMobile, setIsMobile] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Refs para GSAP y manejo de scroll
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  // Detectar si es mobile o desktop para activar GSAP o scroll táctil
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
    if (isMobile || !regions.length) return;

    const section = sectionRef.current;
    const carousel = carouselRef.current;
    const container = scrollContainerRef.current;

    if (!section || !carousel || !container) return;

    // Limpiar triggers anteriores para evitar duplicados
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.id === "destinations-scroll") {
        trigger.kill();
      }
    });

    // Pequeño delay para asegurar que el DOM esté listo antes de calcular dimensiones
    const timer = setTimeout(() => {
      const scrollDistance = carousel.scrollWidth - container.offsetWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance + 500}`,
          scrub: 1,
          pin: container,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          id: "destinations-scroll",
          markers: false,
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

    // Limpieza al desmontar
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.id === "destinations-scroll") {
          trigger.kill();
        }
      });
    };
  }, [isMobile, regions.length]);

  // Manejo de scroll táctil y detección de fin de scroll - SOLO MOBILE
  useEffect(() => {
    if (!isMobile) return;

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
  }, [isMobile, regions.length]);

  // Efecto de escala y opacidad al hacer scroll - SOLO MOBILE
  useEffect(() => {
    if (!isMobile) return;

    const section = scrollContainerRef.current;
    if (!section) return;

    section.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    section.style.transformOrigin = "center center";

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();

      const progress = Math.max(
        0,
        Math.min(1, -rect.top / (rect.height * 0.5)),
      );

      const scale = 1 - progress * 1;
      const opacity = 1 - progress;

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
  }, [isMobile]);

  // Si no hay regiones, mostrar skeleton SEO friendly (para que Google no vea un bloque vacío)
  if (!regions.length) {
    return <RegionsHomeSlideGSAPSkeleton />;
  }
  return (
    <section
      ref={sectionRef}
      className="relative pt-8 lg:pt-4 bg-gradient-theme"
    >
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
                    <img
                      src="/swipe-right.svg"
                      alt="Swipe right indicator"
                      className="text-2xl hand-icon-right "
                    />
                  ) : (
                    <img
                      src="/swipe-left.svg"
                      alt="Swipe left indicator"
                      className="text-2xl hand-icon-left"
                    />
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
                        {/* 🎞️ Slideshow de imágenes de la región */}
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

                            <ButtonGlower
                              href={`/${locale}/${locale === "es" ? "destinos" : "destinations"}/${region.slug}`}
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
              href={`/${locale}/${locale === "es" ? "destinos" : "destinations"}`}
              title={
                locale === "es" ? "Ver todas las regiones" : "View all regions"
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
