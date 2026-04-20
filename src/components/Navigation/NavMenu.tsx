// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { Link } from "@/app/i18n/navigation";
// import { useTranslations } from "next-intl";
// import Image from "next/image";
// import { CircleFlag } from "react-circle-flags";
// // Components
// import ScrollIndicator from "@/components/ScrollIndicator";
// import ThemeSelector from "@/components/ThemeSelector";
// import TrueFocusLogo from "@/components/Navigation/TrueFocusLogo";
// import Logo from "@/components/Navigation/Logo";

// import {
//   Globe,
//   Search,
//   User,
//   Menu,
//   IndentIncrease,
//   IndentDecrease,
//   X,
//   ChevronDown,
//   ChevronRight,
//   MapPin,
//   Package,
// } from "lucide-react";
// import { supabase } from "@/lib/supabase";
// import UserMenu from "../Auth/UserMenu";
// import Fuse from "fuse.js";
// import type { User as SupabaseUser } from "@supabase/supabase-js";
// import { usePathname, useRouter } from "@/app/i18n/navigation";
// import { useLocale } from "next-intl";

// type SearchResult = {
//   id: number;
//   title: string;
//   category: string;
//   description: string;
// };

// type Locale = "es" | "en";

// // rutas navegación principal
// const routes: Record<string, { [key in Locale]: string }> = {
//   home: { es: "/", en: "/" },
//   packages: { es: "/paquetes", en: "/packages" },
//   destinations: { es: "/destinos", en: "/destinations" },
//   tours: { es: "/tours", en: "/tours" },
//   offers: { es: "/ofertas", en: "/offers" },
//   blog: { es: "/blog", en: "/blog" },
//   contact: { es: "/contacto", en: "/contact" },
// };

// // ─── Dropdown data ───────────────────────────────────────────────────────────

// type DropdownItem = {
//   label: { es: string; en: string };
//   href: { es: string; en: string };
//   children?: DropdownItem[];
// };

// const destinationsDropdown: DropdownItem[] = [
//   {
//     label: { es: "Todos los destinos", en: "All Destinations" },
//     href: { es: "/destinos", en: "/destinations" },
//   },
//   {
//     label: { es: "América", en: "Americas" },
//     href: { es: "/destinos/america", en: "/destinations/americas" },
//     children: [
//       {
//         label: { es: "México", en: "Mexico" },
//         href: { es: "/destinos/america/mexico", en: "/destinations/americas/mexico" },
//       },
//       {
//         label: { es: "Estados Unidos", en: "United States" },
//         href: { es: "/destinos/america/estados-unidos", en: "/destinations/americas/united-states" },
//       },
//       {
//         label: { es: "Colombia", en: "Colombia" },
//         href: { es: "/destinos/america/colombia", en: "/destinations/americas/colombia" },
//       },
//     ],
//   },
//   {
//     label: { es: "Europa", en: "Europe" },
//     href: { es: "/destinos/europa", en: "/destinations/europe" },
//     children: [
//       {
//         label: { es: "España", en: "Spain" },
//         href: { es: "/destinos/europa/espana", en: "/destinations/europe/spain" },
//       },
//       {
//         label: { es: "Francia", en: "France" },
//         href: { es: "/destinos/europa/francia", en: "/destinations/europe/france" },
//       },
//       {
//         label: { es: "Italia", en: "Italy" },
//         href: { es: "/destinos/europa/italia", en: "/destinations/europe/italy" },
//       },
//     ],
//   },
//   {
//     label: { es: "Asia", en: "Asia" },
//     href: { es: "/destinos/asia", en: "/destinations/asia" },
//     children: [
//       {
//         label: { es: "Japón", en: "Japan" },
//         href: { es: "/destinos/asia/japon", en: "/destinations/asia/japan" },
//       },
//       {
//         label: { es: "Tailandia", en: "Thailand" },
//         href: { es: "/destinos/asia/tailandia", en: "/destinations/asia/thailand" },
//       },
//     ],
//   },
// ];

