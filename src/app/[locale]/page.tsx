import TravelDestinations from "@/components/Home/DestinationsSlide/DestinationsSlide";
import TravelSlideshow from "@/components/Home/HeroTravelSlides";
import CubeEffectSlider from "@/components/CubeEffectSlider";
import DestinationsSlideGSAP from "@/components/Home/DestinationsSlide/DestinationsSlideGSAP";

import PackagesSlideGSAP from "@/components/Packages/PackagesSlideGSAP";

export default function Home() {
  return (
    <div>
      <TravelSlideshow />
      <DestinationsSlideGSAP />
      <PackagesSlideGSAP />
      <CubeEffectSlider />
    </div>
  );
}

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { MdAttachMoney } from "react-icons/md";
// import { FaSuitcase, FaMapMarkedAlt } from "react-icons/fa";
// import { useRouter } from "next/navigation";
// import { useLocale } from "next-intl";
// import SplitText from "@/components/SplitText";
// import ParticlesCanvas from "@/components/ParticlesCanvas";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// type Locale = "es" | "en";

// interface HardcodedPackage {
//   id: string;
//   name: string;
//   slug: string;
//   description: string;
//   images: string[];
//   price_from: number;
//   currency: string;
//   visited_countries: { name: string }[];
// }

// export default function PackagesSlideGSAP() {
//   const locale = useLocale() as Locale;
//   const router = useRouter();

//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const carouselRef = useRef<HTMLDivElement>(null);
//   const mobileScrollRef = useRef<HTMLDivElement>(null);

//   const [isMobile, setIsMobile] = useState(false);

