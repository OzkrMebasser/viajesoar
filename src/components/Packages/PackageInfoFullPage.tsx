// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import CardsSlideShow from "@/components/CardsSlideShow";
// import ButtonGlower from "@/components/ui/ButtonGlower";
// import ButtonArrow from "@/components/ui/ButtonArrow";
// import ParticlesCanvas from "@/components/ParticlesCanvas";
// import PackagesImagesModal from "./Detail/PackagesImagesModal";
// import SplitText from "@/components/SplitText";
// import TourMap from "./TourMap";
// import SimilarPackages from "@/components/Packages/SimilarPackages";
// import { TbMapPin2 } from "react-icons/tb";

// import {
//   FaPlane,
//   FaHotel,
//   FaCheck,
//   FaTimes,
//   FaChevronDown,
//   FaStar,
//   FaMapMarkerAlt,
//   FaMoon,
//   FaSun,
//   FaUsers,
// } from "react-icons/fa";
// import { MdTravelExplore } from "react-icons/md";

// // ─── Types ────────────────────────────────────────────────────────────────────
// import type {
//   TabType,
//   DayItinerary,
//   HotelEntry,
//   PackageDetail,
//   Package,
// } from "@/types/packages";

// type Locale = "es" | "en";

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const t = (locale: Locale, es: string, en: string) =>
//   locale === "es" ? es : en;

// // ─── Main Component ───────────────────────────────────────────────────────────

// interface Props {
//   locale: Locale;
//   pkg: PackageDetail;
//   similarPackages?: Package[];
// }

// export default function PackageInfoFullPage({
//   pkg,
//   locale,
//   similarPackages = [],
// }: Props) {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState<TabType>("itinerary");
//   const [openDay, setOpenDay] = useState<number | null>(1);
//   const [openMap, setOpenMap] = useState(false);

//   // ── Parse JSONB fields ──
//   const itinerary: DayItinerary[] = Array.isArray(pkg.itinerary)
//     ? pkg.itinerary
//     : [];
//   const hotels: HotelEntry[] = Object.entries(
//     (pkg.hotels as unknown as Record<string, Record<string, string[]>>) || {},
//   ).flatMap(([country, cities]) =>
//     Object.entries(cities).flatMap(([city, hotelList]) =>
//       hotelList.map((hotel) => ({ country, city, hotel })),
//     ),
//   );
//   const included: string[] = Array.isArray(pkg.included) ? pkg.included : [];
//   const notIncluded: string[] = Array.isArray(pkg.not_included)
//     ? pkg.not_included
//     : [];

//   const tabs: { key: TabType; label: string }[] = [
//     { key: "itinerary", label: t(locale, "Itinerario", "Itinerary") },
//     { key: "optionals", label: t(locale, "Opcionales", "Optionals") },
//     { key: "hotels", label: t(locale, "Hoteles", "Hotels") },
//     { key: "prices", label: t(locale, "Tarifas", "Prices") },
//   ];

//   const tourCities = (pkg.visited_cities ?? [])
//     .filter((c) => c.latitude && c.longitude)
//     .map((c, i, arr) => ({
//       name: c.name,
//       lat: c.latitude!,
//       lng: c.longitude!,
//       isStart: i === 0,
//       isEnd: i === arr.length - 1,
//     }));

//   return (
//     <div className="min-h-screen bg-gradient-theme">
//       {/* ── HERO ────────────────────────────────────────────────── */}
//       <section className="relative min-h-[70vh] lg:min-h-screen flex flex-col justify-end overflow-hidden">
//         {/* Background slideshow */}
//         <div className="absolute inset-0 z-0">
//           <CardsSlideShow
//             images={pkg.home_carousel_images || pkg.images || []}
//             interval={5000}
//             className="w-full h-full"
//           />
//           {/* Gradient overlays */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
//           <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
//         </div>

//         {/* Particles */}
//         <div className="absolute inset-0 z-[1] ">
//           <ParticlesCanvas />
//         </div>

//         {/* Hero Content */}
//         <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-12 pt-32">
//           {/* Title */}
//           <SplitText
//             text={pkg.name}
//             className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold  mb-3 uppercase"
//             delay={25}
//             duration={0.5}
//             splitType="chars"
//             from={{ opacity: 0, y: 20 }}
//             to={{ opacity: 1, y: 0 }}
//             textAlign="center"
//           />{" "}
//           {/* Eyebrow */}
//           <div className="flex items-center gap-2 ">
//             <span className="text-[var(--accent)] bg-white/6 backdrop-blur-md border border-[var(--border)]/40 text-xs tracking-[0.25em] uppercase font-semibold  px-3 py-1 rounded-sm">
//               {pkg.internal_pkg_id ? pkg.internal_pkg_id : "VS-0000"}
//             </span>
//           </div>
//           {/* Meta badges */}
//           <div className="flex flex-wrap items-center gap-4 mb-8 mt-2">
//             {pkg.days && (
//               <div className="flex items-center gap-2 text-white/80 text-sm">
//                 <FaSun className="text-[var(--accent)]" />
//                 <span>
//                   <strong className="text-white">{pkg.days}</strong>{" "}
//                   {t(locale, "días", "days")}
//                 </span>
//               </div>
//             )}
//             {pkg.days && pkg.nights && (
//               <span className="text-[var(--accent)]/70">|</span>
//             )}
//             {pkg.nights && (
//               <div className="flex items-center gap-2 text-white/80 text-sm">
//                 <FaMoon className="text-[var(--accent)]" />
//                 <span>
//                   <strong className="text-white">{pkg.nights}</strong>{" "}
//                   {t(locale, "noches", "nights")}
//                 </span>
//               </div>
//             )}
//             {pkg.includes_flight && (
//               <>
//                 <span className="text-[var(--accent)]/70">|</span>
//                 <div className="flex items-center gap-2 text-white/80 text-sm">
//                   <FaPlane className="text-[var(--accent)]" />
//                   <span>{t(locale, "Vuelo incluido", "Flight included")}</span>
//                 </div>
//               </>
//             )}
//           </div>
//           {/* Price + CTA row */}
//           <div className="flex flex-wrap items-end gap-6">
//             {/* Price card */}
//             <div className="bg-white/6 backdrop-blur-md border border-[var(--border)]/40 rounded-sm px-6 py-4">
//               <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-1">
//                 {t(locale, "Desde", "From")}
//               </p>
//               <div className="flex items-baseline gap-1">
//                 <span className="text-[var(--accent)] font-bold text-4xl">
//                   ${Number(pkg.price_from).toLocaleString()}
//                 </span>
//                 <span className="text-white/50 text-sm">{pkg.currency}</span>
//               </div>
//               {pkg.taxes && (
//                 <p className="text-white/40 text-xs mt-1">
//                   + ${Number(pkg.taxes).toLocaleString()}{" "}
//                   {t(locale, "impuestos aéreos", "air taxes")}
//                 </p>
//               )}
//             </div>

//             <ButtonGlower
//               onClick={() => {
//                 /* cotizar logic */
//               }}
//             >
//               {t(locale, "Cotizar ahora", "Get a quote")}
//             </ButtonGlower>
//           </div>
//         </div>
//       </section>

//       {/* ── DESCRIPTION BAND ────────────────────────────────────── */}
//       <div className="bg-white/5 border-y border-[var(--border)]/40 py-6 ">
//         <div className="max-w-7xl mx-auto px-4 sm:px-12 flex flex-wrap gap-4 items-center justify-between">
//           <p className="text-[var(--accent)] text-sm sm:text-base leading-relaxed max-w-3xl">
//             {pkg.description}
//           </p>
//           <PackagesImagesModal
//             images={pkg.home_carousel_images || []}
//             title={pkg.name}
//           />
//         </div>
//       </div>

//       {/* ── MAIN LAYOUT ─────────────────────────────────────────── */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-16 py-12  ">
//         <div className="grid grid-cols-1 gap-10">
//           {/* ── MAIN CONTENT ── */}
//           <div>
//             {/* Tabs */}
//             <div className="flex gap-0 border-b border-[var(--border)]/40 mb-10 pb-4 overflow-x-auto">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setActiveTab(tab.key)}
//                   className={`px-5 py-3 text-xs font-semibold tracking-[0.12em] uppercase whitespace-nowrap transition-all duration-200 border-b-2 -mb-[2px] ${
//                     activeTab === tab.key
//                       ? "text-[var(--accent)] border-[var(--accent)]"
//                       : "text-[var(--accent)]/40 border-transparent hover:text-[var(--accent)]/70"
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>

