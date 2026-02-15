"use client";
import Image from "next/image";
import { useTheme } from "@/lib/context/ThemeContext";

interface LogoProps {
  isScrolled: boolean;
  className?: string;
}

const Logo = ({ isScrolled, className = "" }: LogoProps) => {
  const { theme } = useTheme();
  
  // Shadow para SOAR (blanco en vibrant, negro en otros)
  const getSoarText = () => {
    if (theme === "vibrant") {
      return "text-[#ff9f1a]";
    }
    if (theme === "light") {
      return "text-[#0891b2]";
    }
    if (theme === "dark") {
      return "text-[#01ac9d]";
    }
    return "accent";
  };

  // Shadow para VIAJE (blanco en light, negro en otros)
  const getViajeShadow = () => {
    if (theme === "light") {
      return "[text-shadow:_3px_0px_20px_#d6d6d6]";
    }
    return "[text-shadow:_3px_0px_20px_#000000]";
  };

  return (
    <div
      className={`flex items-center   ${className}`}
    >
      {/* Imagen - tamaño pequeño fijo */}
      <div className="relative">
        <Image
          src="/VIAJES-soar-logo-blues.png"
          alt="Logo"
          width={90}
          height={90}
          priority
          className={`transition-all duration-500 object-contain h-auto w-[30px] lg:w-[40px] ${isScrolled ? "" : "drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]"}`}
        />
      </div>

      {/* Texto - tamaño pequeño fijo */}
      <strong>
        <span className={`text-[25px] lg:text-3xl font-bold tracking-wider ${
              isScrolled 
                ? "" 
                : "[text-shadow:_2px_1px_6px_#000000]"
            }`}>
          {/* VIAJE - shadow blanco en light, negro en otros */}
          <span 
            // className={
            //   isScrolled 
            //     ? "" 
            //     : "[text-shadow:_3px_10px_20px_#000000]"
            // }
          >
            VIAJE
          </span>
          {/* SOAR - shadow blanco en vibrant, negro en otros */}
          <span 
            className={`soar  ml-px ${
              isScrolled ? "accent" : getSoarText()
            }`}
          >
            SOAR
          </span>
        </span>
      </strong>
    </div>
  );
};

export default Logo;

