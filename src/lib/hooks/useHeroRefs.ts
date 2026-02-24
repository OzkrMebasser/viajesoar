import { useRef } from "react";

export function useHeroRefs() {
  // Declarar todos los refs primero
  const orderRef = useRef<number[]>([]);
  const detailsEvenRef = useRef<boolean>(true);
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const detailsEvenElementRef = useRef<HTMLDivElement>(null);
  const detailsOddElementRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const slideNumberRefs = useRef<(HTMLDivElement | null)[]>([]);
  const placeTextEvenRef = useRef<HTMLDivElement>(null);
  const countryTextEvenRef = useRef<HTMLDivElement>(null);
  const title1EvenRef = useRef<HTMLDivElement>(null);
  const title2EvenRef = useRef<HTMLDivElement>(null);
  const descEvenRef = useRef<HTMLDivElement>(null);
  const ctaEvenRef = useRef<HTMLDivElement>(null);
  const placeTextOddRef = useRef<HTMLDivElement>(null);
  const countryTextOddRef = useRef<HTMLDivElement>(null);
  const title1OddRef = useRef<HTMLDivElement>(null);
  const title2OddRef = useRef<HTMLDivElement>(null);
  const descOddRef = useRef<HTMLDivElement>(null);
  const ctaOddRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef<boolean>(true);
  const viewportRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  // Agrupar los refs de texto
  const textRefs = {
    evenRefs: {
      place: placeTextEvenRef,
      country: countryTextEvenRef,
      title1: title1EvenRef,
      title2: title2EvenRef,
      desc: descEvenRef,
      cta: ctaEvenRef,
    },
    oddRefs: {
      place: placeTextOddRef,
      country: countryTextOddRef,
      title1: title1OddRef,
      title2: title2OddRef,
      desc: descOddRef,
      cta: ctaOddRef,
    },
  };

  // Retornar todo junto
  return {
    orderRef,
    detailsEvenRef,
    loopTimeoutRef,
    containerRef,
    cardRefs,
    cardContentRefs,
    detailsEvenElementRef,
    detailsOddElementRef,
    indicatorRef,
    navRef,
    paginationRef,
    coverRef,
    progressRef,
    slideNumberRefs,
    placeTextEvenRef,
    countryTextEvenRef,
    title1EvenRef,
    title2EvenRef,
    descEvenRef,
    ctaEvenRef,
    placeTextOddRef,
    countryTextOddRef,
    title1OddRef,
    title2OddRef,
    descOddRef,
    ctaOddRef,
    isMountedRef,
    viewportRef,
    textRefs, 
  };
}