//             {/* ── ITINERARY TAB ── */}
//             {activeTab === "itinerary" && (
//               <div>
//                 <h2 className="text-2xl sm:text-4xl font-bold text-theme-tittles uppercase mb-2">
//                   {t(locale, "Itinerario", "Itinerary")}
//                 </h2>
//                 <p className="text-[var(--text)]/80 text-sm mb-8">
//                   {t(
//                     locale,
//                     "Programa sujeto a cambios según fecha de salida.",
//                     "Program subject to change based on departure date.",
//                   )}
//                 </p>

//                 {itinerary.length > 0 ? (
//                   <div className="relative">
//                     {/* Timeline line */}
//                     <div className="absolute left-[22px] top-0 bottom-0 w-[1px] bg-white/10" />

//                     {itinerary.map((day) => (
//                       <div key={day.day} className="relative pl-14 mb-3">
//                         {/* Dot */}
//                         <div
//                           className={`absolute left-0 top-0 w-[46px] h-[46px] rounded-sm flex items-center justify-center text-xs font-bold transition-all duration-300 ${
//                             openDay === day.day
//                               ? "bg-[var(--accent)] text-black"
//                               : "bg-white/5 border border-[var(--border)]/40 text-white/50"
//                           }`}
//                         >
//                           {String(day.day).padStart(2, "0")}
//                         </div>

//                         {/* Card */}
//                         <div
//                           className={`bg-white/5 border rounded-sm overflow-hidden transition-all duration-300 ${
//                             openDay === day.day
//                               ? "border-[var(--accent)]/30"
//                               : "border-[var(--border)]/40"
//                           }`}
//                         >
//                           {/* Header */}
//                           <button
//                             onClick={() =>
//                               setOpenDay(openDay === day.day ? null : day.day)
//                             }
//                             className="w-full flex items-center justify-between px-5 py-4 text-left"
//                           >
//                             <span
//                               className={`font-semibold text-sm transition-colors ${
//                                 openDay === day.day
//                                   ? "text-white"
//                                   : "text-white/70"
//                               }`}
//                             >
//                               {day.title}
//                             </span>
//                             <FaChevronDown
//                               className={`text-white/30 text-xs transition-transform duration-300 flex-shrink-0 ml-4 ${
//                                 openDay === day.day ? "rotate-180" : ""
//                               }`}
//                             />
//                           </button>

//                           {/* Body */}
//                           {openDay === day.day && (
//                             <div className="px-5 pb-5 border-t border-[var(--border)]/40">
//                               <p className="text-white/60 text-sm leading-relaxed mt-4">
//                                 {day.description}
//                               </p>
//                               {day.optional && (
//                                 <div className="mt-4 bg-[var(--accent)]/10 border-l-2 border-[var(--border)]/40 px-4 py-3 rounded-sm">
//                                   <p className="text-[var(--accent)] text-[10px] tracking-[0.2em] uppercase font-semibold mb-1">
//                                     ✦{" "}
//                                     {t(
//                                       locale,
//                                       "Excursión opcional",
//                                       "Optional excursion",
//                                     )}
//                                   </p>
//                                   <p className="text-white/60 text-sm">
//                                     {day.optional}
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-8 text-center">
//                     <MdTravelExplore className="text-[var(--text)]/60 text-4xl mx-auto mb-3" />
//                     <p className="text-[var(--text)]/60 text-sm">
//                       {t(
//                         locale,
//                         "Itinerario próximamente",
//                         "Itinerary coming soon",
//                       )}
//                     </p>
//                   </div>
//                 )}

