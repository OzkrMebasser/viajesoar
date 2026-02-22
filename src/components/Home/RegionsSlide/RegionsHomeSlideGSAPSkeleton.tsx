"use client";

import ParticlesCanvas from "@/components/ParticlesCanvas";

export default function RegionsHomeSlideGSAPSkeleton() {
  return (
    <div className="relative min-h-screen py-16 px-4 overflow-hidden bg-gradient-theme">
      <ParticlesCanvas />
      <div className="relative max-w-8xl mx-auto z-20">
        {/* Header con títulos */}
        <div className="text-center mb-10">
          {/* Título principal */}
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16  rounded bg-skeleton-base shimmer"
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>

          {/* Subtítulo */}
          <div className="flex justify-center">
            <div className="w-64 md:w-96 h-4 md:h-6  bg-skeleton-base rounded shimmer" />
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Indicador de scroll - solo mobile */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0 z-30 md:hidden">
            <div className="bg-skeleton-base rounded-full shimmer p-3 animate-pulse">
              <div className="w-5 h-5 bg-skeleton-base rounded shimmer" />
            </div>
          </div>

          {/* Carousel cards */}
          <div className="overflow-x-auto overflow-y-hidden md:overflow-hidden -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex gap-6 md:gap-8 pb-4 md:pb-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[280px] w-[280px] sm:min-w-[300px] sm:w-[300px] md:min-w-[350px] md:w-[350px] flex-shrink-0"
                >
                  <div className=" rounded-2xl overflow-hidden relative h-full">
                    {/* Imagen */}
                    <div className="relative h-80 bg-skeleton-base  shimmer" />

                    {/* Contenido superpuesto */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      {/* Icono superior derecha */}
                      <div className="flex justify-end">
                        <div className="w-12 h-12 bg-skeleton-base  shimmer backdrop-blur-md rounded-full animate-pulse" />
                      </div>

                      {/* Contenido inferior */}
                      <div className="space-y-4">
                        {/* Título */}
                        <div className="w-3/5 h-7 bg-skeleton-base rounded shimmer" />

                        {/* Descripción */}
                        <div className="space-y-2">
                          <div className="w-1/2 h-3 bg-skeleton-base rounded shimmer" />
                        </div>

                        {/* Botón */}
                        <div className="w-33 h-10 bg-skeleton-base rounded-sm animate-pulse" />
                      </div>
                      {/* Icono superior derecha */}
                      <div className="absolute bottom-4 right-4">
                        <div className="  w-8 h-8 bg-skeleton-base  shimmer backdrop-blur-md rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile scroll indicators (dots) */}
        <div className="flex justify-center gap-1.5 mt-6 md:hidden">
          {Array.from({ length: 6 }).map((_, index) => {
            const isActive = index === 0; // simulamos el primero activo

            return (
              <div
                key={index}
                style={{
                  width: "6px",
                  height: "6px",
                  transition: "all 0.3s ease-in-out",
                  transform: isActive
                    ? "rotate(45deg) scale(1.05)"
                    : "rotate(0deg)",
                }}
                className={`
          ${
            isActive
              ? "bg-skeleton-base shimmer"
              : "bg-skeleton-base opacity-50 shimmer"
          }
        `}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
