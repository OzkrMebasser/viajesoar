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
import { useDestinationRegions } from "@/lib/hooks/useDestinations";
import SplitText from "@/components/SplitText";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import DestinationsSlideGSAPSkeleton from "./DestinationsSlideHomeSkeleton";
import ButtonArrow from "@/components/ui/ButtonArrow";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

export default function DestinationsSlideGSAP() {
  const locale = useLocale() as Locale;
  const { regions, loading, error } = useDestinationRegions(locale);
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
          opacity: 0.6,
          scale: 0.97,
          ease: "power1.in",
        },
        "-=0.3",
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

  return (
    <div ref={sectionRef} className="relative pt-8  lg:pt-4 bg-gradient-theme">
      {loading ? (
        <div className="min-h-screen">
          <DestinationsSlideGSAPSkeleton />
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

// "use client";
// import { useTheme } from "@/lib/context/ThemeContext";

// import React, { useEffect, useRef, useState } from "react";
// import {
//   FaEuroSign,
//   FaGlobeAmericas,
//   FaGlobeAsia,
//   FaGlobeAfrica,
//   FaChevronRight,
//   FaChevronLeft,
// } from "react-icons/fa";
// import { GiEarthAmerica, GiPalmTree, GiAztecCalendarSun } from "react-icons/gi";
// import { MdTravelExplore } from "react-icons/md";
// import { useRouter } from "next/navigation";
// import SplitText from "@/components/SplitText";
// import { useLocale } from "next-intl";
// import {
//   useDestinationRegions,
//   useCountriesByRegion,
// } from "@/lib/hooks/useDestinations";
// import ParticlesCanvas from "@/components/ParticlesCanvas";
// import DestinationsSlideGSAPSkeleton from "./DestinationsSlideHomeSkeleton";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// // Icon map
// const iconMap: Record<string, React.ComponentType<any>> = {
//   FaEuroSign,
//   MdTravelExplore,
//   GiEarthAmerica,
//   FaGlobeAsia,
//   FaGlobeAmericas,
//   GiPalmTree,
//   FaGlobeAfrica,
//   GiAztecCalendarSun,
// };

// type Locale = "es" | "en";

// export default function DestinationsSlideGSAP() {
//   const locale = useLocale() as Locale;
//   const { regions, loading, error } = useDestinationRegions(locale);
//   // const { countries } = useCountriesByRegion(locale);
//   const router = useRouter();
//   // const { theme } = useTheme();

//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const carouselRef = useRef<HTMLDivElement>(null);
//   const mobileScrollRef = useRef<HTMLDivElement>(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isDesktop, setIsDesktop] = useState(false);
//   const [showScrollIndicator, setShowScrollIndicator] = useState(true);
//   const [isAtEnd, setIsAtEnd] = useState(false);
//   const [activeCardIndex, setActiveCardIndex] = useState(0);

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

//   // 🔥 GSAP Horizontal Scroll - SOLO EN DESKTOP
//   // useEffect(() => {
//   //   if (
//   //     !carouselRef.current ||
//   //     !scrollContainerRef.current ||
//   //     loading ||
//   //     !isDesktop
//   //   ) {
//   //     return;
//   //   }

//   //   const carousel = carouselRef.current;
//   //   const scrollContainer = scrollContainerRef.current;

//   //   const carouselWidth = carousel.scrollWidth;
//   //   const containerWidth = scrollContainer.offsetWidth;
//   //   const scrollDistance = carouselWidth - containerWidth;

//   //   if (scrollDistance <= 0) return;

//   //   const scrollTween = gsap.to(carousel, {
//   //     x: -scrollDistance,
//   //     ease: "none",
//   //     scrollTrigger: {
//   //       trigger: scrollContainer,
//   //       start: "top top",
//   //       end: "200% bottom",
//   //       id: "regions-scroll",
//   //       scrub: 1,
//   //       pin: true,
//   //       anticipatePin: 1,
//   //       invalidateOnRefresh: true,
//   //     },
//   //   });

//   //   return () => {
//   //     scrollTween.kill();
//   //     ScrollTrigger.getAll().forEach((trigger) => {
//   //       if (trigger.trigger === scrollContainer) {
//   //         trigger.kill();
//   //       }
//   //     });
//   //   };
//   // }, [loading, regions, isDesktop]);

// useEffect(() => {
//   if (!carouselRef.current || !scrollContainerRef.current || loading || !isDesktop) {
//     return;
//   }

//   const carousel = carouselRef.current;
//   const scrollContainer = scrollContainerRef.current;

//   const carouselWidth = carousel.scrollWidth;
//   const containerWidth = scrollContainer.offsetWidth;
//   const scrollDistance = carouselWidth - containerWidth;

//   if (scrollDistance <= 0) return;

//   const scrollTween = gsap.to(carousel, {
//     x: -scrollDistance, // 👈 Scroll izquierda a derecha
//     ease: "none",
//     scrollTrigger: {
//       trigger: scrollContainer,
//       start: "top top",
//       end: () => `+=${scrollDistance}`,
//       id: "destinations-scroll", // 👈 ID único
//       scrub: 1,
//       pin: true,
//       anticipatePin: 1,
//       invalidateOnRefresh: true,
//     },
//   });

//   return () => {
//     scrollTween.kill();
//     ScrollTrigger.getAll().forEach((trigger) => {
//       if (trigger.trigger === scrollContainer) {
//         trigger.kill();
//       }
//     });
//   };
// }, [loading, regions, isDesktop]);

//   // 👆 Detectar scroll y posición - SOLO EN MOBILE
//   useEffect(() => {
//     if (!isMobile || loading) return;

//     const timeoutId = setTimeout(() => {
//       const scrollElement = mobileScrollRef.current;

//       if (!scrollElement) {
//         console.log("❌ No scrollElement después del timeout");
//         return;
//       }

//       // console.log("✅ ScrollElement encontrado!");

//       const handleScroll = () => {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
//         const maxScroll = scrollWidth - clientWidth;

//         // Calcular índice activo
//         const cardWidth = 300; // Ajusta según el ancho de tus cards
//         const newActiveIndex = Math.round(scrollLeft / cardWidth);
//         setActiveCardIndex(Math.min(newActiveIndex, regions.length - 1));

//         // console.log("📊 ScrollLeft:", scrollLeft, "MaxScroll:", maxScroll);

//         // Al final del scroll
//         if (scrollLeft >= maxScroll - 5) {
//           console.log("🏁 Al final");
//           setIsAtEnd(true);
//           setShowScrollIndicator(true);
//         }
//         // Al inicio del scroll
//         else if (scrollLeft <= 5) {
//           console.log("🏁 Al inicio");
//           setIsAtEnd(false);
//           setShowScrollIndicator(true);
//         }
//         // En el medio
//         else {
//           console.log("⏸️ En el medio");
//           setShowScrollIndicator(false);
//         }
//       };

//       scrollElement.addEventListener("scroll", handleScroll, { passive: true });
//       handleScroll();

//       return () => {
//         scrollElement.removeEventListener("scroll", handleScroll);
//       };
//     }, 200);

//     return () => {
//       clearTimeout(timeoutId);
//     };
//   }, [isMobile, loading, regions.length]);
//   // if (loading) {
//   //   return (
//   //     <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
//   //       {locale === "es" ? "Cargando regiones..." : "Loading destinations..."}
//   //     </div>
//   //   );
//   // }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-900 text-red-400">
//         {error}
//       </div>
//     );
//   }

//   return (
//     // <div
//     //   ref={scrollContainerRef}
//     //   // className="relative min-h-screen py-16 px-4 overflow-hidden bg-gradient-theme"
//     //    className="w-screen h-screen py-16 px-4 bg-gradient-theme"
//     // >
//  <div
//     ref={scrollContainerRef}
//     className="relative pb-20 px-4  bg-red-300  "
//   >

//       {loading ? (
//     <DestinationsSlideGSAPSkeleton />
//   ) : (
//     <>
//     <ParticlesCanvas />

//       <div className="relativel mx-auto z-20">
//         {/* 🎯 Header con SplitText */}
//         <div className="text-center mb-10">
//           <SplitText
//             text={locale === "es" ? "Descubre el Mundo" : "Discover the World"}
//          className="text-2xl sm:text-4xl md:text-7xl font-semibold text-theme-tittles mb-4 uppercase"
//             delay={25}
//             duration={0.5}
//             ease="power2.out"
//             splitType="chars"
//             from={{ opacity: 0, y: 20 }}
//             to={{ opacity: 1, y: 0 }}
//             textAlign="center"
//             threshold={0.3} // 🔥 Más alto para que active antes
//             rootMargin="-50px"
//           />
//           <p className="text-[var(--accent)] text-base md:text-xl px-6">
//             {locale === "es"
//               ? "Explora destinos increíbles alrededor del planeta"
//               : "Explore amazing destinations around the world"}
//           </p>
//         </div>

//         {/* 🎨 Carousel Container */}
//         <div className="relative">
//           {/* 👉 Indicador de Scroll - SOLO MOBILE */}
//           {isMobile && showScrollIndicator && (
//             <div
//               className={`
//                 absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none
//                 transition-all duration-300
//                 ${isAtEnd ? "left-0" : "right-0"}
//               `}
//             >
//               <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg animate-pulse">
//                 {isAtEnd ? (
//                   <FaChevronLeft className="text-slate-900 text-xl" />
//                 ) : (
//                   <FaChevronRight className="text-slate-900 text-xl" />
//                 )}
//               </div>
//             </div>
//           )}

//           {/* 🎨 Carousel - Híbrido: nativo mobile / GSAP desktop */}
//           <div
//             ref={mobileScrollRef}
//             className={`
//               ${isMobile ? "overflow-x-auto overflow-y-hidden" : "overflow-hidden"}
//               ${isMobile ? "snap-x snap-mandatory scroll-smooth" : ""}
//               ${isMobile ? "-mx-4 px-4" : ""}
//             `}
//             style={
//               isMobile
//                 ? {
//                     scrollbarWidth: "none",
//                     msOverflowStyle: "none",
//                     WebkitOverflowScrolling: "touch",
//                   }
//                 : {}
//             }
//           >
//             <style jsx>{`
//               div::-webkit-scrollbar {
//                 display: none;
//               }
//             `}</style>

//             <div
//               ref={carouselRef}
//               className={`
//                 flex gap-6 md:gap-8
//                 ${!isMobile ? "will-change-transform" : ""}
//                 ${isMobile ? "pb-4" : ""}
//               `}
//             >
//               {/* 🗺️ Regions Cards */}
//               {regions.map((region) => {
//                 const IconComponent = iconMap[region.icon] || MdTravelExplore;

//                 return (
//                   <div
//                     key={region.id}
//                     className={`
//                       min-w-[280px] w-[280px]
//                       sm:min-w-[300px] sm:w-[300px]
//                       md:min-w-[350px] md:w-[350px]
//                       flex-shrink-0
//                       ${isMobile ? "snap-center" : ""}
//                     `}
//                   >
//                     <div className="bg-white/5 rounded-2xl overflow-hidden relative group h-full">
//                       <div className="relative h-80">
//                         <img
//                           src={region.image}
//                           alt={region.name}
//                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                           draggable={false}
//                           loading="lazy"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
//                       </div>

//                       <div className="absolute inset-0 p-6 flex flex-col justify-between">
//                         <div className="flex justify-end">
//                           <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
//                             <IconComponent className="text-white text-2xl" />
//                           </div>
//                         </div>

//                         <div>
//                           <h3 className="text-2xl font-bold text-white mb-2">
//                             {region.name}
//                           </h3>
//                           <p className="text-slate-200 text-sm mb-4 line-clamp-2">
//                             {region.description}
//                           </p>
//                           <button
//                             onClick={() => {
//                               const basePath =
//                                 locale === "es" ? "destinos" : "destinations";
//                               router.push(
//                                 `/${locale}/${basePath}/${region.slug}`,
//                               );
//                             }}
//                             className="bg-white text-slate-900 px-5 py-2 rounded-full font-semibold hover:bg-slate-100 transition-colors duration-300"
//                           >
//                             {locale === "es" ? "Explorar" : "Explore"}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* 📱 Mobile scroll indicator */}
//         {isMobile && regions.length > 2 && (
//           <div className="flex justify-center gap-3 mt-6">
//             {regions.map((_, index) => {
//               const isActive = index === activeCardIndex;

//               // Cálculo automático: 22.5 grados por cada index
//               const rotation = index + 45 - index;

//               return (
//                 <div
//                   key={index}
//                   style={{
//                     transform: isActive
//                       ? `rotate(${rotation}deg)`
//                       : "rotate(0deg)",
//                   }}
//                   className={`
//             transition-all duration-500 ease-in-out
//             ${
//               isActive
//                 ? "w-3 h-3 bg-theme-accent shadow-lg scale-110"
//                 : "w-2.5 h-2.5 bg-white/40"
//             }`}
//                 />
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </>
//   )}

//     </div>
//   );
// }
