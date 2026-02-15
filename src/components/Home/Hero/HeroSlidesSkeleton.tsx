"use client";

import GhostButtonArrowSkeleton from "@/components/ui/GhostButtonArrowSkeleton";

export default function HeroSkeleton() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white z-50">
      
      {/* Fondo / imagen hero */}
      <div className="absolute inset-0 bg-gray-800 animate-pulse" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Cards miniaturas */}
      <div className="absolute bottom-20 right-6 flex gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="
              w-[90px] h-[140px]
              md:w-[120px] md:h-[180px]
              lg:w-[200px] lg:h-[300px]
              bg-gray-700 rounded-lg animate-pulse
            "
          />
        ))}
      </div>

      {/* Texto principal */}
      <div className="absolute left-4 sm:left-4 md:left-18 top-20 sm:top-24 md:top-24 z-20 max-w-xl">
        
        {/* place + country */}
        <div className="mb-4 space-y-2">
          <div className="w-4 sm:w-6 md:w-8 h-1 bg-gray-600 rounded-full animate-pulse" />
          <div className="w-20 h-3 bg-gray-600 rounded animate-pulse" />
          <div className="w-32 h-3 bg-gray-600 rounded animate-pulse" />
        </div>

        {/* títulos */}
        <div className="space-y-3 mb-8">
          <div className="w-64 md:w-96 h-10 md:h-16 bg-gray-500 rounded animate-pulse" />
          <div className="w-56 md:w-80 h-10 md:h-16 bg-gray-500 rounded animate-pulse" />
        </div>

        {/* descripción */}
        <div className="space-y-2 mb-6">
          <div className="w-full h-3 bg-gray-600 rounded animate-pulse" />
          <div className="w-5/6 h-3 bg-gray-600 rounded animate-pulse" />
          <div className="w-4/6 h-3 bg-gray-600 rounded animate-pulse" />
        </div>

        {/* botones */}
        <div className="flex items-center gap-4">
       
          {/* Ghost button skeleton */}
          <GhostButtonArrowSkeleton />
        </div>
      </div>
    </div>
  );
}
