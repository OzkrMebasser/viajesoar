
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Globe,
  Search,
  User,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DestinationData {
  place: string;
  title: string;
  title2: string;
  description: string;
  image: string;
}

declare global {
  interface Window {
    gsap: any;
  }
}

const TravelSlideshow = () => {
  const data: DestinationData[] = [
    {
      place: "Switzerland Alps",
      title: "SAINT",
      title2: "ANTONIEN",
      description:
        "Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It's a hidden gem for backcountry skiing in winter and boasts lush trails for hiking and mountain biking during the warmer months.",
      image: "https://assets.codepen.io/3685267/timed-cards-1.jpg",
    },
    {
      place: "Japan Alps",
      title: "NAGANO",
      title2: "PREFECTURE",
      description:
        "Nagano Prefecture, set within the majestic Japan Alps, is a cultural treasure trove with its historic shrines and temples, particularly the famous Zenkō-ji. The region is also a hotspot for skiing and snowboarding, offering some of the country's best powder.",
      image: "https://assets.codepen.io/3685267/timed-cards-2.jpg",
    },
    {
      place: "Sahara Desert - Morocco",
      title: "MARRAKECH",
      title2: "MERZOUGA",
      description:
        "The journey from the vibrant souks and palaces of Marrakech to the tranquil, starlit sands of Merzouga showcases the diverse splendor of Morocco. Camel treks and desert camps offer an unforgettable immersion into the nomadic way of life.",
      image: "https://assets.codepen.io/3685267/timed-cards-3.jpg",
    },
    {
      place: "Sierra Nevada - USA",
      title: "YOSEMITE",
      title2: "NATIONAL PARK",
      description:
        "Yosemite National Park is a showcase of the American wilderness, revered for its towering granite monoliths, ancient giant sequoias, and thundering waterfalls. The park offers year-round recreational activities, from rock climbing to serene valley walks.",
      image: "https://assets.codepen.io/3685267/timed-cards-4.jpg",
    },
    {
      place: "Tarifa - Spain",
      title: "LOS LANCES",
      title2: "BEACH",
      description:
        "Los Lances Beach in Tarifa is a coastal paradise known for its consistent winds, making it a world-renowned spot for kitesurfing and windsurfing. The beach's long, sandy shores provide ample space for relaxation and sunbathing, with a vibrant atmosphere of beach bars and cafes.",
      image: "https://assets.codepen.io/3685267/timed-cards-5.jpg",
    },
    {
      place: "Cappadocia - Turkey",
      title: "GÖREME",
      title2: "VALLEY",
      description:
        "Göreme Valley in Cappadocia is a historical marvel set against a unique geological backdrop, where centuries of wind and water have sculpted the landscape into whimsical formations. The valley is also famous for its open-air museums, underground cities, and the enchanting experience of hot air ballooning.",
      image: "https://assets.codepen.io/3685267/timed-cards-6.jpg",
    },
    {
      place: "Patagonia - Argentina",
      title: "LOS GLACIARES",
      title2: "NATIONAL PARK",
      description:
        "Los Glaciares National Park in Patagonia is a breathtaking expanse of rugged mountains, turquoise lakes, and massive glaciers, including the iconic Perito Moreno. It's a haven for trekkers and nature lovers seeking untouched wilderness.",
      image: "https://images.pexels.com/photos/2516401/pexels-photo-2516401.jpeg",
    },
    {
      place: "Santorini - Greece",
      title: "OIA",
      title2: "VILLAGE",
      description:
        "Oia Village in Santorini is famed for its whitewashed buildings with blue domes, stunning sunsets, and panoramic views of the Aegean Sea. It's a perfect destination for romantic getaways and exploring charming Cycladic architecture.",
      image: "https://images.pexels.com/photos/163864/santorini-oia-greece-travel-163864.jpeg",
    },
  ];

  const [order, setOrder] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7]);
  const [detailsEven, setDetailsEven] = useState<boolean>(true);
  const [gsapLoaded, setGsapLoaded] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

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
  const title1EvenRef = useRef<HTMLDivElement>(null);
  const title2EvenRef = useRef<HTMLDivElement>(null);
  const descEvenRef = useRef<HTMLDivElement>(null);
  const ctaEvenRef = useRef<HTMLDivElement>(null);
  const placeTextOddRef = useRef<HTMLDivElement>(null);
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
    if (typeof window !== "undefined" && !window.gsap) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
      script.async = true;
      script.onload = () => {
        setGsapLoaded(true);
      };
      document.head.appendChild(script);
    } else if (window.gsap) {
      setGsapLoaded(true);
    }

    return () => {
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
      const existingScript = document.querySelector('script[src*="gsap"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (gsapLoaded && window.gsap) {
      initializeAnimations();
    }
  }, [gsapLoaded]);

  const initializeAnimations = (): void => {
    const gsap = window.gsap;
    const { innerHeight: height, innerWidth: width } = window;
    const offsetTop = height - 430;
    const offsetLeft = width - 830;
    const cardWidth = 200;
    const cardHeight = 300;
    const gap = 40;
    const numberSize = 50;
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
      top: offsetTop + 330,
      left: offsetLeft,
      y: 200,
      opacity: 0,
      zIndex: 60,
    });

    gsap.set(navRef.current, { y: -200, opacity: 0 });

    gsap.set(cardRefs.current[active], {
      x: 0,
      y: 0,
      width: width,
      height: height,
    });

    gsap.set(cardContentRefs.current[active], { x: 0, y: 0, opacity: 0 });
    gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
    gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });

    const inactiveRefs = detailsEvenRef.current
      ? [placeTextOddRef, title1OddRef, title2OddRef, descOddRef, ctaOddRef]
      : [
          placeTextEvenRef,
          title1EvenRef,
          title2EvenRef,
          descEvenRef,
          ctaEvenRef,
        ];

    gsap.set(inactiveRefs[0].current, { y: 100 });
    gsap.set(inactiveRefs[1].current, { y: 100 });
    gsap.set(inactiveRefs[2].current, { y: 100 });
    gsap.set(inactiveRefs[3].current, { y: 50 });
    gsap.set(inactiveRefs[4].current, { y: 60 });

    gsap.set(progressRef.current, {
      width: 500 * (1 / currentOrder.length) * (active + 1),
    });

    rest.forEach((i, index) => {
      gsap.set(cardRefs.current[i], {
        x: offsetLeft + 400 + index * (cardWidth + gap),
        y: offsetTop,
        width: cardWidth,
        height: cardHeight,
        zIndex: 30,
        borderRadius: 10,
      });

      gsap.set(cardContentRefs.current[i], {
        x: offsetLeft + 400 + index * (cardWidth + gap),
        zIndex: 40,
        y: offsetTop + cardHeight - 100,
      });

      if (slideNumberRefs.current[i]) {
        gsap.set(slideNumberRefs.current[i], { x: (index + 1) * numberSize });
      }
    });

    gsap.set(indicatorRef.current, { x: -width });

    const startDelay = 0.6;

    gsap.to(coverRef.current, {
      x: width + 400,
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
        zIndex: 40,
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

      const gsap = window.gsap;
      const { innerHeight: height, innerWidth: width } = window;
      const offsetTop = height - 430;
      const offsetLeft = width - 830;
      const cardWidth = 200;
      const cardHeight = 300;
      const gap = 40;
      const numberSize = 50;
      const ease = "sine.inOut";

      const currentOrder = [...orderRef.current];
      let newOrder: number[];
      if (direction === "next") {
        const shiftedItem = currentOrder.shift();
        newOrder = shiftedItem !== undefined ? [...currentOrder, shiftedItem] : currentOrder;
      } else {
        const poppedItem = currentOrder.pop();
        newOrder = poppedItem !== undefined ? [poppedItem, ...currentOrder] : currentOrder;
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
            title1EvenRef,
            title2EvenRef,
            descEvenRef,
            ctaEvenRef,
          ]
        : [placeTextOddRef, title1OddRef, title2OddRef, descOddRef, ctaOddRef];

      // Safeguard against undefined data
      const activeIndex = newOrder[0];
      if (!data[activeIndex]) {
        console.error(`Data at index ${activeIndex} is undefined. Current order:`, newOrder);
        setIsAnimating(false);
        resolve();
        return;
      }

      if (activeRefs[0].current)
        activeRefs[0].current.textContent = data[activeIndex].place;
      if (activeRefs[1].current)
        activeRefs[1].current.textContent = data[activeIndex].title;
      if (activeRefs[2].current)
        activeRefs[2].current.textContent = data[activeIndex].title2;
      if (activeRefs[3].current)
        activeRefs[3].current.textContent = data[activeIndex].description;

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

      gsap.set(detailsInactive, { zIndex: 12 });

      const [active, ...rest] = newOrder;
      const prv = rest[rest.length - 1];

      gsap.set(cardRefs.current[prv], { zIndex: 10 });
      gsap.set(cardRefs.current[active], { zIndex: 20 });
      gsap.to(cardRefs.current[prv], { scale: 1.5, ease, duration: 1 });

      gsap.to(cardContentRefs.current[active], {
        y: offsetTop + cardHeight - 10,
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

      gsap.to(progressRef.current, {
        width: 500 * (1 / newOrder.length) * (active + 1),
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
            y: offsetTop + cardHeight - 100,
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
                title1OddRef,
                title2OddRef,
                descOddRef,
                ctaOddRef,
              ]
            : [
                placeTextEvenRef,
                title1EvenRef,
                title2EvenRef,
                descEvenRef,
                ctaEvenRef,
              ];

          gsap.set(inactiveRefs[0].current, { y: 100 });
          gsap.set(inactiveRefs[1].current, { y: 100 });
          gsap.set(inactiveRefs[2].current, { y: 100 });
          gsap.set(inactiveRefs[3].current, { y: 50 });
          gsap.set(inactiveRefs[4].current, { y: 60 });

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
            y: offsetTop + cardHeight - 100,
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

    const gsap = window.gsap;
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

  const handleNext = (): void => {
    if (!isAnimating) {
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
      step("next").then(() => {
        loopTimeoutRef.current = setTimeout(() => {
          loop();
        }, 4000);
      });
    }
  };

  const handlePrev = (): void => {
    if (!isAnimating) {
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
      step("prev").then(() => {
        loopTimeoutRef.current = setTimeout(() => {
          loop();
        }, 4000);
      });
    }
  };

  if (!gsapLoaded) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-gray-900 text-white overflow-hidden"
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@500&display=swap"
        rel="stylesheet"
      />

    
      {data.map((item, index) => (
        <div key={index}>
          <div
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="absolute left-0 top-0 bg-center bg-cover shadow-2xl"
            style={{ backgroundImage: `url(${item.image})` }}
          />
          <div
            ref={(el) => {
              cardContentRefs.current[index] = el;
            }}
            className="absolute left-0 top-0 text-white pl-4"
          >
            <div className="w-8 h-1 rounded-full bg-white" />
            <div className="mt-1 text-xs font-medium">{item.place}</div>
            <div
              className="font-semibold text-xl"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              {item.title}
            </div>
            <div
              className="font-semibold text-xl"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              {item.title2}
            </div>
          </div>
        </div>
      ))}

      <div ref={detailsEvenElementRef} className="absolute left-15 top-60 z-20">
        <div className="relative mb-4 h-12 overflow-hidden">
          <div className="absolute top-0 left-0 w-8 h-1 bg-white rounded-full" />
          <div ref={placeTextEvenRef} className="pt-4 text-xl">
            {data[order[0]]?.place}
          </div>
        </div>
        <div className="mb-1 h-25 overflow-hidden">
          <div
            ref={title1EvenRef}
            className="text-7xl font-semibold"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            {data[order[0]]?.title}
          </div>
        </div>
        <div className="mb-4 h-25 overflow-hidden">
          <div
            ref={title2EvenRef}
            className="text-7xl font-semibold"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            {data[order[0]]?.title2}
          </div>
        </div>
        <div ref={descEvenRef} className="mt-4 w-125">
          {data[order[0]]?.description}
        </div>
        <div ref={ctaEvenRef} className="mt-6 w-125 flex items-center">
          <button
            className="bg-yellow-500 w-9 h-9 rounded-full text-white grid place-items-center border-none"
            title="Bookmark"
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="border border-white bg-transparent h-9 rounded-full text-white px-6 text-xs ml-4 uppercase">
            Discover Location
          </button>
        </div>
      </div>

      <div ref={detailsOddElementRef} className="absolute left-15 top-60 z-20">
        <div className="relative mb-4 h-12 overflow-hidden">
          <div className="absolute top-0 left-0 w-8 h-1 bg-white rounded-full" />
          <div ref={placeTextOddRef} className="pt-4 text-xl">
            {data[order[0]]?.place}
          </div>
        </div>
        <div className="mb-1 h-25 overflow-hidden">
          <div
            ref={title1OddRef}
            className="text-7xl font-semibold"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            {data[order[0]]?.title}
          </div>
        </div>
        <div className="mb-4 h-25 overflow-hidden">
          <div
            ref={title2OddRef}
            className="text-7xl font-semibold"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            {data[order[0]]?.title2}
          </div>
        </div>
        <div ref={descOddRef} className="mt-4 w-125">
          {data[order[0]]?.description}
        </div>
        <div ref={ctaOddRef} className="mt-6 w-125 flex items-center">
          <button
            className="bg-yellow-500 w-9 h-9 rounded-full text-white grid place-items-center border-none"
            title="Bookmark"
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="border border-white bg-transparent h-9 rounded-full text-white px-6 text-xs ml-4 uppercase">
            Discover Location
          </button>
        </div>
      </div>


      <div
        ref={coverRef}
        className="absolute left-0 top-0 w-screen h-screen bg-white z-30"
      />
      
    </div>
  );
};

export default TravelSlideshow;
