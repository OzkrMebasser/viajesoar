"use client";
import { useEffect, useRef } from "react";
import AirplaneUp from "./Airplane/AirplaneUp";
import { gsap } from "gsap";

export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (preloaderRef.current) {
          preloaderRef.current.style.display = "none";
        }
      },
    });

    tl.from(textRef.current, {
      opacity: 0,
      y: 30,
      duration: 2,
      ease: "power2.out",
    })
      .to(textRef.current, {
        opacity: 0,
        y: -30,
        duration: 1,
        delay: 0.5,
        ease: "power2.in",
      })
      .to(preloaderRef.current, {
        opacity: 0,
        duration: 2,
        ease: "power2.inOut",
      });
  }, []);

  return (
    <>
      <style jsx>{`
        .cloudsBg {
          padding: 100px 0;
          overflow: hidden;
        }

        #clouds {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* Clouds */
        .cloud {
          width: 200px;
          height: 60px;
          background: #fff;
          border-radius: 200px;
          position: relative;
          opacity: 0.5;
        }

        .cloud:before,
        .cloud:after {
          content: "";
          position: absolute;
          background: #fff;
          width: 100px;
          height: 80px;
          top: -15px;
          left: 102px;
          border-radius: 100px;
          transform: rotate(30deg);
        }

        .cloud:after {
          width: 120px;
          height: 120px;
          top: -55px;
          left: auto;
          right: 15px;
        }

        .x1 {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1);
          animation: moveclouds 4s linear infinite;
        }

        .x2 {
          top: 55%;
          left: 30%;
          transform: translate(-50%, -50%) scale(0.6);
          opacity: 0.6;
          animation: moveclouds 5s linear infinite;
        }

        .x3 {
          top: 45%;
          left: 70%;
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0.8;
          animation: moveclouds 6s linear infinite;
        }

        .x4 {
          top: 60%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.75);
          opacity: 0.75;
          animation: moveclouds 5s linear infinite;
        }

        .x5 {
          top: 40%;
          left: 40%;
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0.8;
          animation: moveclouds 4s linear infinite;
        }

        @keyframes moveclouds {
          0% {
            margin-top: -1000px;
          }
          100% {
            margin-top: 1000px;
          }
        }

     
        
      `}</style>

      <div
        // ref={preloaderRef}
        className="fixed inset-0 z-50 cloudsBg flex items-center justify-center bg-linear-to-t from-sky-800 to-indigo-500"
      >
  
        {/* Nubes */}
        <div
          // ref={textRef}
          id="clouds"
        >
          <div className="cloud x1"></div>
          <div className="cloud x2"></div>
          <div className="cloud x3"></div>
          <div className="cloud x4"></div>
          <div className="cloud x5"></div>
        </div>

        {/* Avión y texto */}
        <div
          // ref={textRef}
          className="relative z-10"
        >
          <AirplaneUp />
          <h1 className="text-white text-4xl font-bold mt-15">
            Let's Soar Your Dreams
          </h1>
        </div>
      </div>
    </>
  );
}