// const packagesDropdown: DropdownItem[] = [
//   {
//     label: { es: "Todos los paquetes", en: "All Packages" },
//     href: { es: "/paquetes", en: "/packages" },
//   },
//   {
//     label: { es: "Paquete Luna de Miel", en: "Honeymoon Package" },
//     href: { es: "/paquetes/luna-de-miel", en: "/packages/honeymoon" },
//   },
//   {
//     label: { es: "Paquete Aventura", en: "Adventure Package" },
//     href: { es: "/paquetes/aventura", en: "/packages/adventure" },
//   },
//   {
//     label: { es: "Paquete Familiar", en: "Family Package" },
//     href: { es: "/paquetes/familiar", en: "/packages/family" },
//   },
//   {
//     label: { es: "Paquete Todo Incluido", en: "All Inclusive Package" },
//     href: { es: "/paquetes/todo-incluido", en: "/packages/all-inclusive" },
//   },
// ];

// // ─── Dropdown Component ───────────────────────────────────────────────────────

// type DropdownMenuProps = {
//   items: DropdownItem[];
//   locale: Locale;
//   isScrolled: boolean;
//   onClose: () => void;
// };

// const DropdownMenu = ({ items, locale, isScrolled, onClose }: DropdownMenuProps) => {
//   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

//   return (
//     <div
//       className={`absolute top-full left-0 mt-2 min-w-[220px] rounded-xl shadow-2xl overflow-visible z-[10010]
//         backdrop-blur-md border border-white/10
//         ${isScrolled ? "bg-[var(--bg)]/95" : "bg-[var(--bg)]/90"}
//       `}
//       style={{ animation: "dropdownIn 0.2s ease-out forwards" }}
//     >
//       <style>{`
//         @keyframes dropdownIn {
//           from { opacity: 0; transform: translateY(-8px) scale(0.97); }
//           to   { opacity: 1; transform: translateY(0)   scale(1);    }
//         }
//         @keyframes subdropdownIn {
//           from { opacity: 0; transform: translateX(-6px); }
//           to   { opacity: 1; transform: translateX(0); }
//         }
//       `}</style>

//       <div className="py-2">
//         {items.map((item, i) => (
//           <div
//             key={i}
//             className="relative"
//             onMouseEnter={() => setHoveredIndex(i)}
//             onMouseLeave={() => setHoveredIndex(null)}
//           >
//             <Link
//               href={item.href[locale] as any}
//               onClick={onClose}
//               className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium
//                 text-[var(--text)] hover:text-[var(--accent)]
//                 hover:bg-[var(--accent)]/10
//                 transition-all duration-200
//                 ${i === 0 ? "border-b border-white/10 mb-1" : ""}
//               `}
//             >
//               {i === 0 && <span className="opacity-60 text-xs uppercase tracking-widest w-full">{item.label[locale]}</span>}
//               {i !== 0 && <span>{item.label[locale]}</span>}
//               {item.children && i !== 0 && (
//                 <ChevronRight className="w-3.5 h-3.5 opacity-50" />
//               )}
//             </Link>

//             {/* Sub-dropdown */}
//             {item.children && hoveredIndex === i && (
//               <div
//                 className={`absolute left-full top-0 ml-1 min-w-[180px] rounded-xl shadow-2xl
//                   backdrop-blur-md border border-white/10 py-2 z-[10011]
//                   ${isScrolled ? "bg-[var(--bg)]/95" : "bg-[var(--bg)]/90"}
//                 `}
//                 style={{ animation: "subdropdownIn 0.15s ease-out forwards" }}
//               >
//                 {item.children.map((child, j) => (
//                   <Link
//                     key={j}
//                     href={child.href[locale] as any}
//                     onClick={onClose}
//                     className="flex items-center px-4 py-2.5 text-sm font-medium
//                       text-[var(--text)] hover:text-[var(--accent)]
//                       hover:bg-[var(--accent)]/10
//                       transition-all duration-200"
//                   >
//                     {child.label[locale]}
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // ─── Mobile Accordion ─────────────────────────────────────────────────────────