//   // -------------------------
//   // 🔒 DATA (tus datos intactos)
//   // -------------------------
//   // 🎯 Datos hardcodeados temporales
//   const hardcodedPackages: Record<Locale, HardcodedPackage[]> = {
//     es: [
//       {
//         id: "1",
//         name: "Mega Europa iniciando en Barcelona",
//         slug: "mega-europa-vs-mt-12017",
//         description:
//           "Circuito europeo de 17 días iniciando en Barcelona, visitando Francia e Italia con visitas panorámicas y tiempo libre.",
//         images: [
//           "https://one.cdnmega.com/images/viajes/covers/12341-mega-europa-desde-barcelona-1024x575-68dc5e3513363_68e0d068b099f.webp",
//         ],
//         price_from: 1499,
//         currency: "USD",
//         visited_countries: [
//           { name: "España" },
//           { name: "Francia" },
//           { name: "Italia" },
//         ],
//       },
//       {
//         id: "2",
//         name: "Maravillas de Asia",
//         slug: "maravillas-asia",
//         description:
//           "Descubre los templos ancestrales y la cultura milenaria de Tailandia, Camboya y Vietnam en 14 días inolvidables.",
//         images: [
//           "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800",
//         ],
//         price_from: 2199,
//         currency: "USD",
//         visited_countries: [
//           { name: "Tailandia" },
//           { name: "Camboya" },
//           { name: "Vietnam" },
//         ],
//       },
//       {
//         id: "3",
//         name: "Safari Africano Premium",
//         slug: "safari-africano-premium",
//         description:
//           "Vive la aventura africana con safaris fotográficos en Kenia y Tanzania. Incluye los Big 5 y playas de Zanzíbar.",
//         images: [
//           "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
//         ],
//         price_from: 3499,
//         currency: "USD",
//         visited_countries: [{ name: "Kenia" }, { name: "Tanzania" }],
//       },
//       {
//         id: "4",
//         name: "Japón Tradicional y Moderno",
//         slug: "japon-tradicional-moderno",
//         description:
//           "Sumérgete en la fascinante mezcla de tradición y tecnología. Tokio, Kioto, Osaka y Monte Fuji en 12 días.",
//         images: [
//           "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
//         ],
//         price_from: 2899,
//         currency: "USD",
//         visited_countries: [{ name: "Japón" }],
//       },
//       {
//         id: "5",
//         name: "Patagonia Extrema",
//         slug: "patagonia-extrema",
//         description:
//           "Glaciares milenarios, montañas imponentes y lagos turquesa. Recorre Argentina y Chile en esta aventura de 10 días.",
//         images: [
//           "https://images.unsplash.com/photo-1591642425143-1fb5e1f9682b?w=800",
//         ],
//         price_from: 1899,
//         currency: "USD",
//         visited_countries: [{ name: "Argentina" }, { name: "Chile" }],
//       },
//       {
//         id: "6",
//         name: "Ruta de los Incas",
//         slug: "ruta-incas",
//         description:
//           "Machu Picchu, Valle Sagrado, Cusco y el Lago Titicaca. Explora la civilización Inca en 8 días mágicos.",
//         images: [
//           "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
//         ],
//         price_from: 1299,
//         currency: "USD",
//         visited_countries: [{ name: "Perú" }],
//       },
//       {
//         id: "7",
//         name: "Islas Griegas de Ensueño",
//         slug: "islas-griegas",
//         description:
//           "Santorini, Mykonos, Creta y Atenas. Playas de arena blanca, arquitectura única y gastronomía mediterránea.",
//         images: [
//           "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
//         ],
//         price_from: 1799,
//         currency: "USD",
//         visited_countries: [{ name: "Grecia" }],
//       },
//     ],
//     en: [
//       {
//         id: "1",
//         name: "Mega Europe starting in Barcelona",
//         slug: "mega-europa-vs-mt-12017",
//         description:
//           "17-day European tour starting in Barcelona, visiting France and Italy with panoramic tours and free time.",
//         images: [
//           "https://one.cdnmega.com/images/viajes/covers/12341-mega-europa-desde-barcelona-1024x575-68dc5e3513363_68e0d068b099f.webp",
//         ],
//         price_from: 1499,
//         currency: "USD",
//         visited_countries: [
//           { name: "Spain" },
//           { name: "France" },
//           { name: "Italy" },
//         ],
//       },
//       {
//         id: "2",
//         name: "Asian Wonders",
//         slug: "maravillas-asia",
//         description:
//           "Discover ancient temples and millennial culture in Thailand, Cambodia and Vietnam on an unforgettable 14-day journey.",
//         images: [
//           "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800",
//         ],
//         price_from: 2199,
//         currency: "USD",
//         visited_countries: [
//           { name: "Thailand" },
//           { name: "Cambodia" },
//           { name: "Vietnam" },
//         ],
//       },
//       {
//         id: "3",
//         name: "Premium African Safari",
//         slug: "safari-africano-premium",
//         description:
//           "Live the African adventure with photo safaris in Kenya and Tanzania. Includes the Big 5 and Zanzibar beaches.",
//         images: [
//           "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
//         ],
//         price_from: 3499,
//         currency: "USD",
//         visited_countries: [{ name: "Kenya" }, { name: "Tanzania" }],
//       },
//       {
//         id: "4",
//         name: "Traditional & Modern Japan",
//         slug: "japon-tradicional-moderno",
//         description:
//           "Immerse yourself in the fascinating blend of tradition and technology. Tokyo, Kyoto, Osaka and Mount Fuji in 12 days.",
//         images: [
//           "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
//         ],
//         price_from: 2899,
//         currency: "USD",
//         visited_countries: [{ name: "Japan" }],
//       },
//       {
//         id: "5",
//         name: "Extreme Patagonia",
//         slug: "patagonia-extrema",
//         description:
//           "Ancient glaciers, imposing mountains and turquoise lakes. Explore Argentina and Chile on this 10-day adventure.",
//         images: [
//           "https://images.unsplash.com/photo-1591642425143-1fb5e1f9682b?w=800",
//         ],
//         price_from: 1899,
//         currency: "USD",
//         visited_countries: [{ name: "Argentina" }, { name: "Chile" }],
//       },
//       {
//         id: "6",
//         name: "Inca Trail Route",
//         slug: "ruta-incas",
//         description:
//           "Machu Picchu, Sacred Valley, Cusco and Lake Titicaca. Explore the Inca civilization on 8 magical days.",
//         images: [
//           "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
//         ],
//         price_from: 1299,
//         currency: "USD",
//         visited_countries: [{ name: "Peru" }],
//       },
//       {
//         id: "7",
//         name: "Dreamy Greek Islands",
//         slug: "islas-griegas",
//         description:
//           "Santorini, Mykonos, Crete and Athens. White sand beaches, unique architecture and Mediterranean cuisine.",
//         images: [
//           "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
//         ],
//         price_from: 1799,
//         currency: "USD",
//         visited_countries: [{ name: "Greece" }],
//       },
//     ],
//   };

//   const packages = hardcodedPackages[locale];

