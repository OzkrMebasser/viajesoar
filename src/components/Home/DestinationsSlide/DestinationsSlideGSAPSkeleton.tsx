"use client";

export default function DestinationsSlideGSAPSkeleton() {
  return (
    <div className="relative min-h-screen py-16 px-4 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Particles background simulado */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative max-w-8xl mx-auto z-20">
        {/* Header con títulos */}
        <div className="text-center mb-10">
          {/* Título principal */}
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gray-600 rounded animate-pulse"
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>

          {/* Subtítulo */}
          <div className="flex justify-center">
            <div className="w-64 md:w-96 h-4 md:h-6 bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Indicador de scroll - solo mobile */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0 z-30 md:hidden">
            <div className="bg-gray-600/50 rounded-full p-3 animate-pulse">
              <div className="w-5 h-5 bg-gray-500 rounded" />
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
                  <div className="bg-white/5 rounded-2xl overflow-hidden relative h-full">
                    {/* Imagen */}
                    <div className="relative h-80 bg-gray-700 animate-pulse" />

                    {/* Contenido superpuesto */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      {/* Icono superior derecha */}
                      <div className="flex justify-end">
                        <div className="w-12 h-12 bg-gray-600/50 backdrop-blur-md rounded-full animate-pulse" />
                      </div>

                      {/* Contenido inferior */}
                      <div className="space-y-4">
                        {/* Título */}
                        <div className="w-3/4 h-7 bg-gray-600 rounded animate-pulse" />
                        
                        {/* Descripción */}
                        <div className="space-y-2">
                          <div className="w-full h-3 bg-gray-700 rounded animate-pulse" />
                          <div className="w-4/5 h-3 bg-gray-700 rounded animate-pulse" />
                        </div>

                        {/* Botón */}
                        <div className="w-28 h-9 bg-gray-500 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile scroll indicators (dots) */}
        <div className="flex justify-center gap-3 mt-6 md:hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`
                w-2.5 h-2.5 rounded-sm
                ${index === 0 ? 'bg-gray-400 w-3 h-3' : 'bg-gray-600'}
                animate-pulse
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}