// type MobileAccordionProps = {
//   label: string;
//   items: DropdownItem[];
//   locale: Locale;
//   onClose: () => void;
//   activeItem: string;
//   setActiveItem: (v: string) => void;
// };

// const MobileAccordion = ({
//   label,
//   items,
//   locale,
//   onClose,
//   activeItem,
//   setActiveItem,
// }: MobileAccordionProps) => {
//   const [open, setOpen] = useState(false);
//   const [openSub, setOpenSub] = useState<number | null>(null);

//   return (
//     <div>
//       <button
//         type="button"
//         onClick={() => setOpen(!open)}
//         className={`flex items-center justify-between w-full text-left font-medium
//           transition-all duration-300 tracking-wider uppercase text-sm
//           ${activeItem === label ? "text-[var(--accent)]" : "text-[var(--text)]"}
//         `}
//       >
//         {label}
//         <ChevronDown
//           className={`w-4 h-4 opacity-60 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
//         />
//       </button>

//       {open && (
//         <div className="mt-3 ml-2 space-y-1 border-l border-[var(--accent)]/30 pl-3">
//           {items.map((item, i) => (
//             <div key={i}>
//               {item.children ? (
//                 <>
//                   <button
//                     type="button"
//                     onClick={() => setOpenSub(openSub === i ? null : i)}
//                     className="flex items-center justify-between w-full text-left py-1.5 text-sm
//                       text-[var(--text)]/80 hover:text-[var(--accent)] transition-colors"
//                   >
//                     {item.label[locale]}
//                     <ChevronDown
//                       className={`w-3.5 h-3.5 opacity-50 transition-transform duration-200
//                         ${openSub === i ? "rotate-180" : ""}`}
//                     />
//                   </button>
//                   {openSub === i && (
//                     <div className="mt-1 ml-2 space-y-1 border-l border-[var(--accent)]/20 pl-3">
//                       {item.children.map((child, j) => (
//                         <Link
//                           key={j}
//                           href={child.href[locale] as any}
//                           onClick={() => { setActiveItem(label); onClose(); }}
//                           className="block py-1.5 text-sm text-[var(--text)]/70
//                             hover:text-[var(--accent)] transition-colors"
//                         >
//                           {child.label[locale]}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <Link
//                   href={item.href[locale] as any}
//                   onClick={() => { setActiveItem(label); onClose(); }}
//                   className={`block py-1.5 text-sm transition-colors
//                     ${i === 0
//                       ? "text-[var(--accent)] font-semibold text-xs uppercase tracking-wider"
//                       : "text-[var(--text)]/80 hover:text-[var(--accent)]"
//                     }`}
//                 >
//                   {item.label[locale]}
//                 </Link>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Main Navigation ──────────────────────────────────────────────────────────

// const Navigation = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [logoChange, setLogoChange] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
//   const [activeItem, setActiveItem] = useState("Home");

//   // Dropdown state: which nav item's dropdown is open
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
//   const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const [user, setUser] = useState<SupabaseUser | null>(null);
//   const searchInputRef = useRef<HTMLInputElement | null>(null);

//   const t = useTranslations("Navigation");
//   const pathname = usePathname();
//   const router = useRouter();
//   const locale = useLocale() as Locale;

//   const navItems = [
//     { label: t("home"), href: routes.home[locale], dropdown: null },
//     { label: t("packages"), href: routes.packages[locale], dropdown: "packages" },
//     { label: t("destinations"), href: routes.destinations[locale], dropdown: "destinations" },
//     { label: t("tours"), href: routes.tours[locale], dropdown: null },
//     { label: t("offers"), href: routes.offers[locale], dropdown: null },
//     { label: t("blog"), href: routes.blog[locale], dropdown: null },
//     { label: t("contact"), href: routes.contact[locale], dropdown: null },
//   ];

