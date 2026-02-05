"use client";
import Image from "next/image";
interface LogoProps {
  isScrolled: boolean;
  className?: string;
}

const Logo = ({ isScrolled, className = "" }: LogoProps) => {
  return (
    <div
      className={`flex items-center  group transition-all duration-500 ${className}`}
    >
      <div className="relative">
        {/* <img
          src="/VIAJES-soar-logo-blues.png"
          alt="ViajeSoar Logo"
          // La magia ocurre aquí: las clases cambian según isScrolled
          className={`transition-all duration-500 object-contain ${
            isScrolled
              ? "h-auto w-[30px] lg:w-[40px] "
              : "w-[70px] h-[70px] lg:w-[90px] lg:h-[90px] group-hover:scale-110 mt-8 ml-2"
             
          }`}
        /> */}

        <Image
          src="/VIAJES-soar-logo-blues.png"
          alt="Logo"
          width={90}
          height={90}
          priority
          className={`transition-all duration-500 object-contain ${
            isScrolled
              ? "h-auto w-[30px] lg:w-[40px] "
              : "w-[70px] h-[70px] lg:w-[90px] lg:h-[90px] group-hover:scale-110 mt-8 ml-2"
             
          }`}
        />
      </div>

      {/* El texto desaparece isScrolled ? */}
      <strong
        className={`transition-all duration-200 ${isScrolled ? "opacity-100" : "opacity-0 invisible w-0"}`}
      >
        <span className="text-[25px] lg:text-3xl font-bold tracking-wider text-theme">
          VIAJE<span className="soar accent ml-px">SOAR</span>
        </span>
      </strong>
    </div>
  );
};

export default Logo;
