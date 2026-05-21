// "use client";
// import { useEffect, useRef } from "react";
// import SplitText from "@/components/SplitText";
// import { gsap } from "gsap";


// const SEGMENT_COUNT = 34;

// interface AircraftBannerProps {
//   locale?: string;
// }

// export default function AircraftBanner({ locale = "en" }: AircraftBannerProps) {
//   const text =
//     locale === "es"
//       ? "Tu agencia de viajes online de confianza"
//       : "Your trusted online travel agency";

//   const marqueeRef = useRef<HTMLDivElement>(null);
//   const ctxRef = useRef<gsap.Context | null>(null);

//   useEffect(() => {
//     const el = marqueeRef.current;
//     if (!el) return;

//     ctxRef.current = gsap.context(() => {
//       gsap.fromTo(
//         el,
//         { x: "100vw" },
//         {
//           x: () => -(el.offsetWidth + window.innerWidth),
//           duration: 22,
//           ease: "none",
//           repeat: -1,
//         }
//       );
//     });

//     return () => {
//       ctxRef.current?.revert();
//     };
//   }, []);

//   return (
//     <div className="aircraft-banner-root">
//       <div ref={marqueeRef} className="aircraft-marquee">
//         <div className="aircraft-mover">
//           <div className="aircraft-scene">
//             <div className="aircraft-propeller" />
//             <div className="aircraft-plane" />

//             <div className="banner-strip">
//               {Array.from({ length: SEGMENT_COUNT }, (_, i) => (
//                 <div
//                   key={i}
//                   className="banner-segment"
//                   style={{ "--i": i } as React.CSSProperties}
//                 >
//                   <div className="banner-segment-inner">
//                     <SplitText
//                       text={text}
//                       className="uppercase text-md sm:text-3xl md:text-4xl font-black text-white leading-tight [text-shadow:2px_2px_12px_rgba(0,0,0,1)]"
//                       delay={25}
//                       duration={0.5}
//                       ease="power2.out"
//                       splitType="words"
//                       from={{ opacity: 0, y: 20 }}
//                       to={{ opacity: 1, y: 0 }}
//                       textAlign="center"
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }