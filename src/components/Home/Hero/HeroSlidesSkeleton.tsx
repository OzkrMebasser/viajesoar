"use client";
import ParticlesCanvas from "@/components/ParticlesCanvas";

export default function HeroSlidesSkeleton() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-theme   z-50">
      <ParticlesCanvas />

      {/* Fondo / imagen hero */}
      <div className="absolute inset-0 bg-skeleton-base shimmer" />

      {/* Cards miniaturas */}
      <div className="absolute bottom-[30px] -right-16 lg:-right-32 flex gap-[15px] sm:gap-[20px] lg:gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="
              w-[90px] sm:w-[120px] lg:w-[200px]
              h-[22svh] sm:h-[22svh] lg:h-[300px]
              max-h-[180px] lg:max-h-none
              bg-skeleton-base rounded-lg shimmer
            "
          />
        ))}
      </div>

      {/* Texto principal */}
      <div className="absolute left-4 sm:left-4 md:left-18 top-42 md:top-24 z-20 max-w-xl">
        {/* place + country */}
        <div className="mb-4 space-y-2">
          <div className="w-4 sm:w-6 md:w-8 h-1 bg-skeleton-base rounded-full shimmer" />
          <div className="w-20 h-3 bg-skeleton-base rounded shimmer" />
          <div className="w-32 h-3 bg-skeleton-base rounded shimmer" />
        </div>

        {/* títulos */}
        <div className="space-y-3 mb-8">
          <div className="w-64 md:w-96 h-10 md:h-16 bg-skeleton-base rounded shimmer" />
          <div className="w-56 md:w-80 h-10 md:h-16 bg-skeleton-base rounded shimmer" />
        </div>

        {/* descripción */}
        <div className="space-y-2 mb-6">
          <div className="w-full h-3 bg-skeleton-base rounded shimmer" />
          <div className="w-5/6 h-3 bg-skeleton-base rounded shimmer" />
          <div className="w-4/6 h-3 bg-skeleton-base rounded shimmer" />
        </div>

        {/* botones */}
        <div className="space-y-3 mb-8">
          <div className="w-32 md:w-46 h-10 md:h-12 bg-skeleton-base rounded shimmer" />
        </div>
      </div>
    </div>
  );
}
