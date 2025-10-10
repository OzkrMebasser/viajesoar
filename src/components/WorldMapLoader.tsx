"use client";
import React from "react";
import LittlePlane from "@/components/Airplane/LittlePlane";
import { useTranslations } from "next-intl";

const WorldMapLoader = () => {
  const t = useTranslations("Navigation");

  const locations = [
    { name: "Paris", top: "38%", left: "49%" },
    { name: "New York", top: "38%", left: "28%" },
    { name: "Tokyo", top: "44%", left: "83%" },
    { name: "Rio de Janeiro", top: "76%", left: "36%" },
    { name: "Cairo", top: "50%", left: "53%" },
    { name: "Sydney", top: "78%", left: "88%" },
    { name: "Rome", top: "42%", left: "51.5%" },
    { name: "London", top: "33%", left: "47%" },
    { name: "Bangkok", top: "53%", left: "74%" },
    { name: "Dubai", top: "48%", left: "61%" },
    { name: "Vancouver", top: "30%", left: "15%" },
    { name: "Bali", top: "65%", left: "80%" },
    { name: "Cancún", top: "52%", left: "23%" },
    { name: "Cape Town", top: "82%", left: "53%" },
  ];

  return (
    <div className="bg-slate-900/90 min-h-screen flex flex-col items-center justify-center">
      <h1 className="slide-in-blurred-top z-50 absolute pb-[22rem] lg:pb-[25rem] text-xl sm:text-2xl md:text-3xl font-semibold text-center tracking-wide  uppercase text-white ">
        VIAJE
        <span className="animate-pulse text-[#179bed] drop-shadow-[0_0_3px_black] ml-1">
          Soar
        </span>
      </h1>

      <h1 className="slide-in-blurred-bottom z-50 absolute pt-[22rem] lg:pt-[7rem] text-xl sm:text-2xl md:text-3xl font-semibold text-center tracking-wide px-6 uppercase text-white ">
        {t("soar1")}
        <span className="animate-pulse text-[#179bed] drop-shadow-[0_0_3px_black] mr-1">
          Soar
        </span>
        {t("soar2")}
      </h1>

      <div className="relative w-full max-w-6xl flex justify-center">
        <img
          src="/worldMap.png"
          alt="World Map"
          className="w-full h-auto select-none pointer-events-none "
        />

        {locations.map((loc, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center"
            style={{
              top: loc.top,
              left: loc.left,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className=" lg:ml-[55px]  px-1.5 py-0.5 rounded-md bg-slate-800/70 backdrop-blur-sm text-white text-[7px] xs:text-[8px] sm:text-xs md:text-sm whitespace-nowrap">
              {loc.name}
            </div>
            <span className="block rounded-full bg-[#179bed] shadow-lg animate-pulse w-[3px] h-[3px] xs:w-[4px] xs:h-[4px] sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 ring-[1px] xs:ring-[2px] sm:ring-[3px] md:ring-[4px] ring-[#179bed]/30"></span>
          </div>
        ))}

        {/* ✈️ Aviones */}
        {/* ✈️ Cancun - London */}
        <LittlePlane
          from={{ top: "52%", left: "23%" }}
          to={{ top: "36%", left: "49%" }}
          duration={22}
        />
        {/* ✈️ New York - Cairo */}
        <LittlePlane
          from={{ top: "38%", left: "28%" }}
          to={{ top: "50%", left: "53%" }}
          duration={18}
        />
        {/* ✈️ Rome - Tokyo */}
        <LittlePlane
          from={{ top: "42%", left: "51%" }}
          to={{ top: "44%", left: "83%" }}
          duration={26}
        />
        {/* ✈️ Tokio - Sydney */}
        <LittlePlane
          from={{ top: "44%", left: "83%" }}
          to={{ top: "78%", left: "88%" }}
          duration={20}
        />
        {/* ✈️ Paris - Vancouver */}

        <LittlePlane
          from={{ top: "33%", left: "47%" }}
          to={{ top: "30%", left: "15%" }}
          duration={24}
        />

        {/* ✈️ Vancouver - Cancun */}
        <LittlePlane
          from={{ top: "30%", left: "14%" }}
          to={{ top: "52%", left: "23%" }}
          duration={18}
        />
        {/* ✈️ Dubai - Bali */}
        <LittlePlane
          from={{ top: "48%", left: "61%" }}        
          to={{ top: "65%", left: "80%" }}
          duration={28}
        />
        {/* ✈️ Rio de Janeiro - Cape Town */}
        <LittlePlane
          from={{ top: "80%", left: "43%" }}
          to={{ top: "82%", left: "53%" }}
          duration={32}
        />
        {/* ✈️ Bangkok - Rio de Janeiro */}
        <LittlePlane
          from={{ top: "65%", left: "82%" }}
          to={{ top: "76%", left: "43%" }}
          duration={40}
        />

      </div>
    </div>
  );
};

export default WorldMapLoader;