//                 {/* Includes / Not Includes */}
//                 {(included.length > 0 || notIncluded.length > 0) && (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
//                     {included.length > 0 && (
//                       <div>
//                         <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
//                           <FaCheck className="text-emerald-400 text-sm" />
//                           {t(locale, "Incluye", "Includes")}
//                         </h3>
//                         <ul className="space-y-3">
//                           {included.map((item, i) => (
//                             <li
//                               key={i}
//                               className="flex gap-3 text-sm text-white/60 border-b border-[var(--border)]/40 pb-3 last:border-0"
//                             >
//                               <FaCheck className="text-emerald-400 flex-shrink-0 mt-0.5" />
//                               {item}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                     {notIncluded.length > 0 && (
//                       <div>
//                         <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
//                           <FaTimes className="text-red-400 text-sm" />
//                           {t(locale, "No incluye", "Not included")}
//                         </h3>
//                         <ul className="space-y-3">
//                           {notIncluded.map((item, i) => (
//                             <li
//                               key={i}
//                               className="flex gap-3 text-sm text-white/60 border-b border-[var(--border)]/40 pb-3 last:border-0"
//                             >
//                               <FaTimes className="text-red-400 flex-shrink-0 mt-0.5" />
//                               {item}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── OPTIONALS TAB ── */}
//             {activeTab === "optionals" && (
//               <div>
//                 <h2 className="text-2xl sm:text-4xl font-bold text-theme-tittles uppercase mb-2">
//                   {t(locale, "Tours Opcionales", "Optional Tours")}
//                 </h2>
//                 <p className="text-[var(--text)]/80 text-sm mb-8">
//                   {t(
//                     locale,
//                     "Enriquece tu viaje con estas experiencias únicas.",
//                     "Enrich your trip with these unique experiences.",
//                   )}
//                 </p>
//                 <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-8 text-center">
//                   <FaStar className="text-[var(--text)]/60 text-3xl mx-auto mb-3 opacity-40" />
//                   <p className="text-[var(--text)]/60 text-sm">
//                     {t(
//                       locale,
//                       "Opcionales disponibles próximamente",
//                       "Optional tours coming soon",
//                     )}
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* ── HOTELS TAB ── */}
//             {activeTab === "hotels" && (
//               <div>
//                 <h2 className="text-2xl sm:text-4xl font-bold text-theme-tittles uppercase mb-2">
//                   {t(locale, "Hoteles Previstos", "Planned Hotels")}
//                 </h2>
//                 <p className="text-[var(--text)]/80 text-sm mb-8">
//                   {t(
//                     locale,
//                     "Sujetos a cambio por establecimientos similares.",
//                     "Subject to change for similar establishments.",
//                   )}
//                 </p>