//   const dropdownMap: Record<string, DropdownItem[]> = {
//     destinations: destinationsDropdown,
//     packages: packagesDropdown,
//   };

//   const routeMapping: Record<Locale, Record<string, string>> = {
//     es: {
//       "/": "/",
//       "/iniciar-sesion": "/login",
//       "/servicios": "/services",
//       "/destinos": "/destinations",
//       "/tours": "/tours",
//       "/ofertas": "/offers",
//       "/blog-es": "/blog",
//       "/contacto": "/contact",
//     },
//     en: {
//       "/": "/",
//       "/login": "/iniciar-sesion",
//       "/services": "/servicios",
//       "/destinations": "/destinos",
//       "/tours": "/tours",
//       "/offers": "/ofertas",
//       "/blog": "/blog",
//       "/contact": "/contacto",
//     },
//   };

//   const toggleLanguage = () => {
//     const next: Locale = locale === "es" ? "en" : "es";
//     const newPath = routeMapping[locale][pathname] || "/";
//     router.replace(newPath as any, { locale: next });
//   };

//   const searchData = [
//     { id: 1, title: "Beach Holiday in Maldives", category: "Holidays", description: "Luxury resort with crystal clear waters" },
//     { id: 2, title: "Paris City Break", category: "Destinations", description: "Explore the city of lights" },
//     { id: 3, title: "Cheap Flights to Tokyo", category: "Flights", description: "Best deals for flights to Japan" },
//     { id: 4, title: "Safari Adventure Kenya", category: "Holidays", description: "Wildlife experience in Africa" },
//     { id: 5, title: "Rome Historical Tour", category: "Destinations", description: "Ancient history and culture" },
//     { id: 6, title: "Last Minute Offers", category: "Offers", description: "Special discounts available now" },
//     { id: 7, title: "Contact Support", category: "Contact", description: "Get help with your booking" },
//     { id: 8, title: "New York Flight Deals", category: "Flights", description: "Affordable flights to NYC" },
//     { id: 9, title: "Thailand Beach Resort", category: "Holidays", description: "Tropical paradise vacation" },
//     { id: 10, title: "Barcelona City Guide", category: "Destinations", description: "Art, culture and architecture" },
//   ];

//   const fuseOptions = { keys: ["title", "category", "description"], threshold: 0.4, includeScore: true, minMatchCharLength: 2 };
//   const fuse = React.useMemo(() => new Fuse(searchData, fuseOptions), []);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => setLogoChange(window.scrollY > 1000);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     if (searchQuery.length >= 2) {
//       const results = fuse.search(searchQuery);
//       setSearchResults(results.map((result) => result.item));
//     } else {
//       setSearchResults([]);
//     }
//   }, [searchQuery, fuse]);

//   useEffect(() => {
//     if (isSearchOpen && searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, [isSearchOpen]);

//   const handleLoginRedirect = () => {
//     const loginPath = locale === "es" ? "/iniciar-sesion" : "/login";
//     router.push(loginPath as any);
//   };

//   const handleSearchToggle = () => {
//     setIsSearchOpen(!isSearchOpen);
//     if (!isSearchOpen) {
//       setSearchQuery("");
//       setSearchResults([]);
//     }
//   };

//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         setIsSearchOpen(false);
//         setSearchQuery("");
//         setSearchResults([]);
//         setOpenDropdown(null);
//       }
//     };
//     if (isSearchOpen) {
//       document.addEventListener("keydown", handleEscape);
//       return () => document.removeEventListener("keydown", handleEscape);
//     }
//   }, [isSearchOpen]);

//   useEffect(() => {
//     const getUser = async () => {
//       const { data } = await supabase.auth.getUser();
//       setUser(data.user);
//     };
//     getUser();
//     const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
//       setUser(session?.user || null);
//     });
//     return () => { listener.subscription.unsubscribe(); };
//   }, []);

//   const handleSearchResultClick = (result: (typeof searchData)[number]) => {
//     setIsSearchOpen(false);
//     setSearchQuery("");
//     setSearchResults([]);
//   };

