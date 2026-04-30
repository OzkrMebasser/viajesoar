"use client";
// React & Libraries
import React, { useState, useEffect, useRef, Fragment } from "react";
import { gsap } from "gsap";

// Components
import WorldMapLoader from "@/components/WorldMapLoader";
import HeroSlidesSkeleton from "./HeroSlidesSkeleton";
import HeroSearch from "./HeroSearch";

// Hooks
import { useFadeOutMap } from "@/lib/hooks/useFadeOutMap";
import { useHeroRefs } from "@/lib/hooks/useHeroRefs";
import { useHeroSearch } from "@/lib/hooks/useSearch";

// Types
import type { Locale } from "@/types/locale";
import type { SlideshowDestination } from "@/types/heroDestinations";
import type { SearchLocale } from "@/types/search";

// Helpers & Constants
import {
  getResponsiveValues,
  getTextRefs,
  updateTextContent,
  resetInactiveYPositions,
  animateActiveRefs,
} from "./helpers";
import { ANIMATION_CONSTANTS, ACTIVE_ANIMATION_DELAYS } from "./constants";

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  locale: Locale;
  data: SlideshowDestination[];
}

// ─── HeroSlidesSearch ─────────────────────────────────────────────────────────
const HeroSlidesSearch = ({ locale, data }: Props) => {
  // States
  const [clientReady, setClientReady] = useState(false);
  const [order, setOrder] = useState<number[]>([]);
  const [detailsEven, setDetailsEven] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  // ── Estado del buscador elevado aquí — sobrevive cambios de slide ──────────
  const { searchQuery, searchResults, isSearching, setSearchQuery } =
    useHeroSearch(locale as SearchLocale);

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

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.resolve().then(() => {
        if (isMountedRef.current) setClientReady(true);
      });
    }
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

  useEffect(() => {
    if (
      !containerRef.current ||
      data.length === 0 ||
      order.length === 0 ||
      !clientReady
    )
      return;

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
      if (checkInterval) clearInterval(checkInterval);
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
        loopTimeoutRef.current = null;
      }
      gsap.killTweensOf("*");
      setIsAnimating(false);
      setInitialized(false);
    };
  }, [data.length, order.length, clientReady]);

  const showMap = useFadeOutMap({
    selector: ".worldmap-container",
    trigger: data.length > 0,
    delay: 2000,
    duration: 3,
  });

  // ── Destino activo ────────────────────────────────────────────────────────
  const activeDestination = data[order[0]] ?? data[0];

  // ── Props compartidas entre EVEN y ODD ───────────────────────────────────
  const sharedSearchProps = {
    searchQuery,
    searchResults,
    isSearching,
    onQueryChange: setSearchQuery,
  };

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
    const firstData = data[active];

    const { evenRefs, oddRefs } = textRefs;
    const initialRefs = getTextRefs(detailsEvenRef.current, evenRefs, oddRefs);
    if (firstData) updateTextContent(initialRefs, firstData);

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

    gsap.set(navRef.current, { y: responsive.navOffset, opacity: 0 });

    gsap.set(cardRefs.current[active], { x: 0, y: 0, width, height });
    gsap.set(cardContentRefs.current[active], { x: 0, y: 0, opacity: 0 });
    // gsap.set(detailsActive, {
    //   opacity: 0,
    //   zIndex: 22,
    //   x: responsive.detailsXOffset,
    // });
    // gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
    gsap.set(detailsActive, {
      opacity: 0,
      zIndex: 100, // antes: 22
      x: responsive.detailsXOffset,
    });
    gsap.set(detailsInactive, { opacity: 0, zIndex: 90 });

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
            if (isMountedRef.current) loop();
          }, ANIMATION_CONSTANTS.LOOP_TIMEOUT);
        }
      },
    });

    rest.forEach((i, index) => {
      const x =
        responsive.offsetLeft + index * (responsive.cardWidth + responsive.gap);
      const delay = ANIMATION_CONSTANTS.START_DELAY + 0.05 * index;
      gsap.to(cardRefs.current[i], { x, zIndex: 30, delay, ease });
      gsap.to(cardContentRefs.current[i], { x, zIndex: 30, delay, ease });
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

  const step = (direction: "next" | "prev" = "next"): Promise<void> => {
    return new Promise((resolve) => {
      if (isAnimating || !isMountedRef.current) {
        resolve();
        return;
      }

      const currentDetails = detailsEvenRef.current
        ? detailsEvenElementRef.current
        : detailsOddElementRef.current;
      if (currentDetails)
        gsap.set(currentDetails, { height: currentDetails.offsetHeight });

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
        console.error(`Data at index ${activeIndex} is undefined.`, newOrder);
        setIsAnimating(false);
        resolve();
        return;
      }

      updateTextContent(activeRefs, data[activeIndex]);

      gsap.set(detailsActive, { zIndex: 100 });
      gsap.to(detailsActive, {
        opacity: 1,
        delay: ACTIVE_ANIMATION_DELAYS.DETAILS,
        ease,
      });

      animateActiveRefs(activeRefs, ease);

      gsap.set(detailsInactive, { zIndex: 90 });

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

      if (slideNumberRefs.current[active])
        gsap.to(slideNumberRefs.current[active], { x: 0, ease, duration: 1 });
      if (slideNumberRefs.current[prv])
        gsap.to(slideNumberRefs.current[prv], {
          x: -responsive.numberSize,
          ease,
          duration: 1,
        });

      gsap.to(progressRef.current, {
        width: responsive.progressWidth * (1 / newOrder.length) * (active + 1),
        ease,
        duration: 1,
      });

      gsap.to(cardRefs.current[active], {
        x: 0,
        y: 0,
        ease,
        width,
        height,
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

          if (detailsActive) gsap.set(detailsActive, { height: "auto" });

          setIsAnimating(false);
          resolve();
        },
      });

      rest.forEach((i, index) => {
        if (i === prv) return;
        const xNew =
          responsive.offsetLeft +
          index * (responsive.cardWidth + responsive.gap);
        const delay = 0.1 * (index + 1);

        gsap.set(cardRefs.current[i], { zIndex: 30 });
        gsap.to(cardRefs.current[i], {
          x: xNew,
          y: responsive.offsetTop,
          width: responsive.cardWidth,
          height: responsive.cardHeight,
          ease,
          delay,
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
          delay,
          duration: 0.6,
        });
        if (slideNumberRefs.current[i]) {
          gsap.to(slideNumberRefs.current[i], {
            x: (index + 1) * responsive.numberSize,
            ease,
            duration: 1,
          });
        }
      });
    });
  };

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
      if (isMountedRef.current) loop();
    }, ANIMATION_CONSTANTS.STEP_TIMEOUT);
  };

  // SSR Guard
  if (!data || data.length === 0) return <HeroSlidesSkeleton />;

  return (
    <>
      {!initialized && <HeroSlidesSkeleton />}

      <div
        ref={containerRef}
        className="hero-page relative inset-0 w-screen h-screen text-white overflow-hidden"
        style={{
          width: "100vw",
          height: "100vh",
          maxWidth: "100vw",
          maxHeight: "100svh",
          opacity: initialized ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {/* Mapa del mundo loader */}
        {clientReady && showMap && (
          <div className="worldmap-container fixed inset-0 z-50 pointer-events-none will-change-opacity">
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
              className="absolute inset-0 w-full h-full bg-center bg-cover"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="w-full absolute inset-0 rounded-lg bg-linear-35 from-black/70 via-black/10 to-transparent" />
            </div>

            <div
              ref={(el) => {
                cardContentRefs.current[index] = el;
              }}
              className="absolute left-0 -top-8 lg:-top-6 text-white pl-2 md:pl-4"
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

        {/* ── Hero details EVEN ── */}

        <div
          ref={detailsEvenElementRef}
          className="absolute left-0 right-0 md:right-auto md:left-15 top-[28%] sm:top-[22%] md:top-[20%] z-[100] px-4 md:px-0 py-4"
        >
          <span ref={placeTextEvenRef} className="hidden" />
          <span ref={countryTextEvenRef} className="hidden" />
          <span ref={title1EvenRef} className="hidden" />
          <span ref={title2EvenRef} className="hidden" />
          <span ref={descEvenRef} className="hidden" />
          <span ref={ctaEvenRef} className="hidden" />

          <HeroSearch locale={locale} {...sharedSearchProps} />
        </div>

        {/* ── Hero details ODD ── */}
        <div
          ref={detailsOddElementRef}
          className="absolute left-0 right-0 md:right-auto md:left-15 top-[28%] sm:top-[22%] md:top-[20%] z-[100] px-4 md:px-0 py-4"
        >
          <span ref={placeTextOddRef} className="hidden" />
          <span ref={countryTextOddRef} className="hidden" />
          <span ref={title1OddRef} className="hidden" />
          <span ref={title2OddRef} className="hidden" />
          <span ref={descOddRef} className="hidden" />
          <span ref={ctaOddRef} className="hidden" />

          <HeroSearch locale={locale} {...sharedSearchProps} />
        </div>

        {/* ── Título imagen activa — esquina inferior izquierda ── */}
        {activeDestination && (
          <div className="absolute bottom-10 left-4 md:left-16 z-20 text-white pointer-events-none">
            <div className="w-8 h-0.5 sm:w-6 sm:h-0.5 md:w-10 md:h-1 rounded-full bg-white mb-1 [box-shadow:2px_2px_3px_#000000]" />
            <div className="text-sm font-medium [text-shadow:2px_2px_3px_#000000]">
              {activeDestination.place}
            </div>
            <div className="text-sm font-medium [text-shadow:2px_2px_3px_#000000]">
              {activeDestination.country}
            </div>
            <div className="font-semibold text-sm sm:text-base md:text-2xl [text-shadow:2px_2px_3px_#000000]">
              {activeDestination.title}
            </div>
            {activeDestination.title2 && (
              <div className="font-semibold text-sm sm:text-base md:text-2xl [text-shadow:2px_2px_3px_#000000]">
                {activeDestination.title2}
              </div>
            )}
          </div>
        )}

        {/* Hidden elements for GSAP references */}
        <nav ref={navRef} className="opacity-0" />

        <div
          ref={coverRef}
          className="absolute top-0 left-0 w-full h-full bg-transparent z-50"
        />
      </div>
      <section className="sr-only" aria-label="Destinos de viaje">
        {data.map((item) => (
          <p key={item.id}>
            Viaje a {item.place}, {item.country}. {item.title}. {item.title2}.{" "}
            {item.description}
          </p>
        ))}
      </section>
    </>
  );
};

export default HeroSlidesSearch;