//                 {hotels.length > 0 ? (
//                   <div className="overflow-hidden rounded-sm border border-[var(--border)]/40">
//                     <table className="w-full">
//                       <thead>
//                         <tr className="border-b border-[var(--border)]/40 bg-white/5">
//                           <th className="text-left px-5 py-3 text-[10px] tracking-[0.2em] uppercase text-[var(--accent)] font-semibold">
//                             {t(locale, "País", "Country")}
//                           </th>
//                           <th className="text-left px-5 py-3 text-[10px] tracking-[0.2em] uppercase text-[var(--accent)] font-semibold">
//                             {t(locale, "Ciudad", "City")}
//                           </th>
//                           <th className="text-left px-5 py-3 text-[10px] tracking-[0.2em] uppercase text-[var(--accent)] font-semibold">
//                             {t(locale, "Hotel", "Hotel")}
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {hotels.map((h, i) => (
//                           <tr
//                             key={i}
//                             className="border-b border-[var(--border)]/40 last:border-0 hover:bg-white/5 transition-colors"
//                           >
//                             <td className="px-5 py-4 text-sm text-white/60">
//                               {h.country}
//                             </td>
//                             <td className="px-5 py-4 text-sm font-semibold text-white">
//                               {h.city}
//                             </td>
//                             <td className="px-5 py-4 text-sm text-white/60">
//                               <div className="flex items-center gap-2">
//                                 <FaHotel className="text-[var(--accent)] flex-shrink-0 text-xs" />
//                                 {h.hotel}
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-8 text-center">
//                     <FaHotel className="text-[var(--text)]/60 text-3xl mx-auto mb-3" />
//                     <p className="text-[var(--text)]/60 text-sm">
//                       {t(locale, "Hoteles próximamente", "Hotels coming soon")}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── PRICES TAB ── */}
//             {activeTab === "prices" && (
//               <div>
//                 <h2 className="text-2xl sm:text-4xl font-bold text-theme-tittles uppercase mb-2">
//                   {t(locale, "Tarifas", "Prices")}
//                 </h2>
//                 <p className="text-[var(--text)]/80 text-sm mb-8">
//                   {t(
//                     locale,
//                     "Precios por persona en USD. Sujetos a cambio sin previo aviso.",
//                     "Prices per person in USD. Subject to change without notice.",
//                   )}
//                 </p>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {/* Double */}
//                   <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 flex justify-between items-center hover:border-[var(--accent)]/30 transition-colors">
//                     <span className="text-[var(--text)]/60 text-sm font-semibold">
//                       {t(locale, "Doble", "Double")}
//                     </span>
//                     <span className="text-[var(--accent)] font-bold text-2xl">
//                       ${Number(pkg.price_from).toLocaleString()}
//                     </span>
//                   </div>

//                   {/* Triple */}
//                   {pkg.price_triple && (
//                     <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 flex justify-between items-center hover:border-[var(--accent)]/30 transition-colors">
//                       <span className="text-[var(--text)]/60 text-sm font-semibold">
//                         {t(locale, "Triple", "Triple")}
//                       </span>
//                       <span className="text-[var(--accent)] font-bold text-2xl">
//                         ${Number(pkg.price_triple).toLocaleString()}
//                       </span>
//                     </div>
//                   )}

//                   {/* Single */}
//                   {pkg.price_single && (
//                     <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 flex justify-between items-center hover:border-[var(--accent)]/30 transition-colors">
//                       <span className="text-[var(--text)]/60 text-sm font-semibold">
//                         {t(locale, "Sencilla", "Single")}
//                       </span>
//                       <span className="text-[var(--accent)] font-bold text-2xl">
//                         ${Number(pkg.price_single).toLocaleString()}
//                       </span>
//                     </div>
//                   )}

//                   {/* Child */}
//                   {pkg.price_child && (
//                     <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 flex justify-between items-center hover:border-[var(--accent)]/30 transition-colors">
//                       <span className="text-[var(--text)]/60 text-sm font-semibold">
//                         {t(locale, "Menor", "Child")}
//                       </span>
//                       <span className="text-[var(--accent)] font-bold text-2xl">
//                         ${Number(pkg.price_child).toLocaleString()}
//                       </span>
//                     </div>
//                   )}

//                   {/* Infant */}
//                   {pkg.price_infant && (
//                     <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-5 flex justify-between items-center hover:border-[var(--accent)]/30 transition-colors">
//                       <span className="text-[var(--text)]/60 text-sm font-semibold">
//                         {t(locale, "Infante", "Infant")}
//                       </span>
//                       <span className="text-[var(--accent)] font-bold text-2xl">
//                         ${Number(pkg.price_infant).toLocaleString()}
//                       </span>
//                     </div>
//                   )}

//                   {/* Taxes */}
//                   {pkg.taxes && (
//                     <div className="sm:col-span-2 bg-white/10 border border-[var(--border)]/40 rounded-sm p-5 flex justify-between items-center">
//                       <span className="text-[var(--text)]/60 text-sm">
//                         {t(
//                           locale,
//                           "Impuestos aéreos (por adulto)",
//                           "Air taxes (per adult)",
//                         )}
//                       </span>
//                       <span className="text-[var(--accent)]/80 font-bold text-2xl">
//                         + ${Number(pkg.taxes).toLocaleString()}
//                       </span>
//                     </div>
//                   )}

//                   {/* Valid until */}
//                   {pkg.prices_valid_until && (
//                     <div className="sm:col-span-2 text-center text-[var(--text)]/60 text-xs pt-2">
//                       {t(
//                         locale,
//                         "Precios vigentes hasta el",
//                         "Prices valid until",
//                       )}{" "}
//                       {new Date(pkg.prices_valid_until).toLocaleDateString(
//                         locale === "es" ? "es-MX" : "en-US",
//                         { day: "2-digit", month: "long", year: "numeric" },
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Deposit note */}
//                 {pkg.deposit_amount && (
//                   <div className="mt-6 bg-[var(--accent)]/10 border-l-2 border-[var(--border)]/40 px-5 py-4 rounded-sm">
//                     <p className="text-[var(--text)]/60 text-xs tracking-widest uppercase font-semibold mb-1">
//                       {t(locale, "Anticipo requerido", "Deposit required")}
//                     </p>
//                     <p className="text-white/60 text-sm">
//                       ${Number(pkg.deposit_amount).toLocaleString()} USD{" "}
//                       {t(
//                         locale,
//                         "por persona, no reembolsable.",
//                         "per person, non-refundable.",
//                       )}
//                     </p>
//                   </div>
//                 )}

//                 {(pkg.supplements || []).length > 0 && (
//                   <div className="sm:col-span-2 mt-2">
//                     {/* Header */}
//                     <div className="flex items-center gap-3 mb-4">
//                       <div className="h-[1px] flex-1 bg-[var(--border)]/40" />
//                       <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[var(--accent)]/60">
//                         {t(
//                           locale,
//                           "Suplementos por fecha de salida",
//                           "Departure date supplements",
//                         )}
//                       </span>
//                       <div className="h-[1px] flex-1 bg-[var(--border)]/40" />
//                     </div>

//                     {/* Supplement rows */}
//                     <div className="space-y-3">
//                       {(pkg.supplements || []).map((sup, i) => {
//                         // Group dates by month for compact display
//                         const byMonth: Record<string, number[]> = {};
//                         sup.dates.forEach((d) => {
//                           const dt = new Date(d + "T00:00:00");
//                           const key = dt.toLocaleDateString(
//                             locale === "es" ? "es-MX" : "en-US",
//                             { month: "long", year: "numeric" },
//                           );
//                           if (!byMonth[key]) byMonth[key] = [];
//                           byMonth[key].push(dt.getDate());
//                         });

//                         return (
//                           <div
//                             key={i}
//                             className="bg-white/5 border border-[var(--border)]/40 rounded-sm px-5 py-4
//                        hover:border-[var(--accent)]/20 transition-colors"
//                           >
//                             <div className="flex items-start justify-between gap-4">
//                               {/* Dates */}
//                               <div className="flex-1 space-y-1">
//                                 {Object.entries(byMonth).map(
//                                   ([month, days]) => (
//                                     <p
//                                       key={month}
//                                       className="text-xs text-white/50 leading-relaxed capitalize"
//                                     >
//                                       <span className="text-white/70 font-semibold">
//                                         {month}:
//                                       </span>{" "}
//                                       {days.sort((a, b) => a - b).join(", ")}
//                                     </p>
//                                   ),
//                                 )}
//                               </div>

//                               {/* Amount badge */}
//                               <div className="shrink-0 flex flex-col items-end">
//                                 <span className="text-[10px] tracking-[0.15em] uppercase text-[var(--accent)]/50 mb-0.5">
//                                   {t(locale, "suplemento", "supplement")}
//                                 </span>
//                                 <span className="text-[var(--accent)] font-bold text-xl">
//                                   +${sup.amount}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>

//                     {/* Note */}
//                     <p className="text-[11px] text-white/30 mt-3 leading-relaxed">
//                       {t(
//                         locale,
//                         "* El suplemento se suma al precio base según la fecha de salida elegida. Consulta disponibilidad con tu ejecutivo.",
//                         "* Supplement is added to the base price based on the selected departure date. Check availability with your agent.",
//                       )}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── MAP ── */}
//             <div className="mt-8 text-center">
//               <h3 className="text-theme uppercase mb-4">
//                 {t(locale, "ruta del viaje", "tour route")}
//               </h3>
//               <TourMap
//                 cities={tourCities}
//                 caption={tourCities.map((c) => c.name).join(", ")}
//               />
//             </div>

//             {/* ── SIDEBAR CONTENT MOVED HERE ── */}
//             <div className="mt-12 bg-white/5 backdrop-blur-md border border-[var(--border)]/40 rounded-sm overflow-hidden w-2/5">
//               {/* Sidebar header */}
//               <div className="bg-white/5 border-b border-[var(--border)]/40 px-6 py-5">
//                 <h3 className="text-[var(--accent)] font-bold text-lg uppercase tracking-wider leading-tight">
//                   {pkg.name}
//                 </h3>
//                 <p className="text-[var(--accent)]/40 text-xs mt-1 tracking-widest uppercase">
//                   {!pkg.internal_pkg_id ? "VS-00000" : pkg.internal_pkg_id}
//                 </p>
//               </div>

//               {/* Price rows */}
//               <div className="px-6 py-4 space-y-3">
//                 <div className="flex justify-between items-baseline py-2 border-b border-[var(--border)]/40">
//                   <span className="text-[var(--text)]/50 text-sm">
//                     {t(locale, "Hab. Doble", "Double room")}
//                   </span>
//                   <span className="text-[var(--accent)] font-bold text-lg">
//                     ${Number(pkg.price_from).toLocaleString()}
//                   </span>
//                 </div>
//                 {pkg.price_single && (
//                   <div className="flex justify-between items-baseline py-2 border-b border-[var(--border)]/40">
//                     <span className="text-white/50 text-sm">
//                       {t(locale, "Hab. Sencilla", "Single room")}
//                     </span>
//                     <span className="text-[var(--accent)] font-bold text-lg">
//                       ${Number(pkg.price_single).toLocaleString()}
//                     </span>
//                   </div>
//                 )}
//                 {pkg.taxes && (
//                   <div className="flex justify-between items-baseline py-2 border-b border-[var(--border)]/40">
//                     <span className="text-white/50 text-sm">
//                       {t(locale, "Impuestos aéreos", "Air taxes")}
//                     </span>
//                     <span className="text-white/60 font-semibold text-sm">
//                       + ${Number(pkg.taxes).toLocaleString()}
//                     </span>
//                   </div>
//                 )}

//                 {/* CTA */}
//                 <div className="pt-3">
//                   <ButtonGlower
//                     onClick={() => {
//                       /* cotizar */
//                     }}
//                     className="w-full justify-center"
//                   >
//                     {t(locale, "Cotizar ahora", "Get a quote")}
//                   </ButtonGlower>
//                 </div>
//               </div>

//               {/* Quick info */}
//               <div className="px-6 py-4 border-t border-[var(--border)]/40 space-y-3">
//                 {pkg.duration && (
//                   <div className="flex items-center gap-3 text-sm text-white/50">
//                     <FaMoon className="text-[var(--accent)] flex-shrink-0" />
//                     {pkg.duration}
//                   </div>
//                 )}
//                 {pkg.includes_flight && (
//                   <div className="flex items-center gap-3 text-sm text-white/50">
//                     <FaPlane className="text-[var(--accent)] flex-shrink-0" />
//                     {t(
//                       locale,
//                       "Incluye vuelo desde México",
//                       "Includes flight from Mexico",
//                     )}
//                   </div>
//                 )}
//                 {(pkg.airlines || []).length > 0 && (
//                   <div className="flex items-center gap-3 text-sm text-white/50">
//                     <FaStar className="text-[var(--accent)] flex-shrink-0" />
//                     {(pkg.airlines || []).join(", ")}
//                   </div>
//                 )}
//                 {pkg.departure_city && (
//                   <div className="flex items-center gap-3 text-sm text-white/50">
//                     <FaMapMarkerAlt className="text-[var(--accent)] flex-shrink-0" />
//                     {t(locale, "Salida desde", "Departure from")}{" "}
//                     {pkg.departure_city}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Back button */}
//             <div className="mt-4">
//               <ButtonArrow
//                 title={t(locale, "Ver todos los paquetes", "View all packages")}
//                 onClick={() =>
//                   router.push(
//                     `/${locale}${locale === "es" ? "/paquetes" : "/packages"}`,
//                   )
//                 }
//               />
//             </div>

//             {/* ── SIMILAR PACKAGES ── */}
//             {similarPackages.length > 0 && (
//               <div className="mt-12 border-t border-[var(--border)]/40 pt-12">
//                 <SimilarPackages packages={similarPackages} locale={locale} />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Map Modal */}
//       {openMap && (
//         <div
//           className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
//           onClick={() => setOpenMap(false)}
//         >
//           <div
//             className="relative w-full max-w-5xl max-h-[90vh] rounded-lg overflow-hidden border border-[var(--border)]/40"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Close Button */}
//             <button
//               onClick={() => setOpenMap(false)}
//               className="absolute top-4 right-4 z-50 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
//             >
//               <FaTimes className="w-6 h-6" />
//             </button>

//             <div className="h-[80vh]">
//               <TourMap
//                 cities={tourCities}
//                 height={800}
//                 caption={tourCities.map((c) => c.name).join(", ")}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
