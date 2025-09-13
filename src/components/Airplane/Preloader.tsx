"use client";
import { useRef } from "react";
// import AirplaneUp from "./AirplaneUp";
import styles from "./AirplaneSoarPreloader.module.css";
import { useTranslations } from "next-intl";

interface PreloaderProps {
  isLoading: boolean;
}

export default function Preloader({ isLoading }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("Navigation");

  if (!isLoading) return null;

  return (
    <div
      ref={preloaderRef}
      aria-hidden="true"
      className={`fixed inset-0 z-50 ${styles.cloudsBg} flex items-center justify-center bg-gradient-to-b from-indigo-700 to-blue-400`}
    >
      {/* Nubes */}
      {/* <div ref={textRef} className={styles.clouds}>
        <div className={`${styles.cloud} ${styles.x1}`}></div>
        <div className={`${styles.cloud} ${styles.x2}`}></div>
        <div className={`${styles.cloud} ${styles.x3}`}></div>
        <div className={`${styles.cloud} ${styles.x4}`}></div>
        <div className={`${styles.cloud} ${styles.x5}`}></div>
      </div> */}

      {/* Avión y texto */}
      <div ref={textRef} className="relative z-10">
        <img
          src="/viajesoar-logo-final.png"
          className="drop-shadow-[5px_8px_5px_rgba(0,0,0,.5)] mx-auto w-[200px] lg:w-[300px]"
          alt=""
        />
        <h1
          className={`${styles.title} rotate-[-7deg] text-4xl lg:text-6xl text-center tracking-wide font-bold `}
        >
          {t("soar1")}
          <span className="animate-pulse text-[#b9e215]">Soar</span>
          {t("soar2")}
        </h1>
      </div>
    </div>
  );
}