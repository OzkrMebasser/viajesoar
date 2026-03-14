import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import Image from "next/image";

interface TrueFocusProps {
  sentence?: string;
  separator?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  wordColors?: string[];
  focusBackground?: string;
  focusClassName?: string;
  bgPadding?: number;
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  blurAmount = 2,
  borderColor = 'green',
  glowColor = 'rgba(0, 255, 0, 0.6)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  wordColors = [],
  focusBackground = 'none',
  focusClassName = '',
  bgPadding = 8,
}) => {
  const words = sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState<FocusRect>({ x: 0, y: 0, width: 0, height: 0 });
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (manualMode) return;

    let cancelled = false;

    const runCycle = () => {
      if (cancelled) return;

      const stepThrough = (i: number) => {
        if (cancelled) return;
        setShowAll(false);
        setCurrentIndex(i);

        if (i < words.length - 1) {
          setTimeout(() => stepThrough(i + 1), (animationDuration + pauseBetweenAnimations) * 1000);
        } else {
          setTimeout(() => {
            if (cancelled) return;
            setShowAll(true);
            setTimeout(() => {
              if (cancelled) return;
              runCycle();
            }, 1000);
          }, (animationDuration + pauseBetweenAnimations) * 1000);
        }
      };

      stepThrough(0);
    };

    runCycle();
    return () => { cancelled = true; };
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
    setIsReady(true);
  }, [currentIndex, words.length]);

  useEffect(() => {
    const measure = () => {
      if (!wordRefs.current[currentIndex] || !containerRef.current) return;
      const parentRect = containerRef.current.getBoundingClientRect();
      const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();
      if (activeRect.width === 0) return;
      setFocusRect({
        x: activeRect.left - parentRect.left,
        y: activeRect.top - parentRect.top,
        width: activeRect.width,
        height: activeRect.height,
      });
      setIsReady(true);
    };
    const raf = requestAnimationFrame(() => requestAnimationFrame(measure));
    return () => cancelAnimationFrame(raf);
  }, [currentIndex]);

  const allWordsRect = (() => {
    if (!containerRef.current || wordRefs.current.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
    const parentRect = containerRef.current.getBoundingClientRect();
    const rects = wordRefs.current
      .filter(Boolean)
      .map(el => el!.getBoundingClientRect());
    if (rects.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
    const left   = Math.min(...rects.map(r => r.left));
    const top    = Math.min(...rects.map(r => r.top));
    const right  = Math.max(...rects.map(r => r.right));
    const bottom = Math.max(...rects.map(r => r.bottom));
    return {
      x: left - parentRect.left,
      y: top - parentRect.top,
      width: right - left,
      height: bottom - top,
    };
  })();

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) setCurrentIndex(lastActiveIndex!);
  };

  const oppositeIndex = wordColors.length > 1
    ? (currentIndex + 1) % wordColors.length
    : currentIndex;
  const activeBorderColor =
    wordColors.length > 0 && wordColors[oppositeIndex]
      ? wordColors[oppositeIndex]
      : borderColor;

  const activeBackground = focusClassName
    ? undefined
    : focusBackground !== 'none'
      ? focusBackground
      : wordColors.length > 0 && wordColors[currentIndex]
        ? `linear-gradient(135deg, ${wordColors[currentIndex]}22 0%, ${wordColors[currentIndex]}11 100%)`
        : 'none';

  // Rect activo según fase
  const activeRect = showAll ? allWordsRect : focusRect;
  const cornerOpacity = isReady && currentIndex >= 0 ? 1 : 0;
  const cornerStyle = {
    borderColor: activeBorderColor,
    filter: `drop-shadow(0 0 4px ${activeBorderColor})`,
    zIndex: 20,
  };

  return (
    <div
      className="relative flex gap-[2px] justify-center items-center flex-wrap"
      ref={containerRef}
      style={{ outline: 'none', userSelect: 'none' }}
    >
      <Image
        src="/VIAJES-soar-logo-blues.png"
        alt="Logo"
        width={90}
        height={90}
        priority
        className="transition-all duration-500 object-contain h-auto w-[30px] lg:w-[40px] relative z-10 flex-shrink-0"
      />

      {/* ── CAPA 1: fondo del gradiente (z-0, detrás del texto) ── */}
      <motion.div
        className={`absolute top-0 left-0 pointer-events-none rounded-[4px] ${focusClassName}`}
        initial={{ opacity: 0 }}
        animate={{
          x: activeRect.x - bgPadding,
          y: activeRect.y - bgPadding,
          width: activeRect.width + bgPadding * 2,
          height: activeRect.height + bgPadding * 2,
          opacity: isReady && currentIndex >= 0 ? 1 : 0,
        }}
        transition={{ duration: animationDuration }}
        style={{
          zIndex: 0,
          ...(activeBackground ? { background: activeBackground } : {}),
        } as React.CSSProperties}
      />

      {/* ── CAPA 2: palabras (z-10, encima del fondo) ── */}
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        const wordColor = wordColors[index] ?? undefined;

        return (
          <span
            key={index}
            ref={el => { wordRefs.current[index] = el; }}
            className="relative text-[25px] lg:text-3xl font-bold tracking-wider highlighted-text-shadow"
            style={{
              zIndex: 10,
              color: wordColor,
              filter: showAll || isActive ? `blur(0px)` : `blur(${blurAmount}px)`,
              transition: `filter ${animationDuration}s ease`,
              outline: 'none',
              userSelect: 'none',
            } as React.CSSProperties}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      {/* ── CAPA 3: esquinas independientes (fix Safari — sin padre con transform) ── */}
      {/* Esquina top-left */}
      <motion.span
        className="absolute w-4 h-4 border-[3px] rounded-[3px] border-r-0 border-b-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ x: activeRect.x - 6, y: activeRect.y - 6, opacity: cornerOpacity }}
        transition={{ duration: animationDuration }}
        style={{ ...cornerStyle, top: 0, left: 0 } as React.CSSProperties}
      />
      {/* Esquina top-right */}
      <motion.span
        className="absolute w-4 h-4 border-[3px] rounded-[3px] border-l-0 border-b-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ x: activeRect.x + activeRect.width - 10, y: activeRect.y - 6, opacity: cornerOpacity }}
        transition={{ duration: animationDuration }}
        style={{ ...cornerStyle, top: 0, left: 0 } as React.CSSProperties}
      />
      {/* Esquina bottom-left */}
      <motion.span
        className="absolute w-4 h-4 border-[3px] rounded-[3px] border-r-0 border-t-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ x: activeRect.x - 6, y: activeRect.y + activeRect.height - 10, opacity: cornerOpacity }}
        transition={{ duration: animationDuration }}
        style={{ ...cornerStyle, top: 0, left: 0 } as React.CSSProperties}
      />
      {/* Esquina bottom-right */}
      <motion.span
        className="absolute w-4 h-4 border-[3px] rounded-[3px] border-l-0 border-t-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ x: activeRect.x + activeRect.width - 10, y: activeRect.y + activeRect.height - 10, opacity: cornerOpacity }}
        transition={{ duration: animationDuration }}
        style={{ ...cornerStyle, top: 0, left: 0 } as React.CSSProperties}
      />
    </div>
  );
};

export default TrueFocus;