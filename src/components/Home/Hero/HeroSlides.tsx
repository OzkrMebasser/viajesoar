"use client";
// React & Libraries
import React, { useState, useEffect, useRef, Fragment } from "react";
import { gsap } from "gsap";

// Components
import WorldMapLoader from "@/components/WorldMapLoader";
import HeroSlidesSkeleton from "./HeroSlidesSkeleton";
import ButtonGlower from "@/components/ui/ButtonGlower";

// Hooks
import { useFadeOutMap } from "@/lib/hooks/useFadeOutMap";
import { useHeroRefs } from "@/lib/hooks/useHeroRefs";

// Types
import type { Locale } from "@/types/locale";
import type { SlideshowDestination } from "@/types/heroDestinations";

// Helpers & Constants
import {
  getResponsiveValues,
  getTextRefs,
  updateTextContent,
  resetInactiveYPositions,
  animateActiveRefs,
} from "./helpers";
import { ANIMATION_CONSTANTS, ACTIVE_ANIMATION_DELAYS } from "./constants";

// Props
interface Props {
  locale: Locale;
  data: SlideshowDestination[];
}

const HeroSlides = ({ locale, data }: Props) => {
  // States
  const [clientReady, setClientReady] = useState(false);
  const [order, setOrder] = useState<number[]>([]);
  const [detailsEven, setDetailsEven] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  // All the refs...

  const {
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
  } = useHeroRefs();

  // UseEffects
  // Marco cuando el componente ya está montado
  // para evitar ejecutar animaciones o setState
  // si ya se desmontó (evita warnings y memory leaks)
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  // Espero a que el componente ya esté hidratado en el cliente
  // para poder ejecutar lógica que depende del window o animaciones
  useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.resolve().then(() => {
        if (isMountedRef.current) {
          setClientReady(true);
        }
      });
    }
  }, []);
  // Cuando llegan los datos, creo el orden inicial de los slides
  // Solo lo hago una vez para no resetear el slider innecesariamente
  useEffect(() => {
    if (data.length > 0 && order.length === 0) {
      const initialOrder = Array.from({ length: data.length }, (_, i) => i);
      setOrder(initialOrder);
      orderRef.current = initialOrder;
    }
  }, [data.length, order.length]);
  // Mantengo el ref sincronizado con el state
  // porque las animaciones leen desde el ref
  // y no quiero depender de re-renders
  useEffect(() => {
    orderRef.current = order;
  }, [order]);

  // Igual que con order, sincronizo el modo even/odd
  // para que GSAP siempre tenga el valor actual
  useEffect(() => {
    detailsEvenRef.current = detailsEven;
  }, [detailsEven]);

  // Este efecto se encarga de arrancar las animaciones
  // Solo corre cuando:
  // - Ya hay datos
  // - Ya hay orden
  // - Ya estamos en cliente
  // - Los refs están listos
  //
  // También limpia intervalos, timeouts y animaciones
  // para evitar comportamientos raros al desmontar
  useEffect(() => {
    if (
      !containerRef.current ||
      data.length === 0 ||
      order.length === 0 ||
      !clientReady
    ) {
      return;
    }

    gsap.killTweensOf("*");
    setInitialized(false);
    setIsAnimating(false);

    let checkInterval: NodeJS.Timeout | null = null;

    const tryInitialize = () => {
      const currentOrder = orderRef.current;
      const activeIndex = currentOrder[0];
      const detailsActive = detailsEvenRef.current
        ? detailsEvenElementRef.current
        : detailsOddElementRef.current;

      if (
        detailsActive &&
        detailsEvenElementRef.current &&
        detailsOddElementRef.current &&
        cardRefs.current[activeIndex]
      ) {
        if (checkInterval) {
          clearInterval(checkInterval);
          checkInterval = null;
        }
        if (isMountedRef.current) {
          initializeAnimations();
          setInitialized(true);
        }
      }
    };

    checkInterval = setInterval(tryInitialize, 50);

    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }

      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
        loopTimeoutRef.current = null;
      }

      gsap.killTweensOf("*");
      setIsAnimating(false);
      setInitialized(false);
    };
  }, [data.length, order.length, clientReady]);

  // Hook para mostrar el mapa del mundo con fade out
  const showMap = useFadeOutMap({
    selector: ".worldmap-container",
    trigger: data.length > 0,
    delay: 2000,
    duration: 3,
  });

  // Función encargada de inicializar las animaciones al montar el componente
  const initializeAnimations = (): void => {
    if (!isMountedRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;
    viewportRef.current = { width, height };

    const responsive = getResponsiveValues(width, height);
    const ease = ANIMATION_CONSTANTS.EASE;

    const currentOrder = orderRef.current;
    const [active, ...rest] = currentOrder;
    const activeIndex = active;
    const firstData = data[activeIndex];

    const { evenRefs, oddRefs } = textRefs;
    const initialRefs = getTextRefs(detailsEvenRef.current, evenRefs, oddRefs);

    if (firstData) {
      updateTextContent(initialRefs, firstData);
    }

    const detailsActive = detailsEvenRef.current
      ? detailsEvenElementRef.current
      : detailsOddElementRef.current;

    const detailsInactive = detailsEvenRef.current
      ? detailsOddElementRef.current
      : detailsEvenElementRef.current;

    if (!detailsActive || !detailsInactive || !cardRefs.current[active]) {
      console.warn("Required refs not available yet (fallback)");
      return;
    }

    gsap.set(paginationRef.current, {
      top:
        responsive.offsetTop +
        (responsive.isSmallMobile ? 40 : responsive.isMobile ? 50 : 0),
      y: responsive.paginationOffset,
      opacity: 0,
      zIndex: 30,
    });

    gsap.set(navRef.current, {
      y: responsive.navOffset,
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
      x: responsive.detailsXOffset,
    });
    gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });

    const inactiveRefs = getTextRefs(
      !detailsEvenRef.current,
      evenRefs,
      oddRefs,
    );

    resetInactiveYPositions(
      inactiveRefs,
      responsive.yOffset1,
      responsive.yOffset2,
      responsive.yOffset3,
    );

    gsap.set(progressRef.current, {
      width:
        responsive.progressWidth * (1 / currentOrder.length) * (active + 1),
    });

    rest.forEach((i, index) => {
      const cardX =
        responsive.offsetLeft +
        responsive.coverXOffset +
        index * (responsive.cardWidth + responsive.gap);

      gsap.set(cardRefs.current[i], {
        x: cardX,
        y: responsive.offsetTop,
        width: responsive.cardWidth,
        height: responsive.cardHeight,
        zIndex: 30,
        borderRadius: 10,
      });

      gsap.set(cardContentRefs.current[i], {
        x: cardX,
        zIndex: 30,
        y:
          responsive.offsetTop +
          responsive.cardHeight -
          responsive.cardContentOffset,
      });

      if (slideNumberRefs.current[i]) {
        gsap.set(slideNumberRefs.current[i], {
          x: (index + 1) * responsive.numberSize,
        });
      }
    });

    gsap.set(indicatorRef.current, { x: -width });

    gsap.to(coverRef.current, {
      x: width + responsive.coverXOffset,
      delay: ANIMATION_CONSTANTS.COVER_DELAY,
      ease,
      onComplete: () => {
        if (isMountedRef.current) {
          loopTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              loop();
            }
          }, ANIMATION_CONSTANTS.LOOP_TIMEOUT);
        }
      },
    });

    rest.forEach((i, index) => {
      gsap.to(cardRefs.current[i], {
        x:
          responsive.offsetLeft +
          index * (responsive.cardWidth + responsive.gap),
        zIndex: 30,
        delay: ANIMATION_CONSTANTS.START_DELAY + 0.05 * index,
        ease,
      });

      gsap.to(cardContentRefs.current[i], {
        x:
          responsive.offsetLeft +
          index * (responsive.cardWidth + responsive.gap),
        zIndex: 30,
        delay: ANIMATION_CONSTANTS.START_DELAY + 0.05 * index,
        ease,
      });
    });

    gsap.to(paginationRef.current, {
      y: 0,
      opacity: 1,
      ease,
      delay: ANIMATION_CONSTANTS.START_DELAY,
    });

    gsap.to(navRef.current, {
      y: 0,
      opacity: 1,
      ease,
      delay: ANIMATION_CONSTANTS.START_DELAY,
    });
    gsap.to(detailsActive, {
      opacity: 1,
      x: 0,
      ease,
      delay: ANIMATION_CONSTANTS.START_DELAY,
    });
  };

  // función encargada de animar el paso al siguiente o anterior slide
  const step = (direction: "next" | "prev" = "next"): Promise<void> => {
    return new Promise((resolve) => {
      if (isAnimating || !isMountedRef.current) {
        resolve();
        return;
      }

      const currentDetails = detailsEvenRef.current
        ? detailsEvenElementRef.current
        : detailsOddElementRef.current;

      if (currentDetails) {
        const fixedHeight = currentDetails.offsetHeight;
        gsap.set(currentDetails, {
          height: fixedHeight,
        });
      }

      setIsAnimating(true);

      const { width, height } = viewportRef.current;

      const responsive = getResponsiveValues(width, height);
      const ease = ANIMATION_CONSTANTS.EASE;

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

      const { evenRefs, oddRefs } = textRefs;
      const activeRefs = getTextRefs(detailsEvenRef.current, evenRefs, oddRefs);

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

      updateTextContent(activeRefs, data[activeIndex]);

      gsap.set(detailsActive, { zIndex: 22 });
      gsap.to(detailsActive, {
        opacity: 1,
        delay: ACTIVE_ANIMATION_DELAYS.DETAILS,
        ease,
      });

      animateActiveRefs(activeRefs, ease);

      gsap.set(detailsInactive, { zIndex: 12 });

      const [active, ...rest] = newOrder;
      const prv = rest[rest.length - 1];

      gsap.set(cardRefs.current[prv], { zIndex: 10 });
      gsap.set(cardRefs.current[active], { zIndex: 20 });
      gsap.to(cardRefs.current[prv], { scale: 1, ease, duration: 1 });

      gsap.to(cardContentRefs.current[active], {
        y:
          responsive.offsetTop +
          responsive.cardHeight -
          responsive.cardContentFinalY,
        opacity: 0,
        duration: 0.6,
        ease,
      });

      if (slideNumberRefs.current[active]) {
        gsap.to(slideNumberRefs.current[active], { x: 0, ease, duration: 1 });
      }

      if (slideNumberRefs.current[prv]) {
        gsap.to(slideNumberRefs.current[prv], {
          x: -responsive.numberSize,
          ease,
          duration: 1,
        });
      }

      gsap.to(progressRef.current, {
        width: responsive.progressWidth * (1 / newOrder.length) * (active + 1),
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
          if (!isMountedRef.current) {
            resolve();
            return;
          }

          const xNew =
            responsive.offsetLeft +
            (rest.length - 1) * (responsive.cardWidth + responsive.gap);

          gsap.set(cardRefs.current[prv], {
            x: xNew,
            y: responsive.offsetTop,
            width: responsive.cardWidth,
            height: responsive.cardHeight,
            zIndex: 30,
            borderRadius: 10,
            scale: 1,
          });

          gsap.set(cardContentRefs.current[prv], {
            x: xNew,
            y:
              responsive.offsetTop +
              responsive.cardHeight -
              responsive.cardContentOffset,
            opacity: 1,
            zIndex: 40,
          });

          if (slideNumberRefs.current[prv]) {
            gsap.set(slideNumberRefs.current[prv], {
              x: rest.length * responsive.numberSize,
            });
          }

          gsap.set(detailsInactive, { opacity: 0 });

          const inactiveRefs = getTextRefs(
            !detailsEvenRef.current,
            evenRefs,
            oddRefs,
          );

          resetInactiveYPositions(
            inactiveRefs,
            responsive.yOffset1,
            responsive.yOffset2,
            responsive.yOffset3,
          );

          if (detailsActive) {
            gsap.set(detailsActive, { height: "auto" });
          }

          setIsAnimating(false);
          resolve();
        },
      });

      rest.forEach((i, index) => {
        if (i !== prv) {
          const xNew =
            responsive.offsetLeft +
            index * (responsive.cardWidth + responsive.gap);

          gsap.set(cardRefs.current[i], { zIndex: 30 });
          gsap.to(cardRefs.current[i], {
            x: xNew,
            y: responsive.offsetTop,
            width: responsive.cardWidth,
            height: responsive.cardHeight,
            ease,
            delay: 0.1 * (index + 1),
            duration: 1,
          });

          gsap.to(cardContentRefs.current[i], {
            x: xNew,
            y:
              responsive.offsetTop +
              responsive.cardHeight -
              responsive.cardContentOffset,
            opacity: 1,
            zIndex: 40,
            ease,
            delay: 0.1 * (index + 1),
            duration: 0.6,
          });

          if (slideNumberRefs.current[i]) {
            gsap.to(slideNumberRefs.current[i], {
              x: (index + 1) * responsive.numberSize,
              ease,
              duration: 1,
            });
          }
        }
      });
    });
  };

  // Función encargada de hacer el loop automático de los slides
  const loop = async (): Promise<void> => {
    if (isAnimating || !isMountedRef.current) return;

    const { innerWidth: width } = window;

    await new Promise((resolve) => {
      gsap.to(indicatorRef.current, {
        x: 0,
        duration: ANIMATION_CONSTANTS.INDICATOR_DURATION,
        onComplete: resolve,
      });
    });

    if (!isMountedRef.current) return;

    await new Promise((resolve) => {
      gsap.to(indicatorRef.current, {
        x: width,
        duration: ANIMATION_CONSTANTS.INDICATOR_EXIT_DURATION,
        delay: ANIMATION_CONSTANTS.INDICATOR_EXIT_DELAY,
        onComplete: resolve,
      });
    });

    if (!isMountedRef.current) return;

    gsap.set(indicatorRef.current, { x: -width });

    await step();

    if (!isMountedRef.current) return;

    loopTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        loop();
      }
    }, ANIMATION_CONSTANTS.STEP_TIMEOUT);
  };

  // SSR Guard
  if (!data || data.length === 0) {
    return <HeroSlidesSkeleton />;
  }

  return (
    <>
      {!initialized && <HeroSlidesSkeleton />}

      <div
        ref={containerRef}
        className="hero-page  relative inset-0 w-screen h-screen text-white overflow-hidden"
        style={{
          width: "100vw",
          height: "100vh",
          maxWidth: "100vw",
          maxHeight: "100svh",
          opacity: initialized ? 1 : 0, //  invisible hasta que GSAP esté listo
          transition: "opacity 0.3s ease", // fade al pintarse
        }}
      >
        {/* Mapa del mundo loader */}
        {clientReady && showMap && (
          <div
            className="
      worldmap-container
      fixed inset-0
      z-50
      
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
              className="absolute inset-0 w-full h-full bg-center bg-cover "
              style={{ backgroundImage: `url(${item.image})` }}
            >
              {/* <div className="w-2/3 absolute inset-0 rounded-lg bg-linear-to-t from-black/50 via-black/30 to-transparent" /> */}
              <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-black/50 to-transparent rounded-l-lg" />
              <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-black/70 to-transparent rounded-b-lg" />
            </div>

            <div
              ref={(el) => {
                cardContentRefs.current[index] = el;
              }}
              className="absolute left-0 -top-8 lg:-top-6 text-white pl-2 md:pl-4 bg-red-700500"
            >
              <div className="w-8 h-0.5 sm:w-6 sm:h-0.5 md:w-8 md:h-1 rounded-full bg-white [box-shadow:2px_2px_3px_#000000]" />
              <div className="mt-1 text-xs font-medium [text-shadow:2px_2px_3px_#000000]">
                {item.place}
              </div>
              <div className="mt-1 text-xs font-medium [text-shadow:2px_2px_3px_#000000]">
                {item.country}
              </div>
              <div className="font-semibold text-[10px] sm:text-sm md:text-xl [text-shadow:2px_2px_3px_#000000]">
                {item.title}
              </div>
              <div className="font-semibold text-[10px] sm:text-sm md:text-xl [text-shadow:2px_2px_3px_#000000]">
                {item.title2}
              </div>
            </div>
          </Fragment>
        ))}

        {/* Images hero even */}
        <div
          ref={detailsEvenElementRef}
          className=" absolute left-3 sm:left-4 md:left-15 top-50 sm:top-24 md:top-20 z-20 max-w-xs md:max-w-none py-4"
        >
          <div className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-4 h-0.5 sm:w-6 sm:h-0.5 md:w-8 md:h-1 bg-white [box-shadow:2px_2px_3px_#000000] rounded-full" />
            <div
              ref={placeTextEvenRef}
              className="pt-2 text-sm md:text-xl [text-shadow:2px_2px_3px_#000000]"
            >
              {data[0]?.place}
            </div>
            <div
              ref={countryTextEvenRef}
              className="pb-2 text-sm md:text-xl [text-shadow:2px_2px_3px_#000000]"
            >
              {data[0]?.country}
            </div>
          </div>
          <div className="mb-1 overflow-hidden">
            <div
              ref={title1EvenRef}
              className="text-3xl sm:text-4xl md:text-7xl font-semibold [text-shadow:2px_2px_3px_#000000]"
            >
              {" "}
              {data[0]?.title}
            </div>
            <div
              ref={title2EvenRef}
              className="text-3xl sm:text-4xl md:text-7xl font-semibold leading-tight [text-shadow:2px_2px_3px_#000000]"
            >
              {" "}
              {data[0]?.title2}
            </div>
          </div>
          <div
            ref={descEvenRef}
            className=" mt-2 w-full sm:w-80 md:w-140 text-xs sm:text-sm md:text-base md:text-justify [text-shadow:2px_2px_3px_#000000]"
          >
            {" "}
            {data[0]?.description}
          </div>

          <div
            ref={ctaEvenRef}
            className="relative pt-4 w-full flex items-center"
          >
            <ButtonGlower
              href={`/${locale}${locale === "es" ? "/destinos" : "/destinations"}`}
            >
              {locale === "es" ? "Ver más" : "See more"}{" "}
            </ButtonGlower>
          </div>
        </div>

        {/* Images hero odd */}
        <div
          ref={detailsOddElementRef}
          className=" absolute left-3 sm:left-4 md:left-15 top-50 sm:top-24 md:top-20 z-20 max-w-xs md:max-w-none py-4"
        >
          <div className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-4 h-0.5 sm:w-6 sm:h-0.5 md:w-8 md:h-1 [box-shadow:2px_2px_3px_#000000] bg-white rounded-full" />
            <div
              ref={placeTextOddRef}
              className="pt-2 text-sm md:text-xl [text-shadow:2px_2px_3px_#000000]"
            >
              {data[0]?.place}
            </div>
            <div
              ref={countryTextOddRef}
              className="pb-2 text-sm md:text-xl [text-shadow:2px_2px_3px_#000000]"
            >
              {data[0]?.country}
            </div>
          </div>
          <div className="mb-1 overflow-hidden">
            <div
              ref={title1OddRef}
              className="text-3xl sm:text-4xl md:text-7xl font-semibold [text-shadow:2px_2px_3px_#000000]"
            >
              {" "}
              {data[0]?.title}
            </div>
            <div
              ref={title2OddRef}
              className="text-3xl sm:text-4xl md:text-7xl font-semibold leading-tight [text-shadow:2px_2px_3px_#000000]"
            >
              {" "}
              {data[0]?.title2}
            </div>
          </div>
          <div
            ref={descOddRef}
            className=" mt-2 w-full sm:w-80 md:w-140 text-xs sm:text-sm md:text-base md:text-justify [text-shadow:2px_2px_3px_#000000]"
          >
            {" "}
            {data[0]?.description}
          </div>

          <div
            ref={ctaOddRef}
            className="relative pt-4 w-full flex items-center"
          >
            <ButtonGlower
              href={`/${locale}${locale === "es" ? "/destinos" : "/destinations"}`}
            >
              {locale === "es" ? "Ver más" : "See more"}{" "}
            </ButtonGlower>
          </div>
        </div>

        {/* Hidden elements for GSAP references */}
        <nav ref={navRef} className="opacity-0" />

        <div
          ref={coverRef}
          className="absolute top-0 left-0 w-full h-full bg-transparent z-50"
        />
      </div>
    </>
  );
};

export default HeroSlides;
