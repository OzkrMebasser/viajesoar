import { gsap } from "gsap";
import type { TextRefs, ResponsiveValues } from "./types";
import type { SlideshowDestination } from "@/types/heroDestinations";

/**
 * Calcula valores responsivos basados en el ancho y alto del viewport
 */
export const getResponsiveValues = (
  width: number,
  height: number
): ResponsiveValues => {
  const isSmallMobile = width <= 480;
  const isMobile = width <= 768;

  // 🔥 NUEVA LÓGICA: Altura fija basada en porcentaje del viewport
  const mobileCardHeight = Math.min(height * 0.22, 180); // 👈 22% del alto o máximo 180px
  const mobileOffsetTop = height - mobileCardHeight - 30; // 👈 30px desde el bottom

  return {
    offsetTop: isSmallMobile || isMobile
      ? mobileOffsetTop // 👈 Calculado dinámicamente
      : height - 330,
    offsetLeft: isSmallMobile
      ? width - 220
      : isMobile
        ? width - 280
        : width - 550,
    cardWidth: isSmallMobile ? 90 : isMobile ? 120 : 200,
    cardHeight: isSmallMobile || isMobile
      ? mobileCardHeight // 👈 Altura fija calculada
      : 300,
    gap: isSmallMobile ? 15 : isMobile ? 20 : 40,
    numberSize: isSmallMobile ? 25 : isMobile ? 30 : 50,
    yOffset1: isSmallMobile ? 40 : isMobile ? 50 : 100,
    yOffset2: isSmallMobile ? 25 : isMobile ? 30 : 50,
    yOffset3: isSmallMobile ? 30 : isMobile ? 40 : 60,
    progressWidth: isSmallMobile ? 250 : isMobile ? 300 : 500,
    cardContentOffset: isSmallMobile || isMobile
      ? mobileCardHeight * 0.35 // 👈 35% de la altura de la card
      : 100,
    coverXOffset: isSmallMobile ? 150 : isMobile ? 200 : 400,
    navOffset: isSmallMobile ? -80 : isMobile ? -100 : -200,
    paginationOffset: isSmallMobile ? 80 : isMobile ? 100 : 200,
    detailsXOffset: isSmallMobile ? -80 : isMobile ? -100 : -200,
    cardContentFinalY: isSmallMobile ? 5 : 10,
    isSmallMobile,
    isMobile,
  };
};

/**
 * Obtiene los refs de texto según si es par (even) o impar (odd)
 */
export const getTextRefs = (
  isEven: boolean,
  evenRefs: TextRefs,
  oddRefs: TextRefs
): TextRefs => {
  return isEven ? evenRefs : oddRefs;
};

/**
 * Actualiza el contenido de texto de los refs con los datos del destino
 */
export const updateTextContent = (
  refs: TextRefs,
  data: SlideshowDestination
): void => {
  if (refs.place.current) refs.place.current.textContent = data.place;
  if (refs.country.current) refs.country.current.textContent = data.country;
  if (refs.title1.current) refs.title1.current.textContent = data.title;
  if (refs.title2.current) refs.title2.current.textContent = data.title2;
  if (refs.desc.current) refs.desc.current.textContent = data.description;
};

/**
 * Resetea las posiciones Y de los refs inactivos
 */
export const resetInactiveYPositions = (
  refs: TextRefs,
  yOffset1: number,
  yOffset2: number,
  yOffset3: number
): void => {
  gsap.set(refs.place.current, { y: yOffset1 });
  gsap.set(refs.country.current, { y: yOffset1 });
  gsap.set(refs.title1.current, { y: yOffset1 });
  gsap.set(refs.title2.current, { y: yOffset2 });
  gsap.set(refs.desc.current, { y: yOffset3 });
  gsap.set(refs.cta.current, { y: yOffset3 });
};

/**
 * Anima los refs activos con delays progresivos
 */
export const animateActiveRefs = (refs: TextRefs, ease: string): void => {
  gsap.to(refs.place.current, { y: 0, delay: 0.1, duration: 0.7, ease });
  gsap.to(refs.country.current, { y: 0, delay: 0.15, duration: 0.7, ease });
  gsap.to(refs.title1.current, { y: 0, delay: 0.15, duration: 0.7, ease });
  gsap.to(refs.title2.current, { y: 0, delay: 0.3, duration: 0.4, ease });
  gsap.to(refs.desc.current, { y: 0, delay: 0.35, duration: 0.4, ease });
  gsap.to(refs.cta.current, { y: 0, delay: 0.4, duration: 0.4, ease });
};