//   // Dropdown hover handlers with delay to avoid flicker
//   const handleDropdownEnter = (key: string) => {
//     if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
//     setOpenDropdown(key);
//   };

//   const handleDropdownLeave = () => {
//     dropdownTimerRef.current = setTimeout(() => {
//       setOpenDropdown(null);
//     }, 150);
//   };

//   return (
//     <>
//       <nav
//         className={`nav fixed left-0 top-0 right-0 z-40 transition-all duration-500 ease-in-out backdrop-blur-[2px]  ${
//           isScrolled ? "text-theme bg-gradient-theme" : " text-theme-nav"
//         }`}
//         role="navigation"
//         aria-label="Navegación principal"
//       >
//         <div className="w-full mx-auto px-4">
//           <div className="flex items-center justify-between h-16">
//             {/* Hamburger */}
//             <button
//               type="button"
//               title="Toggle menu"
//               onClick={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 setIsMobileMenuOpen(!isMobileMenuOpen);
//               }}
//               className="p-2 rounded-lg transition-all duration-300 relative z-[10000] pointer-events-auto"
//               aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
//               aria-expanded={isMobileMenuOpen ? "true" : "false"}
//               aria-controls="mobile-menu"
//             >
//               <IndentIncrease
//                 className={`w-6 h-6 text-nav ${!isScrolled ? "drop-shadow-[0_0_10px_rgba(1,1,1,0.9)]" : ""}`}
//               />
//             </button>

//             {/* Logo */}
//             <Link
//               href="/"
//               onClick={() => setActiveItem("Home")}
//               className="flex items-center gap-2 group cursor-pointer absolute left-1/2 transform -translate-x-1/2 z-[10000] pointer-events-auto"
//             >
//               {logoChange ? (
//                 <Logo isScrolled={logoChange} />
//               ) : (
//                 <TrueFocusLogo
//                   sentence="VIAJE SOAR"
//                   focusClassName="bg-gradient-theme"
//                   bgPadding={4}
//                   manualMode={false}
//                   blurAmount={2}
//                   borderColor="#12f8dd"
//                   animationDuration={0.5}
//                   pauseBetweenAnimations={1}
//                   wordColors={["var(--text)", "var(--accent)"]}
//                 />
//               )}
//             </Link>

//             {/* Right icons */}
//             <div className="flex items-center gap-3 relative z-[10000] align-middle">
//               <button
//                 type="button"
//                 className="p-2 rounded-full transition-all duration-300 hover:scale-110 pointer-events-auto z-[10001] hidden md:block"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   handleSearchToggle();
//                 }}
//                 aria-label="Buscar"
//               >
//                 <Search className={`w-5 h-5 text-nav ${!isScrolled ? "drop-shadow-[0_0_10px_rgba(1,1,1,0.9)]" : ""}`} />
//               </button>

//               <div
//                 onClick={toggleLanguage}
//                 className="flex items-center justify-center p-2 rounded-full transition-all duration-300 hover:scale-110 pointer-events-auto z-[10001] hidden md:flex"
//                 aria-label="Cambiar idioma"
//               >
//                 <button className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center" type="button">
//                   {locale === "es" ? <CircleFlag countryCode="mx" /> : <CircleFlag countryCode="us" />}
//                 </button>
//               </div>

//               <div className="relative pointer-events-auto z-[10001]">
//                 {user ? (
//                   <UserMenu isMobile={false} />
//                 ) : (
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       handleLoginRedirect();
//                     }}
//                     className="p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/90 pointer-events-auto z-[10002]"
//                     aria-label="Iniciar sesión"
//                   >
//                     <User className={`w-5 h-5 text-nav ${!isScrolled ? "drop-shadow-[0_0_10px_rgba(1,1,1,0.9)]" : ""}`} />
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <ScrollIndicator />
//         </div>
//       </nav>

