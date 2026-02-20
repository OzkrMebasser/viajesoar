"use client";
import Image from "next/image";
import { useTheme } from "@/lib/context/ThemeContext";
import { useState, useEffect } from "react";

interface LogoProps {
  isScrolled: boolean;
  className?: string;
}

const Logo = ({ isScrolled, className = "" }: LogoProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const getSoarText = () => {
    if (theme === "vibrant") return "text-[#ff9f1a]";
    if (theme === "light") return "text-[#0891b2]";
    return "text-[#01ac9d]";
  };

  return (
    <div className={`flex items-center ${className}`}>
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

      <strong>
        <span className={`text-[25px] lg:text-3xl font-bold tracking-wider ${isScrolled ? "" : "[text-shadow:_2px_1px_6px_#000000]"}`}>
          <span>VIAJE</span>
          <span className={`soar ml-px ${isScrolled ? "accent" : mounted ? getSoarText() : "text-[#01ac9d]"}`}>
            SOAR
          </span>
        </span>
      </strong>
    </div>
  );
};

export default Logo;