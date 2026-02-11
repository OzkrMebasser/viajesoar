"use client";
import React, { useEffect, useRef, useState } from "react";
import DestinationsSlideGSAP from "@/components/Home/DestinationsSlide/DestinationsSlideGSAP";
import PackagesSlideGSAP from "@/components/Packages/PackagesSlideGSAP";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScrollWrapper() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkDevice();
    window.addEventListener("resize", checkDevice);
    
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    if (!isMounted || !isDesktop || !wrapperRef.current || !sectionsRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      const wrapper = wrapperRef.current;
      const sections = sectionsRef.current;

      if (!wrapper || !sections) return;

      const totalWidth = sections.scrollWidth;
      const containerWidth = wrapper.offsetWidth;
      const scrollDistance = totalWidth - containerWidth;

      if (scrollDistance <= 0) return;

      const scrollTween = gsap.to(sections, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: () => `+=${scrollDistance * 2}`, // 👈 Aumentado para más scroll
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: false,
        },
      });

      return () => {
        scrollTween.kill();
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.trigger === wrapper) {
            trigger.kill();
          }
        });
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [isMounted, isDesktop]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-screen overflow-hidden" // 👈 h-screen aquí
    >
      <div
        ref={sectionsRef}
        className="flex h-full will-change-transform" // 👈 h-full para heredar altura
      >
        {/* 🎨 Cada sección ocupa 100vw */}
        <div className="w-screen h-full flex-shrink-0"> {/* 👈 w-screen y h-full */}
          <DestinationsSlideGSAP />
        </div>

        <div className="w-screen h-full flex-shrink-0"> {/* 👈 w-screen y h-full */}
          <PackagesSlideGSAP />
        </div>
      </div>
    </div>
  );
}