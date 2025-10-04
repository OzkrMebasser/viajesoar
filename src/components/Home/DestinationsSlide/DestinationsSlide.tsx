"use client";

import React from "react";
import {
  FaEuroSign,
  FaGlobeAmericas,
  FaGlobeAsia,
  FaGlobeAfrica,
} from "react-icons/fa";
import { GiEarthAmerica, GiPalmTree, GiAztecCalendarSun } from "react-icons/gi";
import { MdTravelExplore } from "react-icons/md";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "./DestinationsSlide.css";
import "swiper/css";
import "swiper/css/free-mode";

// Importar el hook
import { useDestinationRegions } from "@/lib/hooks/useDestinations";
import Preloader from "@/components/Airplane/Preloader";

// Mapa de iconos (importante para convertir string a componente)
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

export default function TravelDestinations() {
  // Usar el hook para obtener datos de Supabase
  const { regions, loading, error } = useDestinationRegions();

//   console.log(" Regions:", regions);
//   console.log(" Loading:", loading);
//   console.log(" Error:", error);

  // Manejo de estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-4 flex items-center justify-center">
        <Preloader isLoading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-4 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Descubre el Mundo
          </h1>
          <p className="text-xl text-slate-300">
            Explora destinos increíbles alrededor del planeta
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Autoplay, FreeMode]}
          freeMode={true}
          grabCursor={true}
          slidesPerView={3}
          spaceBetween={30}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          className="no-scrollbar"
        >
          {regions.map((destination, index) => {
            // Convertir el string del icono al componente React
            const IconComponent = iconMap[destination.icon] || MdTravelExplore;
            
            return (
              <SwiperSlide
                key={index}
                className="min-w-[300px] md:min-w-[350px]"
              >
                <div className="bg-white/5 rounded-2xl shadow-xl overflow-hidden relative group">
                  {/* Background */}
                  <div className="relative h-72">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      draggable="false"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${destination.gradient} opacity-60`}
                    />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                        <IconComponent className="text-white text-2xl" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {destination.name}
                      </h3>
                      <p className="text-slate-200 mb-3">
                        {destination.description}
                      </p>
                      <button className="bg-white text-slate-900 px-5 py-2 rounded-full font-semibold hover:bg-slate-100 transition">
                        Explorar
                      </button>
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