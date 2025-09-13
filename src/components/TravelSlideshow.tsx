"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

import { Bookmark } from "lucide-react";

interface DestinationData {
  place: string;
  country: string;
  title: string;
  title2: string;
  description: string;
  image: string;
}

const TravelSlideshow = () => {
  const data: DestinationData[] = [
    {
      place: "Alps",
      country: "Switzerland",
      title: "SAINT",
      title2: "ANTONIEN",
      description:
        "Tucked away in the Switzerland Alps, Saint Antönien offers a serene retreat for those seeking tranquility and adventure. It's a hidden gem for backcountry skiing in winter and lush trails for hiking and biking during summer.",
      image: "https://assets.codepen.io/3685267/timed-cards-1.jpg",
    },
    {
      place: "Alps",
      country: "Japan",
      title: "NAGANO",
      title2: "PREFECTURE",
      description:
        "Nagano Prefecture, in the majestic Japan Alps, is a cultural treasure with historic shrines and temples, including Zenkō-ji. The region is also a hotspot for skiing and snowboarding, offering some of the finest powder in the country.",
      image: "https://assets.codepen.io/3685267/timed-cards-2.jpg",
    },
    {
      place: "Sahara Desert",
      country: "Morocco",
      title: "MARRAKECH",
      title2: "MERZOUGA",
      description:
        "From the vibrant souks of Marrakech to the tranquil, starlit sands of Merzouga, Morocco showcases its diverse splendor. Camel treks and desert camps offer an unforgettable immersion into the nomadic way of life across the Sahara.",
      image: "https://assets.codepen.io/3685267/timed-cards-3.jpg",
    },
    {
      place: "Sierra Nevada",
      country: "USA",
      title: "YOSEMITE",
      title2: "NATIONAL PARK",
      description:
        "Yosemite National Park is a showcase of the American wilderness, famed for towering granite monoliths, ancient sequoias, and thundering waterfalls. Visitors enjoy year-round activities, from rock climbing to serene valley walks in nature.",
      image: "https://assets.codepen.io/3685267/timed-cards-4.jpg",
    },
    {
      place: "Tarifa",
      country: "Spain",
      title: "LOS LANCES",
      title2: "BEACH",
      description:
        "Los Lances Beach in Tarifa is a coastal paradise with consistent winds, making it famous for kitesurfing and windsurfing. Its long sandy shores provide ample space for relaxation and sunbathing, with a lively atmosphere of beach bars and cafes.",
      image: "https://assets.codepen.io/3685267/timed-cards-5.jpg",
    },
    {
      place: "Cappadocia",
      country: "Turkey",
      title: "GÖREME",
      title2: "VALLEY",
      description:
        "Göreme Valley in Cappadocia is a historical marvel against a unique geological backdrop, sculpted by centuries of wind and water. The valley is famous for open-air museums, underground cities, and the enchanting experience of hot air ballooning.",
      image: "https://assets.codepen.io/3685267/timed-cards-6.jpg",
    },
    {
      place: "Patagonia",
      country: "Argentina",
      title: "LOS GLACIARES",
      title2: "NATIONAL PARK",
      description:
        "Los Glaciares National Park in Patagonia is a breathtaking expanse of rugged mountains, turquoise lakes, and massive glaciers, including the iconic Perito Moreno. It's a paradise for trekkers and nature lovers seeking pristine wilderness.",
      image:
        "https://images.pexels.com/photos/2516401/pexels-photo-2516401.jpeg",
    },
    {
      place: "Santorini",
      country: "Greece",
      title: "OIA",
      title2: "VILLAGE",
      description:
        "Oia Village in Santorini is famed for its whitewashed buildings with blue domes, stunning sunsets, and panoramic views of the Aegean Sea. It's perfect for romantic getaways and exploring the charming Cycladic architecture of the island.",
      image:
        "https://images.pexels.com/photos/163864/santorini-oia-greece-travel-163864.jpeg",
    },
  ];

  const [order, setOrder] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7]);
  const [detailsEven, setDetailsEven] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const orderRef = useRef<number[]>([0, 1, 2, 3, 4, 5, 6, 7]);
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

  useEffect(() => {
    orderRef.current = order;
  }, [order]);

  useEffect(() => {
    detailsEvenRef.current = detailsEven;
  }, [detailsEven]);

  useEffect(() => {
    // initialize immediately since gsap is imported
    initializeAnimations();

    return () => {
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
    };
  }, []);

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
        
    const cardWidth = isSmallMobile 
      ? 90 
      : isMobile 
        ? 120 
        : 200;
        
    const cardHeight = isSmallMobile 
      ? 140 
      : isMobile 
        ? 180 
        : 300;
        
    const gap = isSmallMobile 
      ? 15 
      : isMobile 
        ? 20 
        : 40;
        
    const numberSize = isSmallMobile 
      ? 25 
      : isMobile 
        ? 30 
        : 50;
        
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

    gsap.set(navRef.current, { y: isSmallMobile ? -80 : isMobile ? -100 : -200, opacity: 0 });

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
      const cardX = offsetLeft + (isSmallMobile ? 150 : isMobile ? 200 : 400) + index * (cardWidth + gap);
      
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

    gsap.to(coverRef.current, {
      x: width + coverXOffset,
      delay: 0.5,
      ease,
      onComplete: () => {
        loopTimeoutRef.current = setTimeout(() => {
          loop();
        }, 500);
      },
    });

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
    gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
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
          
      const cardWidth = isSmallMobile 
        ? 90 
        : isMobile 
          ? 120 
          : 200;
          
      const cardHeight = isSmallMobile 
        ? 140 
        : isMobile 
          ? 180 
          : 300;
          
      const gap = isSmallMobile 
        ? 15 
        : isMobile 
          ? 20 
          : 40;
          
      const numberSize = isSmallMobile 
        ? 25 
        : isMobile 
          ? 30 
          : 50;
          
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
          newOrder
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
            y: offsetTop + cardHeight - (isSmallMobile ? 50 : isMobile ? 60 : 100),
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
            y: offsetTop + cardHeight - (isSmallMobile ? 50 : isMobile ? 60 : 100),
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

  // const handleNext = (): void => {
  //   if (!isAnimating) {
  //     if (loopTimeoutRef.current) {
  //       clearTimeout(loopTimeoutRef.current);
  //     }
  //     step("next").then(() => {
  //       loopTimeoutRef.current = setTimeout(() => {
  //         loop();
  //       }, 4000);
  //     });
  //   }
  // };

  // const handlePrev = (): void => {
  //   if (!isAnimating) {
  //     if (loopTimeoutRef.current) {
  //       clearTimeout(loopTimeoutRef.current);
  //     }
  //     step("prev").then(() => {
  //       loopTimeoutRef.current = setTimeout(() => {
  //         loop();
  //       }, 4000);
  //     });
  //   }
  // };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-gray-900 text-white overflow-hidden"
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@500&display=swap"
        rel="stylesheet"
      />
      {/* Images cards */}
      {data.map((item, index) => (
        <div key={index}>
          <div
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="absolute left-0 top-0 bg-center bg-cover shadow-2xl"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            {/* Overlay negro transparente */}
            <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
          </div>
          <div
            ref={(el) => {
              cardContentRefs.current[index] = el;
            }}
            className="absolute left-0 -top-8 text-white pl-2 md:pl-4"
          >
            <div className="w-4 h-0.5 sm:w-6 sm:h-0.5 md:w-8 md:h-1 rounded-full bg-white" />
            <div className="mt-1 text-xs font-medium">{item.place}</div>
            <div className="mt-1 text-xs font-medium">{item.country}</div>
            <div
              className="font-semibold text-xs sm:text-sm md:text-xl"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              {item.title}
            </div>
            <div
              className="font-semibold text-xs sm:text-sm md:text-xl"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              {item.title2}
            </div>
          </div>
        </div>
      ))}

      {/* Images hero even */}
      <div
        ref={detailsEvenElementRef}
        className="absolute left-3 sm:left-4 md:left-15 top-20 sm:top-24 md:top-[9rem] z-20 max-w-xs md:max-w-none py-4"
      >
        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-4 h-0.5 sm:w-6 sm:h-0.5 md:w-8 md:h-1 bg-white rounded-full" />
          <div ref={placeTextEvenRef} className="pt-2 text-xs sm:text-sm md:text-xl">
            {data[order[0]]?.place}
          </div>
          <div ref={countryTextOddRef} className="pb-2 text-xs sm:text-sm md:text-xl">
            {data[order[0]]?.country}
          </div>
        </div>
        <div className="mb-1 overflow-hidden">
          <div
            ref={title1EvenRef}
            className="text-2xl sm:text-4xl md:text-7xl font-semibold"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            {data[order[0]]?.title}
          </div>
        </div>
        <div className="mb-2 md:mb-4 h-12 sm:h-16 md:h-25 overflow-hidden">
          <div
            ref={title2EvenRef}
            className="text-2xl sm:text-4xl md:text-7xl font-semibold leading-tight"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            {data[order[0]]?.title2}
          </div>
        </div>
        <div
          ref={descEvenRef}
          className="mt-2 w-full sm:w-80 md:w-[35rem] text-xs sm:text-sm md:text-base md:text-justify"
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
        className="absolute left-3 sm:left-4 md:left-15 top-20 sm:top-24 md:top-[9rem] z-20 max-w-xs md:max-w-none py-4"
      >
        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-4 h-0.5 sm:w-6 sm:h-0.5 md:w-8 md:h-1 bg-white rounded-full" />
          <div ref={placeTextOddRef} className="pt-2 text-xs sm:text-sm md:text-xl">
            {data[order[0]]?.place}
          </div>
          <div ref={countryTextOddRef} className="pb-2 text-xs sm:text-sm md:text-xl">
            {data[order[0]]?.country}
          </div>
        </div>
        <div className="mb-1 overflow-hidden">
          <div
            ref={title1OddRef}
            className="text-2xl sm:text-4xl md:text-7xl font-semibold"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            {data[order[0]]?.title}
          </div>
        </div>
        <div className="mb-2 md:mb-4 h-12 sm:h-16 md:h-25 overflow-hidden">
          <div
            ref={title2OddRef}
            className="text-2xl sm:text-4xl md:text-7xl font-semibold leading-tight"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            {data[order[0]]?.title2}
          </div>
        </div>
        <div
          ref={descOddRef}
          className="mt-2 w-full sm:w-80 md:w-[35rem] text-xs sm:text-sm md:text-base md:text-justify"
        >
          {data[order[0]]?.description}
        </div>
        <div
          ref={ctaOddRef}
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

      {/* Navigation buttons */}
      {/* <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex gap-2">
        <button
          onClick={handlePrev}
          className="bg-white/20 backdrop-blur-sm border border-white/30 w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white flex items-center justify-center hover:bg-white/30 transition-all duration-200"
          disabled={isAnimating}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="bg-white/20 backdrop-blur-sm border border-white/30 w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white flex items-center justify-center hover:bg-white/30 transition-all duration-200"
          disabled={isAnimating}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div> */}

      {/* Progress indicator */}
      {/* <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-30">
        <div className="bg-white/20 backdrop-blur-sm rounded-full h-1 w-32 sm:w-40 md:w-60 overflow-hidden">
          <div
            ref={progressRef}
            className="bg-white h-full rounded-full transition-all duration-1000 ease-out"
          />
        </div>
        <div className="mt-2 text-xs text-white/80">
          {order[0] + 1} / {data.length}
        </div>
      </div> */}

      {/* Hidden elements for GSAP references */}
      {/* <div ref={indicatorRef} className="absolute top-0 left-0 w-1 h-full bg-white/50 z-40" />
      <nav ref={navRef} className="opacity-0" />
      <div ref={paginationRef} className="opacity-0" />
      <div ref={coverRef} className="absolute top-0 left-0 w-full h-full bg-gray-900 z-50" /> */}
    </div>
  );
};

export default TravelSlideshow;