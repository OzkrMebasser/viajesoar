"use client";
import React, { useState, useEffect, useRef, Fragment } from "react";
import { gsap } from "gsap";
import { Bookmark } from "lucide-react";

// Components
import WorldMapLoader from "@/components/WorldMapLoader";
import HeroSkeleton from "./HeroSkeleton";
// Hooks
import { useFadeOutMap } from "@/lib/hooks/useFadeOutMap";

// Types
import type { Locale } from "@/types/locale";
import type { SlideshowDestination } from "@/types/heroDestinations";

interface Props {
  locale: Locale;
  data: SlideshowDestination[];
}

const HeroTravelSlides = ({ locale, data }: Props) => {
  //States
  const [ready, setReady] = useState(false);
  const [order, setOrder] = useState<number[]>([]);
  const [detailsEven, setDetailsEven] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationsReady, setAnimationsReady] = useState(false);

  // All the refs...
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
  // const coverRef = useRef<HTMLDivElement>(null);
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

  /// UseEffects....

  useEffect(() => {
    requestAnimationFrame(() => {
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (data.length > 0 && order.length === 0) {
      const initialOrder = Array.from({ length: data.length }, (_, i) => i);
      setOrder(initialOrder);
      orderRef.current = initialOrder;
    }
  }, [data.length, order.length]);

  useEffect(() => {
    orderRef.current = order;
  }, [order]);

  useEffect(() => {
    detailsEvenRef.current = detailsEven;
  }, [detailsEven]);

  // useEffect(() => {
  //   // Solo inicializar si tenemos datos y orden configurado
  //   // if (data.length > 0 && order.length > 0) {
  //   //   initializeAnimations();
  //   // }
  //   if (!containerRef.current) return;
  //   if (data.length === 0) return;
  //   if (order.length === 0) return;

  //   initializeAnimations();

  //   return () => {
  //     if (loopTimeoutRef.current) {
  //       clearTimeout(loopTimeoutRef.current);
  //     }
  //   };
  // }, [data.length, order.length]);
  // }, [data, order]);
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      initializeAnimations();
    }, containerRef);

    return () => ctx.revert(); // 🔥 LIMPIA TODO
    // return () => {
    //   ctx.revert(); // Limpia GSAP

    //   // 🔥 Agregar esto también
    //   if (loopTimeoutRef.current) {
    //     clearTimeout(loopTimeoutRef.current);
    //     loopTimeoutRef.current = null;
    //   }
    // };
  }, [data.length, order.length]);

  const showMap = useFadeOutMap({
    selector: ".worldmap-container",
    trigger: data.length > 0,
    delay: 2000,
    duration: 3,
  });

  // Slides animations
  const initializeAnimations = (): void => {
    const { innerHeight: height, innerWidth: width } = window;
    const isSmallMobile = width <= 480; // iPhone 8 y similares
    const isMobile = width <= 768;

    // Responsive values with small mobile support
    const offsetTop = isSmallMobile
      ? height - 160
      : isMobile
        ? height - 200
        : height - 330;

    const offsetLeft = isSmallMobile
      ? width - 220
      : isMobile
        ? width - 280
        : width - 550;

    const cardWidth = isSmallMobile ? 90 : isMobile ? 120 : 200;

    const cardHeight = isSmallMobile ? 140 : isMobile ? 180 : 300;

    const gap = isSmallMobile ? 15 : isMobile ? 20 : 40;

    const numberSize = isSmallMobile ? 25 : isMobile ? 30 : 50;

    const ease = "sine.inOut";

    const currentOrder = orderRef.current;
    const [active, ...rest] = currentOrder;

    const detailsActive = detailsEvenRef.current
      ? detailsEvenElementRef.current
      : detailsOddElementRef.current;

    const detailsInactive = detailsEvenRef.current
      ? detailsOddElementRef.current
      : detailsEvenElementRef.current;

    gsap.set(paginationRef.current, {
      top: offsetTop + (isSmallMobile ? 160 : isMobile ? 200 : 330),
      left: offsetLeft,
      y: isSmallMobile ? 80 : isMobile ? 100 : 200,
      opacity: 0,
      zIndex: 30,
    });

    gsap.set(navRef.current, {
      y: isSmallMobile ? -80 : isMobile ? -100 : -200,
      opacity: 0,
    });

    gsap.set(cardRefs.current[active], {
      x: 0,
      y: 0,
      width: width,
      height: height,
    });

    gsap.set(cardContentRefs.current[active], { x: 0, y: 0, opacity: 0 });
    gsap.set(detailsActive, {
      opacity: 0,
      zIndex: 22,
      x: isSmallMobile ? -80 : isMobile ? -100 : -200,
    });
    gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });

    const inactiveRefs = detailsEvenRef.current
      ? [
          placeTextOddRef,
          countryTextOddRef,
          title1OddRef,
          title2OddRef,
          descOddRef,
          ctaOddRef,
        ]
      : [
          placeTextEvenRef,
          countryTextEvenRef,
          title1EvenRef,
          title2EvenRef,
          descEvenRef,
          ctaEvenRef,
        ];

    const yOffset1 = isSmallMobile ? 40 : isMobile ? 50 : 100;
    const yOffset2 = isSmallMobile ? 25 : isMobile ? 30 : 50;
    const yOffset3 = isSmallMobile ? 30 : isMobile ? 40 : 60;

    gsap.set(inactiveRefs[0].current, { y: yOffset1 });
    gsap.set(inactiveRefs[1].current, { y: yOffset1 });
    gsap.set(inactiveRefs[2].current, { y: yOffset1 });
    gsap.set(inactiveRefs[3].current, { y: yOffset2 });
    gsap.set(inactiveRefs[4].current, { y: yOffset3 });
    gsap.set(inactiveRefs[5].current, { y: yOffset3 });

    const progressWidth = isSmallMobile ? 250 : isMobile ? 300 : 500;
    gsap.set(progressRef.current, {
      width: progressWidth * (1 / currentOrder.length) * (active + 1),
    });

    rest.forEach((i, index) => {
      const cardX =
        offsetLeft +
        (isSmallMobile ? 150 : isMobile ? 200 : 400) +
        index * (cardWidth + gap);

      gsap.set(cardRefs.current[i], {
        x: cardX,
        y: offsetTop,
        width: cardWidth,
        height: cardHeight,
        zIndex: 30,
        borderRadius: 10,
      });

      gsap.set(cardContentRefs.current[i], {
        x: cardX,
        zIndex: 30,
        y: offsetTop + cardHeight - (isSmallMobile ? 50 : isMobile ? 60 : 100),
      });

      if (slideNumberRefs.current[i]) {
        gsap.set(slideNumberRefs.current[i], { x: (index + 1) * numberSize });
      }
    });

    gsap.set(indicatorRef.current, { x: -width });

    const startDelay = 0.6;
    const coverXOffset = isSmallMobile ? 150 : isMobile ? 200 : 400;

    // gsap.to(coverRef.current, {
    //   x: width + coverXOffset,
    //   delay: 0.5,
    //   ease,
    //   onComplete: () => {
    //     loopTimeoutRef.current = setTimeout(() => {
    //       loop();
    //     }, 500);
    //   },
    // });
    // gsap.to(coverRef.current, {
    //   x: width + coverXOffset,
    //   delay: 0.5,
    //   ease,
    //   onComplete: () => {
    //     // 🔥 IMPORTANTE: Ocultar el cover después de la animación

    //     loopTimeoutRef.current = setTimeout(() => {
    //       loop();
    //     }, 500);

    //     // 🔥 Con null check
    //     if (coverRef.current) {
    //       gsap.killTweensOf(coverRef.current);
    //       coverRef.current.style.display = "none";
    //     }
    //   },
    // });

    rest.forEach((i, index) => {
      gsap.to(cardRefs.current[i], {
        x: offsetLeft + index * (cardWidth + gap),
        zIndex: 30,
        delay: startDelay + 0.05 * index,
        ease,
      });

      gsap.to(cardContentRefs.current[i], {
        x: offsetLeft + index * (cardWidth + gap),
        zIndex: 30,
        delay: startDelay + 0.05 * index,
        ease,
      });
    });

    gsap.to(paginationRef.current, {
      y: 0,
      opacity: 1,
      ease,
      delay: startDelay,
    });

    gsap.to(navRef.current, { y: 0, opacity: 1, ease, delay: startDelay });
    //   gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });

    //    loopTimeoutRef.current = setTimeout(() => {
    //   loop();
    // }, 1500);
    gsap.to(detailsActive, {
      opacity: 1,
      x: 0,
      ease,
      delay: startDelay,
      onComplete: () => {
        // 🔥 Marcar que las animaciones iniciales terminaron
        setAnimationsReady(true);

        // Iniciar el loop
        loopTimeoutRef.current = setTimeout(() => {
          loop();
        }, 500);
      },
    });
  };

  const step = (direction: "next" | "prev" = "next"): Promise<void> => {
    return new Promise((resolve) => {
      if (isAnimating) {
        resolve();
        return;
      }

      setIsAnimating(true);

      const { innerHeight: height, innerWidth: width } = window;
      const isSmallMobile = width <= 480;
      const isMobile = width <= 768;

      const offsetTop = isSmallMobile
        ? height - 160
        : isMobile
          ? height - 200
          : height - 330;

      const offsetLeft = isSmallMobile
        ? width - 220
        : isMobile
          ? width - 280
          : width - 550;

      const cardWidth = isSmallMobile ? 90 : isMobile ? 120 : 200;

      const cardHeight = isSmallMobile ? 140 : isMobile ? 180 : 300;

      const gap = isSmallMobile ? 15 : isMobile ? 20 : 40;

      const numberSize = isSmallMobile ? 25 : isMobile ? 30 : 50;

      const ease = "sine.inOut";

      const currentOrder = [...orderRef.current];
      let newOrder: number[];
      if (direction === "next") {
        const shiftedItem = currentOrder.shift();
        newOrder =
          shiftedItem !== undefined
            ? [...currentOrder, shiftedItem]
            : currentOrder;
      } else {
        const poppedItem = currentOrder.pop();
        newOrder =
          poppedItem !== undefined
            ? [poppedItem, ...currentOrder]
            : currentOrder;
      }

      orderRef.current = newOrder;
      detailsEvenRef.current = !detailsEvenRef.current;

      setOrder(newOrder);
      setDetailsEven(detailsEvenRef.current);

      const detailsActive = detailsEvenRef.current
        ? detailsEvenElementRef.current
        : detailsOddElementRef.current;
      const detailsInactive = detailsEvenRef.current
        ? detailsOddElementRef.current
        : detailsEvenElementRef.current;

      const activeRefs = detailsEvenRef.current
        ? [
            placeTextEvenRef,
            countryTextEvenRef,
            title1EvenRef,
            title2EvenRef,
            descEvenRef,
            ctaEvenRef,
          ]
        : [
            placeTextOddRef,
            countryTextOddRef,
            title1OddRef,
            title2OddRef,
            descOddRef,
            ctaOddRef,
          ];

      const activeIndex = newOrder[0];

      if (!data[activeIndex]) {
        console.error(
          `Data at index ${activeIndex} is undefined. Current order:`,
          newOrder,
        );
        setIsAnimating(false);
        resolve();
        return;
      }

      if (activeRefs[0].current)
        activeRefs[0].current.textContent = data[activeIndex].place;
      if (activeRefs[1].current)
        activeRefs[1].current.textContent = data[activeIndex].country;
      if (activeRefs[2].current)
        activeRefs[2].current.textContent = data[activeIndex].title;
      if (activeRefs[3].current)
        activeRefs[3].current.textContent = data[activeIndex].title2;
      if (activeRefs[4].current)
        activeRefs[4].current.textContent = data[activeIndex].description;

      gsap.set(detailsActive, { zIndex: 22 });
      gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease });
      gsap.to(activeRefs[0].current, { y: 0, delay: 0.1, duration: 0.7, ease });
      gsap.to(activeRefs[1].current, {
        y: 0,
        delay: 0.15,
        duration: 0.7,
        ease,
      });
      gsap.to(activeRefs[2].current, {
        y: 0,
        delay: 0.15,
        duration: 0.7,
        ease,
      });
      gsap.to(activeRefs[3].current, { y: 0, delay: 0.3, duration: 0.4, ease });
      gsap.to(activeRefs[4].current, {
        y: 0,
        delay: 0.35,
        duration: 0.4,
        ease,
      });
      gsap.to(activeRefs[5].current, {
        y: 0,
        delay: 0.4,
        duration: 0.4,
        ease,
      });

      gsap.set(detailsInactive, { zIndex: 12 });

      const [active, ...rest] = newOrder;
      const prv = rest[rest.length - 1];

      gsap.set(cardRefs.current[prv], { zIndex: 10 });
      gsap.set(cardRefs.current[active], { zIndex: 20 });
      gsap.to(cardRefs.current[prv], { scale: 1.5, ease, duration: 1 });

      gsap.to(cardContentRefs.current[active], {
        y: offsetTop + cardHeight - (isSmallMobile ? 5 : 10),
        opacity: 0,
        duration: 0.6,
        ease,
      });

      if (slideNumberRefs.current[active]) {
        gsap.to(slideNumberRefs.current[active], { x: 0, ease, duration: 1 });
      }

      if (slideNumberRefs.current[prv]) {
        gsap.to(slideNumberRefs.current[prv], {
          x: -numberSize,
          ease,
          duration: 1,
        });
      }

      const progressWidth = isSmallMobile ? 250 : isMobile ? 300 : 500;
      gsap.to(progressRef.current, {
        width: progressWidth * (1 / newOrder.length) * (active + 1),
        ease,
        duration: 1,
      });

      gsap.to(cardRefs.current[active], {
        x: 0,
        y: 0,
        ease,
        width: width,
        height: height,
        borderRadius: 0,
        duration: 1,
        onComplete: () => {
          const xNew = offsetLeft + (rest.length - 1) * (cardWidth + gap);

          gsap.set(cardRefs.current[prv], {
            x: xNew,
            y: offsetTop,
            width: cardWidth,
            height: cardHeight,
            zIndex: 30,
            borderRadius: 10,
            scale: 1,
          });

          gsap.set(cardContentRefs.current[prv], {
            x: xNew,
            y:
              offsetTop +
              cardHeight -
              (isSmallMobile ? 50 : isMobile ? 60 : 100),
            opacity: 1,
            zIndex: 40,
          });

          if (slideNumberRefs.current[prv]) {
            gsap.set(slideNumberRefs.current[prv], {
              x: rest.length * numberSize,
            });
          }

          gsap.set(detailsInactive, { opacity: 0 });

          const inactiveRefs = detailsEvenRef.current
            ? [
                placeTextOddRef,
                countryTextOddRef,
                title1OddRef,
                title2OddRef,
                descOddRef,
                ctaOddRef,
              ]
            : [
                placeTextEvenRef,
                countryTextEvenRef,
                title1EvenRef,
                title2EvenRef,
                descEvenRef,
                ctaEvenRef,
              ];

          const yOffset1 = isSmallMobile ? 40 : isMobile ? 50 : 100;
          const yOffset2 = isSmallMobile ? 25 : isMobile ? 30 : 50;
          const yOffset3 = isSmallMobile ? 30 : isMobile ? 40 : 60;

          gsap.set(inactiveRefs[0].current, { y: yOffset1 });
          gsap.set(inactiveRefs[1].current, { y: yOffset1 });
          gsap.set(inactiveRefs[2].current, { y: yOffset1 });
          gsap.set(inactiveRefs[3].current, { y: yOffset2 });
          gsap.set(inactiveRefs[4].current, { y: yOffset3 });
          gsap.set(inactiveRefs[5].current, { y: yOffset3 });

          setIsAnimating(false);
          resolve();
        },
      });

      rest.forEach((i, index) => {
        if (i !== prv) {
          const xNew = offsetLeft + index * (cardWidth + gap);

          gsap.set(cardRefs.current[i], { zIndex: 30 });
          gsap.to(cardRefs.current[i], {
            x: xNew,
            y: offsetTop,
            width: cardWidth,
            height: cardHeight,
            ease,
            delay: 0.1 * (index + 1),
            duration: 1,
          });

          gsap.to(cardContentRefs.current[i], {
            x: xNew,
            y:
              offsetTop +
              cardHeight -
              (isSmallMobile ? 50 : isMobile ? 60 : 100),
            opacity: 1,
            zIndex: 40,
            ease,
            delay: 0.1 * (index + 1),
            duration: 0.6,
          });

          if (slideNumberRefs.current[i]) {
            gsap.to(slideNumberRefs.current[i], {
              x: (index + 1) * numberSize,
              ease,
              duration: 1,
            });
          }
        }
      });
    });
  };

  const loop = async (): Promise<void> => {
    if (isAnimating) return;

    const { innerWidth: width } = window;

    await new Promise((resolve) => {
      gsap.to(indicatorRef.current, {
        x: 0,
        duration: 3,
        onComplete: resolve,
      });
    });

    await new Promise((resolve) => {
      gsap.to(indicatorRef.current, {
        x: width,
        duration: 1.2,
        delay: 0.3,
        onComplete: resolve,
      });
    });

    gsap.set(indicatorRef.current, { x: -width });

    await step();

    loopTimeoutRef.current = setTimeout(() => {
      loop();
    }, 100);
  };

  // console.log("Data", data)
  // 🔐 GUARD SSR / DATA
  if (!ready || !data || data.length === 0) {
    return <HeroSkeleton />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen text-white overflow-hidden  "
    >
      {/* Mapa del mundo loader */}
      {ready && showMap && (
        <div
          className="
      worldmap-container
      fixed inset-0
      z-50
      bg-black
      pointer-events-none
      will-change-opacity
    "
        >
          <WorldMapLoader />
        </div>
      )}

      {/* Images cards */}
      {data.map((item, index) => (
        <Fragment key={item.id ?? index}>
          <div
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="absolute  left-0 top-0 bg-center bg-cover shadow-2xl w-50"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            {/* Overlay negro transparente */}
            <div className="absolute inset-0 bg-black/40 rounded-lg "></div>
          </div>

          <div
            ref={(el) => {
              cardContentRefs.current[index] = el;
            }}
            className="absolute left-0 -top-8 lg:-top-6 text-white pl-2 md:pl-4 "
          >
            <div className="w-8 h-0.5 sm:w-6 sm:h-0.5 md:w-8 md:h-1 rounded-full bg-white" />
            <div className="mt-1 text-xs font-medium">{item.place}</div>
            <div className="mt-1 text-xs font-medium">{item.country}</div>
            <div className="font-semibold text-[10px] sm:text-sm md:text-xl">
              {item.title}
            </div>
            <div className="font-semibold text-[10px] sm:text-sm md:text-xl">
              {item.title2}
            </div>
          </div>
        </Fragment>
      ))}

      {/* Images hero even */}
      <div
        ref={detailsEvenElementRef}
        className="absolute left-3 sm:left-4 md:left-15 top-20 sm:top-24 md:top-20 z-20 max-w-xs md:max-w-none py-4"
      >
        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-4 h-0.5 sm:w-6 sm:h-0.5 md:w-8 md:h-1 bg-white rounded-full" />
          <div ref={placeTextEvenRef} className="pt-2 text-sm md:text-xl">
            {data[order[0]]?.place}
          </div>
          <div ref={countryTextEvenRef} className="pb-2 text-sm md:text-xl">
            {data[order[0]]?.country}
          </div>
        </div>
        <div className="mb-1 overflow-hidden ">
          <div
            ref={title1EvenRef}
            className="text-3xl sm:text-4xl md:text-7xl font-semibold"
          >
            {data[order[0]]?.title}
          </div>
          <div
            ref={title2EvenRef}
            className="text-3xl sm:text-4xl md:text-7xl font-semibold leading-tight"
          >
            {data[order[0]]?.title2}
          </div>
        </div>
        {/* <div className="mb-2  h-12 sm:h-16 md:h-23 bg-amber-400 overflow-hidden">
          <div
            ref={title2EvenRef}
            className="text-3xl sm:text-4xl md:text-7xl font-semibold leading-tight"
          >
            {data[order[0]]?.title2}
          </div>
        </div> */}
        <div
          ref={descEvenRef}
          className="mt-2 w-full sm:w-80 md:w-140 text-xs sm:text-sm md:text-base md:text-justify "
        >
          {data[order[0]]?.description}
        </div>
        <div
          ref={ctaEvenRef}
          className="relative pt-4 w-full flex items-center"
        >
          <button
            className="bg-yellow-500 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full text-white grid place-items-center border-none"
            title="Bookmark"
          >
            <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
          <button className="border border-white bg-transparent h-7 sm:h-8 md:h-9 rounded-full text-white px-3 sm:px-4 md:px-6 text-xs ml-2 md:ml-4 uppercase">
            Discover Location
          </button>
        </div>
      </div>
      {/* Images hero odd */}
      <div
        ref={detailsOddElementRef}
        className="absolute left-3 sm:left-4 md:left-15 top-20 sm:top-24 md:top-20 z-20 max-w-xs md:max-w-none py-4"
      >
        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-4 h-0.5 sm:w-6 sm:h-0.5 md:w-8 md:h-1 bg-white rounded-full" />
          <div
            ref={placeTextOddRef}
            className="pt-2 text-xs sm:text-sm md:text-xl"
          >
            {data[order[0]]?.place}
          </div>
          <div
            ref={countryTextOddRef}
            className="pb-2 text-xs sm:text-sm md:text-xl"
          >
            {data[order[0]]?.country}
          </div>
        </div>
        <div className="mb-1 overflow-hidden">
          <div
            ref={title1OddRef}
            className="text-2xl sm:text-4xl md:text-7xl font-semibold"
          >
            {data[order[0]]?.title}
          </div>
          <div
            ref={title2OddRef}
            className="text-2xl sm:text-4xl md:text-7xl font-semibold leading-tight"
          >
            {data[order[0]]?.title2}
          </div>
        </div>
        {/* <div className="mb-2  h-12 sm:h-16 md:h-20 bg-amber-400 overflow-hidden">
          <div
            ref={title2OddRef}
            className="text-2xl sm:text-4xl md:text-7xl font-semibold leading-tight"
          >
            {data[order[0]]?.title2}
          </div>
        </div> */}
        <div
          ref={descOddRef}
          className="mt-2 w-full sm:w-80 md:w-140 text-xs sm:text-sm md:text-base md:text-justify "
        >
          {data[order[0]]?.description}
        </div>
        <div ref={ctaOddRef} className="relative pt-4 w-full flex items-center">
          <button
            className="bg-yellow-500 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full text-white grid place-items-center border-none"
            title="Bookmark"
          >
            <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
          <button className="border border-white bg-transparent h-7 sm:h-8 md:h-9 rounded-full text-white px-3 sm:px-4 md:px-6 text-xs ml-2 md:ml-4 uppercase">
            Discover Location
          </button>
        </div>
      </div>

      {/* Hidden elements for GSAP references */}

      <nav ref={navRef} className="opacity-0" />

      {/* <div
        ref={coverRef}
        className="absolute top-0 left-0 w-full h-full bg-transparent z-50"
      /> */}
    </div>
  );
};

export default HeroTravelSlides;
