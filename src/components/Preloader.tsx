'use client';
import { useEffect, useRef } from 'react';
import AirplaneUp from './Airplane/AirplaneUp';
import { gsap } from 'gsap';

export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (preloaderRef.current) {
          preloaderRef.current.style.display = 'none';
        }
      }
    });

    tl.from(textRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out"
    })
    .to(textRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.6,
      delay: 0.5,
      ease: "power2.in"
    })
    .to(preloaderRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut"
    });
  }, []);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-50 bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center"
    >
      <div ref={textRef} className="">
        <AirplaneUp />
        
        <h1 className='text-white text-4xl font-bold mt-15'>Let's Soar Your Dreams </h1>
      </div>
    </div>
  );
}