//       {/* Search area — unchanged */}
//       <div
//         className={`fixed inset-0 z-50 transition-all duration-300 text-theme ${
//           isSearchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
//         }`}
//       >
//         <div className="absolute inset-0 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
//         <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 mt-16">
//           <div className="rounded-2xl shadow-2xl overflow-hidden bg-theme">
//             <div className="p-6">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" />
//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   placeholder="Search destinations, flights, offers..."
//                   className="w-full pl-12 pr-4 py-4 text-lg border-0 focus:outline-none focus:ring-0"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             </div>
//             {searchResults.length > 0 && (
//               <div className="max-h-96 overflow-y-auto">
//                 {searchResults.map((result) => (
//                   <button
//                     key={result.id}
//                     onClick={() => handleSearchResultClick(result)}
//                     className="w-full text-left p-4 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-50 last:border-b-0"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h3 className="font-semibold text-gray-900">{result.title}</h3>
//                         <p className="text-sm text-gray-600 mt-1">{result.description}</p>
//                       </div>
//                       <span className="text-xs bg-teal-100 text-theme-secondary px-2 py-1 rounded-full">
//                         {result.category}
//                       </span>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}
//             {searchQuery.length >= 2 && searchResults.length === 0 && (
//               <div className="p-8 text-center text-gray-500">
//                 <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//                 <p>No results found for "{searchQuery}"</p>
//                 <p className="text-sm mt-2">Try different keywords</p>
//               </div>
//             )}
//             {searchQuery.length === 0 && (
//               <div className="p-6">
//                 <h3 className="font-semibold text-gray-700 mb-4">Popular Searches</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {["Maldives", "Paris", "Tokyo", "Safari", "Flights"].map((suggestion) => (
//                     <button
//                       key={suggestion}
//                       onClick={() => setSearchQuery(suggestion)}
//                       className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
//                     >
//                       {suggestion}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile nav */}
//       <div
//         className={`nav fixed inset-0 z-40 transition-all duration-500 ${
//           isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
//         }`}
//         id="mobile-menu"
//         aria-hidden={!!isMobileMenuOpen}
//       >
//         <div
//           className="absolute inset-0 bg-[var(--accent)]/20 backdrop-blur-sm"
//           onClick={() => setIsMobileMenuOpen(false)}
//           role="button"
//           tabIndex={0}
//           onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsMobileMenuOpen(false); }}
//           aria-label="Cerrar menú"
//         />

//         <div
//           className={`absolute top-0 left-0 h-full w-80 bg-gradient-theme transform transition-transform duration-500 z-50 ${
//             isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//           }`}
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between p-4 border-b border-(--text)">
//             <button
//               type="button"
//               onClick={() => setIsMobileMenuOpen(false)}
//               className="p-2 text-theme rounded-lg transition-colors hover:bg-[var(--bg-secondary)]"
//               aria-label="Cerrar menú"
//             >
//               <IndentDecrease className="w-6 h-6" />
//             </button>
//             <button
//               type="button"
//               className="p-2 text-theme rounded-lg transition-colors hover:bg-[var(--bg-secondary)]"
//               onClick={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 handleSearchToggle();
//                 setIsMobileMenuOpen(false);
//               }}
//               aria-label="Buscar"
//             >
//               <Search className="w-5 h-5" />
//             </button>
//             <button
//               type="button"
//               onClick={toggleLanguage}
//               className="p-2 text-theme rounded-lg transition-colors hover:bg-[var(--bg-secondary)]"
//               aria-label="Cambiar idioma"
//             >
//               {locale === "es" ? (
//                 <CircleFlag className="w-5 h-5" countryCode="mx" />
//               ) : (
//                 <CircleFlag className="w-5 h-5" countryCode="us" />
//               )}
//             </button>
//             <ThemeSelector />
//           </div>

