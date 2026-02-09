  const step = (direction: "next" | "prev" = "next"): Promise<void> => {
    return new Promise((resolve) => {
      if (isAnimating || !isMountedRef.current) {
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
          if (!isMountedRef.current) {
            resolve();
            return;
          }

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
    if (isAnimating || !isMountedRef.current) return;

    const { innerWidth: width } = window;

    await new Promise((resolve) => {
      gsap.to(indicatorRef.current, {
        x: 0,
        duration: 3,
        onComplete: resolve,
      });
    });

    if (!isMountedRef.current) return;

    await new Promise((resolve) => {
      gsap.to(indicatorRef.current, {
        x: width,
        duration: 1.2,
        delay: 0.3,
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
    }, 100);
  };

  