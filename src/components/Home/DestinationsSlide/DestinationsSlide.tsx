"use client";
import { useTheme } from "@/lib/context/ThemeContext";

const dotsColor = "bg-gradient-to-r from-[#14b8a6] via-[#06b6d4] to-[#179bed]";

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
// import DotGrid from "@/components/DotGrid";
import SplitText from "@/components/SplitText";
import { useLocale } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import {
  useDestinationRegions,
  useCountriesByRegion,
} from "@/lib/hooks/useDestinations";
import ParticlesCanvas from "@/components/ParticlesCanvas";

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

export default function DestinationsSlide() {
  const locale = useLocale() as Locale;
  const { regions, loading, error } = useDestinationRegions(locale);
  const { countries } = useCountriesByRegion(locale);
  // console.log('countries', countries);
  const router = useRouter();
  const { theme } = useTheme();

  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    if (!titleRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitleVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        {locale === "es" ? "Cargando regiones..." : "Loading destinations..."}
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-red-400">
        {error}
      </div>
    );

  return (
    <div className="relative lg:min-h-screen py-16 px-4 overflow-hidden bg-gradient-theme">
      {/* square particles */}
      <ParticlesCanvas />

      <div className="relative max-w-8xl mx-auto z-20">
        {/* Header */}
        <div className="text-center mb-10" ref={titleRef}>
          <SplitText
            text={locale === "es" ? "Descubre el Mundo" : "Discover the World"}
            className="text-2xl sm:text-4xl md:text-7xl font-semibold text-theme-tittles mb-4 uppercase"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="center"
          />
          <p className={`text-[var(--accent)] text-base md:text-xl px-6`}>
            {locale === "es"
              ? "Explora destinos increíbles alrededor del planeta"
              : "Explore amazing destinations around the world"}
          </p>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay, FreeMode]}
          freeMode
          grabCursor
          slidesPerView={4}
          spaceBetween={30}
          centeredSlides
          loop
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          className="no-scrollbar  "
        >
          {/*Regions map */}
          {regions.map((region) => {
            const IconComponent = iconMap[region.icon] || MdTravelExplore;

            return (
              <SwiperSlide
                key={region.id}
                className="min-w-[300px] md:min-w-[350px] rounded-2xl "
              >
                <div className="bg-white/5 rounded-2xl  overflow-hidden relative group   ">
                  <div className="relative h-80 ">
                    <img
                      src={region.image}
                      alt={region.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 "
                      draggable={false}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${region.gradient} opacity-60`}
                    />
                  </div>

                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                        <IconComponent className="text-white text-2xl" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {region.name}
                      </h3>
                      <p className="text-slate-200 mb-3">
                        {region.description}
                      </p>
                      <button
                        onClick={() => {
                          const basePath =
                            locale === "es" ? "destinos" : "destinations";

                          router.push(
                            `/${locale}/${basePath}/${region.slug}`,
                          );
                        }}
                        className="bg-white text-slate-900 px-5 py-2 rounded-full font-semibold hover:bg-slate-100 transition"
                      >
                        {locale === "es" ? "Explorar" : "Explore"}
                      </button>

                      {/* <button
                        onClick={() => {
                          const basePath =
                            locale === "es" ? "destinos" : "destinations";

                          // Limpiar acentos y espacios en el slug
                          const cleanedSlug = destination.slug
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "") // quitar acentos
                            .replace(/\s+/g, "-") // reemplazar espacios por guiones
                            .toLowerCase();

                          router.push(`/${locale}/${basePath}/${cleanedSlug}`);
                        }}
                        className="bg-white text-slate-900 px-5 py-2 rounded-full font-semibold hover:bg-slate-100 transition"
                      >
                        {locale === "es" ? "Explorar" : "Explore"}
                      </button> */}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
