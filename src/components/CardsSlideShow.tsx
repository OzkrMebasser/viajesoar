"use client";

import React, { useEffect, useState } from "react";
import "../app/globals.css"; // Asegúrate de que Tailwind esté importado
interface CardsSlideShowProps {
  images: string[];
  interval?: number;
  className?: string;
  maxImages?: number;
}

const CardsSlideShow: React.FC<CardsSlideShowProps> = ({
  images,
  interval = 2000,
  className = "",
  maxImages,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Validar que images sea un array válido
  const validImages = Array.isArray(images)
    ? images.filter(
        (img) => img && typeof img === "string" && img.trim() !== "",
      ).slice(0, maxImages ?? undefined)

    : [];

  // ELIMINA el useEffect del progress que estaba arriba

  useEffect(() => {
    if (validImages.length === 0) {
      console.warn("⚠️ No valid images provided to CompactCircularSlideshow");
      return;
    }

    // Precargar la primera imagen
    const img = new Image();
    img.src = validImages[0];
    img.onload = () => setIsLoaded(true);

    // Reiniciar progress DENTRO del useEffect
    let currentProgress = 0;
    setProgress(0);

    // Timer para el progress
    const intervalTime = 20;
    const increment = 100 / (interval / intervalTime);

    const progressTimer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
      }
      setProgress(currentProgress);
    }, intervalTime);

    // Timer para cambiar la imagen
    const slideTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, interval);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(slideTimer);
    };
  }, [currentIndex, validImages.length, interval]);
  if (validImages.length === 0) {
    return (
      <div
        className={`${className} bg-gray-800 flex items-center justify-center`}
      >
        <p className="text-white/50 text-sm">No images</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className} overflow-hidden`}>
      {/* Imágenes con fade transition */}
      {validImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {validImages.length > 1 && (
        <div
          className="absolute z-20 flex items-center justify-center"
          style={{
            bottom: `calc(14px + env(safe-area-inset-bottom))`,
            right: "14px",
          }}
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Ring fino */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#ffffff ${progress}%, rgba(255,255,255,0.15) 0%)`,
                WebkitMask: "radial-gradient(circle, transparent 50%, red 61%)",
                mask: "radial-gradient(circle, transparent 50%, red 61%)",
              }}
            />

            {/* Centro */}
            <div className="relative w-7 h-7 rounded-full bg-black flex items-center justify-center text-theme text-[8px] font-semibold ">
              <span>{currentIndex + 1}</span>
              <span className="mx-[1px] opacity-50">/</span>
              <span className="opacity-50">{validImages.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsSlideShow;