//   // -------------------------
//   // 📱 Detect device
//   // -------------------------
//   useEffect(() => {
//     const onResize = () => setIsMobile(window.innerWidth < 768);
//     onResize();
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   // -------------------------
//   // 🧠 DESKTOP GSAP (INVERTIDO)
//   // -------------------------
//   useEffect(() => {
//     if (!carouselRef.current || !scrollContainerRef.current || isMobile) return;

//     const carousel = carouselRef.current;
//     const container = scrollContainerRef.current;

//     const scrollDistance = carousel.scrollWidth - container.offsetWidth;

//     if (scrollDistance <= 0) return;

//     // 👉 ARRANCA DESDE EL FINAL
//     gsap.set(carousel, { x: -scrollDistance });

//     const tween = gsap.to(carousel, {
//       x: 0,
//       ease: "none",
//       scrollTrigger: {
//         trigger: container,
//         start: "top top",
//         end: `+=${scrollDistance}`,
//         scrub: 1,
//         pin: true,
//         invalidateOnRefresh: true,
//       },
//     });

//     return () => {
//       tween.kill();
//       ScrollTrigger.getAll().forEach((t) => t.kill());
//     };
//   }, [isMobile, packages.length]);

//   // -------------------------
//   // 📱 MOBILE (scroll nativo invertido)
//   // -------------------------
//   useEffect(() => {
//     if (!isMobile || !mobileScrollRef.current) return;

//     const el = mobileScrollRef.current;

//     const maxScroll = el.scrollWidth - el.clientWidth;
//     el.scrollLeft = maxScroll; // 👈 arranca al final
//   }, [isMobile, packages.length]);

//   return (
//     <section
//       ref={scrollContainerRef}
//       className="relative py-16 px-4 overflow-hidden bg-green-200"
//     >
//       <ParticlesCanvas />

//       <div className="relative max-w-8xl mx-auto z-20">
//         {/* HEADER */}
//         <div className="text-center mb-10">
//           <SplitText
//             text={locale === "es" ? "Paquetes Turísticos" : "Travel Packages"}
//             className="text-2xl sm:text-4xl md:text-7xl font-semibold uppercase"
//             splitType="chars"
//             delay={40}
//           />
//         </div>

//         {/* CAROUSEL */}
//         <div
//           ref={isMobile ? mobileScrollRef : undefined}
//           className={
//             isMobile ? "overflow-x-auto -mx-4 px-4" : "overflow-hidden"
//           }
//         >
//           <div
//             ref={carouselRef}
//             className="flex gap-6 md:gap-8 will-change-transform"
//           >
//             {packages.map((pkg) => (
//               <div
//                 key={pkg.id}
//                 className="min-w-[280px] md:min-w-[350px] flex-shrink-0"
//               >
//                 <div className="relative rounded-2xl overflow-hidden bg-white/5">
//                   <div className="h-80">
//                     <img
//                       src={pkg.images[0]}
//                       className="w-full h-full object-cover"
//                       draggable={false}
//                       alt={pkg.name}
//                     />
//                   </div>

//                   <div className="absolute inset-0 p-6 flex flex-col justify-between">
//                     <div className="flex justify-end">
//                       <div className="bg-white/20 p-3 rounded-full">
//                         <FaSuitcase className="text-white text-xl" />
//                       </div>
//                     </div>

//                     <div>
//                       <h3 className="text-xl font-bold text-white mb-2">
//                         {pkg.name}
//                       </h3>

//                       <p className="text-white/80 text-sm mb-3 line-clamp-2">
//                         {pkg.description}
//                       </p>

//                       <div className="flex items-center gap-2 text-xs text-white/70 mb-4">
//                         <FaMapMarkedAlt />
//                         {pkg.visited_countries.map((c) => c.name).join(", ")}
//                       </div>

//                       <button
//                         onClick={() =>
//                           router.push(
//                             `/${locale}/${locale === "es" ? "paquetes" : "packages"}/${pkg.slug}`,
//                           )
//                         }
//                         className="bg-white text-black px-5 py-2 rounded-full font-semibold"
//                       >
//                         {locale === "es" ? "Ver detalles" : "View details"}
//                       </button>
//                     </div>

//                     <div className="absolute top-4 left-4 bg-white/20 px-4 py-2 rounded-full flex items-center gap-1 text-white font-bold">
//                       <MdAttachMoney />
//                       {pkg.price_from} {pkg.currency}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
