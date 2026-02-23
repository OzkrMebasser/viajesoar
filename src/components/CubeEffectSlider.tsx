"use client";

import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCube, Autoplay } from "swiper/modules";
import { Star, StarHalf, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";

import SplitText from "./SplitText";
import "aos/dist/aos.css";
import AOS from "aos";

import "swiper/css";
import "swiper/css/effect-cube";
import ParticlesCanvas from "./ParticlesCanvas";
import ButtonArrow from "./ui/ButtonArrow";
import SplitTextVanilla from "./SplitTextVanilla";

type Locale = "es" | "en";

interface Tour {
  id: number;
  image: string;
  title: string;
  description: string;
  cost: string;
  reviews: number;
  rating: number;
  darkText: boolean;
}

interface StarRatingProps {
  rating: number;
}

const tours: Tour[] = [
  {
    id: 1,
    image:
      "https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/49db1b5f-09f6-4433-be57-51687585600c",
    title: "Walking Tour in Florence",
    description:
      "Discover the fascinating beauty of this historic city by strolling through the rich cultural tapestry that makes Florence a timeless destination.",
    cost: "from $230 per group",
    reviews: 138,
    rating: 4.5,
    darkText: false,
  },
  {
    id: 2,
    image:
      "https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/2d165721-fe2e-4cf0-a63e-20bc5bc3f847",
    title: "Edinburgh Guided Tour",
    description:
      "Explore the city's majestic castles and fascinating history by joining our guided tour for an unforgettable journey through Scotland's capital.",
    cost: "from $380 per group",
    reviews: 307,
    rating: 5,
    darkText: false,
  },
  {
    id: 3,
    image:
      "https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/d311d1de-7382-4c03-b083-5f7e88458158",
    title: "New York Sightseeing Tour",
    description:
      "Experience the energy and excitement of New York City from Times Square's dazzling lights to the serene beauty of Central Park.",
    cost: "from $99 per adult",
    reviews: 1152,
    rating: 4.5,
    darkText: true,
  },
  {
    id: 4,
    image:
      "https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/be223a30-52d1-4a0b-8d57-2e52f02e2245",
    title: "Japan Panoramic Tours",
    description:
      "Embark on a magical journey through Tokyo by discovering the beauty of the city as cherry blossom trees paint the streets in hues of pink.",
    cost: "from $117 per adult",
    reviews: 619,
    rating: 4,
    darkText: true,
  },
];

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(rating)) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />,
      );
    } else if (i < rating) {
      stars.push(
        <StarHalf
          key={i}
          className="w-4 h-4 fill-yellow-500 text-yellow-500"
        />,
      );
    } else {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-400" />);
    }
  }
  return <div className="flex gap-1">{stars}</div>;
};

export default function CubeEffectSlider(): React.ReactNode {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const locale = useLocale() as Locale;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ✅ TODOS los useEffect ANTES de cualquier return condicional
  useEffect((): void => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // AOS init — siempre inicializar, hacer refresh cuando cambia isMobile
  // para que detecte el atributo data-aos tras el render condicional
  // useEffect(() => {
  //   if (!mounted) return;
  //   AOS.init({ once: true, duration: 800, offset: 100 });
  //   AOS.refresh();
  // }, [mounted, isMobile]);

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
      offset: 120,
      easing: "ease-out-cubic",
    });
  }, []);

  // 🔍 Zoom out effect SOLO MOBILE
  useEffect(() => {
    if (!isMobile || !mounted) return;

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

  // ✅ Return condicional DESPUÉS de todos los hooks
  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-gradient-theme flex items-center justify-center px-4 sm:px-8 lg:px-16 py-12">
      <ParticlesCanvas />

      <div
        ref={scrollContainerRef}
        className="relative z-20 w-full max-w-6xl"
      >
          <div
        {...(!isMobile ? { "data-aos": "zoom-in-up" } : {})}
        className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
      >
        {/* Text Section */}
        <div className="flex flex-col justify-center">
          <SplitTextVanilla
            text={locale === "es" ? "Aventuras " : "SOARprising"}
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
            Our tours are designed to transport you to the heart of the world's
            most captivating destinations, creating memories that will last a
            lifetime. You can uncover the hidden gems, iconic landmarks, and
            unique cultural treasures that make each destination special.
          </p>

          <ButtonArrow
            title={locale === "es" ? "Explorar Tours" : "Explore Tours"}
          />
        </div>

        {/* Swiper Slider */}
        <div className="flex justify-center">
          <Swiper
            modules={[EffectCube, Autoplay]}
            effect="cube"
            grabCursor={true}
            loop={true}
            speed={1000}
            autoplay={{
              delay: 2600,
              pauseOnMouseEnter: true,
            }}
            cubeEffect={{
              shadow: false,
              slideShadows: true,
              shadowOffset: 10,
              shadowScale: 0.94,
            }}
            className="w-full max-w-sm"
            style={{ width: "320px", height: "420px" } as React.CSSProperties}
          >
            {tours.map((tour: Tour) => (
              <SwiperSlide
                key={tour.id}
                className="rounded-2xl overflow-hidden border border-white/30"
              >
                <div className="relative w-full h-full">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />

                  <div
                    className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-md bg-white/30 border border-white/20 ${
                      tour.darkText ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {tour.cost}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-900/40 to-transparent backdrop-blur-lg rounded-b-2xl border-t border-white/30 p-5 flex flex-col justify-center">
                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 leading-snug">
                      {tour.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-100 mb-3 line-clamp-2">
                      {tour.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <StarRating rating={tour.rating} />
                      <span className="text-xs text-gray-200">
                        {tour.reviews} reviews
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      </div>
    
    </div>
  );
}
