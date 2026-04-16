"use client";

import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCube, Autoplay } from "swiper/modules";
import { Star, StarHalf } from "lucide-react";
import { useLocale } from "next-intl";

import SplitTextVanilla from "./SplitTextVanilla";
import AOS from "aos";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/effect-cube";

import ParticlesCanvas from "./ui/Particles/ParticlesCanvas";
import ButtonArrow from "./ui/ButtonArrow";
import { MdTravelExplore } from "react-icons/md";
import type { DestinationActivity } from "@/types/activities";

type Locale = "es" | "en";

interface Props {
  tours: DestinationActivity[];
}

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < Math.floor(rating))
          return <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />;
        if (i < rating)
          return <StarHalf key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />;
        return <Star key={i} className="w-4 h-4 text-gray-400" />;
      })}
    </div>
  );
};

export default function CubeEffectSlider({ tours = [] }: Props): React.ReactNode {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const locale = useLocale() as Locale;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    AOS.init({ once: true, duration: 800, offset: 120, easing: "ease-out-cubic" });
  }, []);

  useEffect(() => {
    if (!isMobile || !mounted) return;
    const section = scrollContainerRef.current;
    if (!section) return;

    section.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    section.style.transformOrigin = "center center";

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.5)));
      section.style.transform = `scale(${1 - progress})`;
      section.style.opacity = String(1 - progress);
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
  }, [isMobile, mounted]);

  if (!mounted) return null;

  // Fallback si no hay tours en BD
  if (!tours.length) return null;

  return (
    <div className="relative min-h-screen bg-gradient-theme flex items-center justify-center px-4 sm:px-8 lg:px-16 py-12">
      <ParticlesCanvas />

      <div ref={scrollContainerRef} className="relative z-20 w-full max-w-6xl">
        <div
          {...(!isMobile ? { "data-aos": "zoom-in-up" } : {})}
          className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* ── Text Section ── */}
          <div className="flex flex-col justify-center">
            <SplitTextVanilla
              text={locale === "es" ? "Aventuras" : "SOARprising"}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-theme-tittles mb-3 uppercase"
              delay={25}
              duration={0.5}
              ease="power2.out"
              splitType="chars"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="center"
            />
            <SplitTextVanilla
              text={locale === "es" ? "SOARprendentes" : "Adventures"}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-theme-tittles mb-3 uppercase"
              delay={25}
              duration={0.5}
              ease="power2.out"
              splitType="chars"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="center"
            />

            <p className="text-base sm:text-lg text-theme mb-8 leading-relaxed">
              {locale === "es"
                ? "Nuestros tours están diseñados para transportarte al corazón de los destinos más cautivadores del mundo, creando recuerdos que durarán toda la vida."
                : "Our tours are designed to transport you to the heart of the world's most captivating destinations, creating memories that will last a lifetime."}
            </p>

            <ButtonArrow
              href={`/${locale}/tours`}
              title={locale === "es" ? "Explorar Tours" : "Explore Tours"}
            />
          </div>

          {/* ── Swiper Slider ── */}
          <div className="flex justify-center">
            <Swiper
              modules={[EffectCube, Autoplay]}
              effect="cube"
              grabCursor={true}
              loop={true}
              speed={1000}
              autoplay={{ delay: 2600, pauseOnMouseEnter: true }}
              cubeEffect={{
                shadow: false,
                slideShadows: true,
                shadowOffset: 10,
                shadowScale: 0.94,
              }}
              style={{ width: "320px", height: "420px" } as React.CSSProperties}
            >
              {tours.map((tour) => {
                const image = tour.cover_image ?? tour.photos?.[0] ?? null;

                return (
                  <SwiperSlide
                    key={tour.id}
                    className="rounded-2xl overflow-hidden border border-white/30"
                  >
                    <div className="relative w-full h-full">
                      {/* Image */}
                      {image ? (
                        <img
                          src={image}
                          alt={tour.name}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/10 flex items-center justify-center rounded-2xl">
                          <MdTravelExplore className="text-white/30 text-6xl" />
                        </div>
                      )}

                      {/* Price badge */}
                      {tour.price != null && (
                        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-md bg-white/30 border border-white/20 text-white">
                          {locale === "es" ? "Desde" : "From"} ${Number(tour.price).toLocaleString()}{" "}
                          {tour.currency ?? "USD"}
                        </div>
                      )}

                      {/* Bottom info */}
                      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-900/40 to-transparent backdrop-blur-lg rounded-b-2xl border-t border-white/30 p-5 flex flex-col justify-center">
                        <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 leading-snug line-clamp-2">
                          {tour.name}
                        </h2>
                        {tour.description && (
                          <p className="text-xs sm:text-sm text-gray-100 mb-3 line-clamp-2">
                            {tour.description}
                          </p>
                        )}
                        {/* Duration como sustituto de reviews */}
                        {tour.duration && (
                          <p className="text-xs text-gray-300">
                            ⏱ {tour.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}