//           {/* Nav items */}
//           <div className="px-5 flex flex-col justify-evenly h-full relative z-50 overflow-y-auto pb-16">
//             <div className="space-y-8 lg:space-y-6 relative z-50">
//               {navItems.map((item, index) => {
//                 // Items with dropdown → accordion on mobile
//                 if (item.dropdown && dropdownMap[item.dropdown]) {
//                   return (
//                     <MobileAccordion
//                       key={index}
//                       label={item.label}
//                       items={dropdownMap[item.dropdown]}
//                       locale={locale}
//                       onClose={() => setIsMobileMenuOpen(false)}
//                       activeItem={activeItem}
//                       setActiveItem={setActiveItem}
//                     />
//                   );
//                 }

//                 // Regular items
//                 return (
//                   <Link
//                     key={index}
//                     href={item.href as any}
//                     onClick={() => {
//                       setActiveItem(item.label);
//                       setIsMobileMenuOpen(false);
//                     }}
//                     className={`block w-full text-left font-medium transition-all duration-300 transform hover:translate-x-2 tracking-wider uppercase text-sm ${
//                       activeItem === item.label ? "text-theme accent" : "text-theme hover:accent-hover"
//                     }`}
//                     style={{
//                       animationDelay: `${index * 100}ms`,
//                       animation: isMobileMenuOpen ? "slideInLeft 0.6s ease-out forwards" : "none",
//                     }}
//                     aria-current={activeItem === item.label ? "page" : undefined}
//                   >
//                     {item.label}
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/*
//         ─── Desktop Dropdown Overlay ────────────────────────────────────────────
//         Rendered OUTSIDE the nav bar so it can overflow freely and has
//         its own hover zone, sharing the delay timer with the trigger buttons.
//       */}
//       {navItems.map((item) => {
//         if (!item.dropdown || !dropdownMap[item.dropdown]) return null;
//         // We don't render desktop dropdowns inside the nav bar above because
//         // the nav is too narrow. Instead we provide them through the mobile
//         // accordion above and via the hover-triggered <DropdownMenu> attached
//         // directly to each trigger below (see the "Desktop floating triggers"
//         // section). Nothing to render here at the top level.
//         return null;
//       })}

//       {/*
//         ─── Desktop Floating Nav Triggers ──────────────────────────────────────
//         A secondary invisible bar just below the main nav that holds the
//         dropdown triggers for Destinations and Packages on desktop only.
//         This keeps the original nav layout 100% intact while adding the
//         dropdown behavior.
//       */}
//       <div className="hidden md:flex fixed top-16 left-0 right-0 z-[10005] justify-center gap-1 pointer-events-none">
//         {navItems.map((item, index) => {
//           if (!item.dropdown || !dropdownMap[item.dropdown]) return null;
//           return (
//             <div
//               key={index}
//               className="relative pointer-events-auto"
//               onMouseEnter={() => handleDropdownEnter(item.dropdown!)}
//               onMouseLeave={handleDropdownLeave}
//             >
//               {/* Invisible trigger button that floats below the hamburger nav */}
//               <button
//                 type="button"
//                 className={`flex items-center gap-1 px-3 py-1.5 rounded-b-lg text-xs font-semibold uppercase tracking-widest
//                   transition-all duration-200
//                   ${openDropdown === item.dropdown
//                     ? "bg-[var(--accent)]/20 text-[var(--accent)]"
//                     : "bg-[var(--bg)]/80 text-[var(--text)]/70 hover:text-[var(--accent)]"
//                   }
//                   backdrop-blur-sm shadow-sm border border-white/10 border-t-0
//                 `}
//               >
//                 {item.label}
//                 <ChevronDown
//                   className={`w-3 h-3 transition-transform duration-200 ${openDropdown === item.dropdown ? "rotate-180" : ""}`}
//                 />
//               </button>

//               {openDropdown === item.dropdown && (
//                 <div
//                   onMouseEnter={() => handleDropdownEnter(item.dropdown!)}
//                   onMouseLeave={handleDropdownLeave}
//                 >
//                   <DropdownMenu
//                     items={dropdownMap[item.dropdown!]}
//                     locale={locale}
//                     isScrolled={isScrolled}
//                     onClose={() => setOpenDropdown(null)}
//                   />
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// };

// export default Navigation;